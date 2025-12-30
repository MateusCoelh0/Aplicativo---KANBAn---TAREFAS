import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tasksAPI, authAPI } from '../src/services/api';
import KanbanColumn from '../Components/kanban/KanbanColumn';
import TaskModal from '../Components/kanban/TaskModal';
import NotesSidebar from '../Components/notes/NoteSidebar';
import { Plus, FileText, Sparkles, AlertCircle, GripVertical, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';

export default function Kanban() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState('todo');
  const [error, setError] = useState(null);
  const [activeDragId, setActiveDragId] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Carregar usuário e tarefas ao montar o componente
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    loadUserAndTasks();
  }, [token, navigate]);

  const loadUserAndTasks = async () => {
    try {
      setLoading(true);
      console.log('🔄 Carregando usuário e tarefas...', 'Token:', token?.substring(0, 20) + '...');
      
      // Obter usuário atual
      const userRes = await authAPI.getCurrentUser(token);
      console.log('📧 Resposta /api/auth/me:', userRes);
      
      if (userRes.success) {
        setUser(userRes.data);
        console.log('✅ Usuário carregado:', userRes.data.name);
      } else {
        console.error('❌ Erro ao obter usuário:', userRes.message);
        setError('Erro ao carregar usuário: ' + userRes.message);
      }

      // Carregar tarefas
      const tasksRes = await tasksAPI.list(token);
      console.log('📋 Resposta /api/tasks:', tasksRes);
      
      if (tasksRes.success) {
        setTasks(tasksRes.data);
        setError(null);
        console.log('✅ Tarefas carregadas:', tasksRes.data.length);
      } else {
        console.error('❌ Erro ao listar tarefas:', tasksRes.message);
        setError(tasksRes.message);
      }
    } catch (err) {
      console.error('❌ Erro ao carregar dados:', err);
      setError('Erro ao carregar dados: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const columns = {
    todo: tasks.filter(t => t.status === 'todo').sort((a, b) => a.order - b.order),
    in_progress: tasks.filter(t => t.status === 'in_progress').sort((a, b) => a.order - b.order),
    done: tasks.filter(t => t.status === 'done').sort((a, b) => a.order - b.order),
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    
    setActiveDragId(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeTask = tasks.find(t => t._id === activeId);
    if (!activeTask) return;

    // Determinar o status de destino
    let targetStatus;
    const overTask = tasks.find(t => t._id === overId);
    
    if (overTask) {
      // Se soltou em cima de outro card, usar o status desse card
      targetStatus = overTask.status;
    } else if (['todo', 'in_progress', 'done'].includes(overId)) {
      // Se soltou na coluna vazia
      targetStatus = overId;
    } else {
      return;
    }

    // Atualizar estado local IMEDIATAMENTE
    setTasks(prevTasks => {
      const oldIndex = prevTasks.findIndex(t => t._id === activeId);
      const newIndex = overTask 
        ? prevTasks.findIndex(t => t._id === overId)
        : prevTasks.filter(t => t.status === targetStatus).length;

      // Se mudou de status
      if (activeTask.status !== targetStatus) {
        const updated = prevTasks.map(t => 
          t._id === activeId 
            ? { ...t, status: targetStatus, order: newIndex }
            : t
        );
        return updated;
      }

      // Se apenas mudou ordem na mesma coluna
      if (oldIndex !== newIndex) {
        return arrayMove(prevTasks, oldIndex, newIndex);
      }

      return prevTasks;
    });

    // Atualizar no backend em background
    try {
      await tasksAPI.update(
        activeId,
        { status: targetStatus },
        token
      );
    } catch (err) {
      console.error('Erro ao atualizar tarefa:', err);
      // Reverter se der erro
      loadUserAndTasks();
    }
  };

  const handleSaveTask = async (taskData) => {
    try {
      console.log('🔍 Salvando tarefa:', taskData);
      console.log('🔑 Token:', token);
      
      if (taskData._id) {
        const res = await tasksAPI.update(taskData._id, taskData, token);
        console.log('📝 Resposta update:', res);
        if (!res.success) {
          setError(res.message);
          return;
        }
      } else {
        // Calcular ordem baseada nas tarefas existentes
        const tasksInStatus = tasks.filter(t => t.status === (taskData.status || 'todo'));
        const dataToSend = {
          ...taskData,
          order: tasksInStatus.length,
        };
        console.log('📤 Enviando para criar:', dataToSend);
        
        const res = await tasksAPI.create(dataToSend, token);
        console.log('📝 Resposta create:', res);
        
        if (!res.success) {
          setError(res.message || 'Erro ao criar tarefa');
          console.error('❌ Erro na resposta:', res);
          return;
        }
      }
      await loadUserAndTasks();
      setEditingTask(null);
      setModalOpen(false);
    } catch (err) {
      console.error('❌ Erro no catch:', err);
      setError('Erro ao salvar tarefa: ' + err.message);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const res = await tasksAPI.delete(id, token);
      if (res.success) {
        loadUserAndTasks();
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('Erro ao deletar tarefa: ' + err.message);
    }
  };

  const handleAddClick = (status) => {
    setDefaultStatus(status);
    setEditingTask(null);
    setModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      // Fazer logout no backend
      await authAPI.logout();
    } catch (err) {
      console.error('Erro ao fazer logout no backend:', err);
    }
    
    // Limpar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Deslogar do Google
    logoutGoogle();
    
    // Redirecionar para login
    navigate('/login');
  };

  const logoutGoogle = () => {
    // Deslogar do Google usando a API
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/platform.js';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      if (window.gapi && window.gapi.auth2) {
        const auth2 = window.gapi.auth2.getAuthInstance();
        if (auth2) {
          auth2.signOut().then(() => {
            console.log('✅ Deslogado do Google');
          });
        }
      }
    };
    
    document.head.appendChild(script);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="h-12 w-12 border-4 border-slate-300 border-t-slate-800 rounded-full"
        />
      </div>
    );
  }

  const handleEditTask = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex flex-col relative overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-4">
          <div className="flex items-center justify-between gap-1 sm:gap-2">
            <div className="flex items-center gap-1 sm:gap-3 min-w-0 flex-1">
              {/* Logo FlowDuo */}
              <motion.div 
                className="flex items-center gap-1 sm:gap-2"
                whileHover={{ scale: 1.02 }}
              >
                <svg 
                  className="h-6 w-auto sm:h-10" 
                  viewBox="0 0 200 80" 
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    filter: 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {/* F */}
                  <path d="M 20 20 L 20 60 M 20 20 L 45 20 M 20 40 L 42 40" 
                        stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" fill="none"/>
                  
                  {/* Círculo do O com efeito de fluxo */}
                  <circle cx="65" cy="40" r="15" 
                          stroke="#3b82f6" strokeWidth="4" fill="none"/>
                  <circle cx="65" cy="40" r="8" 
                          fill="#3b82f6" opacity="0.3"/>
                  
                  {/* Setas de fluxo */}
                  <path d="M 85 35 L 95 40 L 85 45" 
                        stroke="#3b82f6" strokeWidth="3" fill="none" strokeLinecap="round"/>
                  <path d="M 90 40 L 105 40" 
                        stroke="#3b82f6" strokeWidth="3" strokeLinecap="round"/>
                  
                  {/* D */}
                  <path d="M 115 20 L 115 60 M 115 20 Q 145 20 145 40 Q 145 60 115 60" 
                        stroke="#8b5cf6" strokeWidth="4" strokeLinecap="round" fill="none"/>
                  
                  {/* U com duplo traço */}
                  <path d="M 155 20 L 155 45 Q 155 60 170 60 Q 185 60 185 45 L 185 20" 
                        stroke="#8b5cf6" strokeWidth="4" strokeLinecap="round" fill="none"/>
                  <path d="M 157 35 L 157 45 Q 157 55 170 55 Q 183 55 183 45 L 183 35" 
                        stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5"/>
                </svg>
              </motion.div>
              
              <div className="min-w-0 hidden sm:block">
                <h1 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight truncate">
                  FlowDuo
                </h1>
                <p className="text-xs text-slate-400 truncate">
                  {user?.name ? `Bem-vindo, ${user.name}` : 'Organize suas tarefas'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <button
                onClick={() => setNotesOpen(true)}
                className="p-2 sm:px-3 sm:py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg flex items-center gap-1.5"
                title="Notas"
              >
                <FileText className="h-4 w-4" />
                <span className="hidden lg:inline text-sm">Notas</span>
              </button>
              <button
                onClick={() => handleAddClick('todo')}
                className="p-2 sm:px-3 sm:py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg shadow-lg flex items-center gap-1.5"
                title="Nova Tarefa"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden lg:inline text-sm">Nova Tarefa</span>
              </button>
              <button
                onClick={handleLogout}
                className="hidden sm:flex p-2 sm:px-3 sm:py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg items-center gap-1.5"
                title="Sair"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden lg:inline text-sm">Sair</span>
              </button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 p-4 bg-red-500 text-white rounded-lg shadow-2xl flex items-center gap-3 min-w-[300px]"
            >
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span className="font-medium">{error}</span>
              <button 
                onClick={() => setError(null)}
                className="ml-auto text-white hover:text-red-100"
              >
                ✕
              </button>
            </motion.div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto py-4 sm:py-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={(event) => setActiveDragId(event.active.id)}
          onDragEnd={handleDragEnd}
          autoScroll={{
            enabled: true,
            threshold: { x: 0.2, y: 0.2 },
            acceleration: 5,
            interval: 5,
          }}
        >
          {/* Mobile: Scroll horizontal | Tablet+: Grid */}
          <div className="lg:grid lg:grid-cols-3 lg:gap-4 md:grid md:grid-cols-2 md:gap-4 md:px-6 flex lg:flex-none md:flex-none overflow-x-auto gap-4 px-4 pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
            {['todo', 'in_progress', 'done'].map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                tasks={columns[status]}
                onDelete={handleDeleteTask}
                onEdit={handleEditTask}
                onAddClick={handleAddClick}
              />
            ))}
          </div>

          {/* Drag Overlay - Preview do card sendo arrastado */}
          <DragOverlay 
            dropAnimation={{
              duration: 300,
              easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
            }}
          >
            {activeDragId ? (
              <div
                className="bg-white rounded-xl shadow-2xl border-2 border-blue-500 p-3.5 w-full max-w-sm opacity-90"
                style={{ cursor: 'grabbing' }}
              >
                {(() => {
                  const task = tasks.find(t => t._id === activeDragId);
                  if (!task) return null;
                  
                  const priorityBadge = {
                    alta: 'bg-red-100 text-red-700',
                    média: 'bg-amber-100 text-amber-700',
                    baixa: 'bg-green-100 text-green-700',
                  };
                  
                  return (
                    <div className="relative">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-medium text-slate-800 text-sm flex-1">{task.title}</h3>
                        <GripVertical className="h-4 w-4 text-blue-500" />
                      </div>
                      
                      {task.description && (
                        <p className="text-xs text-slate-600 mb-2 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-2 py-1 rounded-md font-medium ${priorityBadge[task.priority || 'média']}`}>
                          {task.priority || 'Média'}
                        </span>
                        {task.dueDate && (
                          <span className="text-[10px] text-slate-400">
                            {new Date(task.dueDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>

      {/* Botão de Logout Flutuante (Mobile) */}
      <button
        onClick={handleLogout}
        className="sm:hidden fixed bottom-6 right-6 p-3 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg z-40 flex items-center justify-center"
        title="Sair"
      >
        <LogOut className="h-5 w-5" />
      </button>

      {/* Rodapé */}
      <footer className="bg-white border-t border-slate-100 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-center">
            <p className="text-sm text-slate-600">
              Desenvolvido por <span className="font-semibold text-slate-800">Mateus Coelho</span>
            </p>
            <span className="text-slate-300">|</span>
            <a
              href="https://www.linkedin.com/in/mateus-afranio-8302731b5"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
              aria-label="LinkedIn de Mateus Coelho"
            >
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span className="text-sm font-medium">LinkedIn</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <TaskModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTask(null); }}
        onSave={handleSaveTask}
        task={editingTask}
        defaultStatus={defaultStatus}
      />

      <NotesSidebar 
        open={notesOpen} 
        onClose={() => setNotesOpen(false)} 
      />
    </div>
  );
}