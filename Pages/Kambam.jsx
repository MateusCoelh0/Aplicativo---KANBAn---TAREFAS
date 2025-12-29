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
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

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
      distance: 8,
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

    const activeTask = tasks.find(t => t._id === active.id);
    if (!activeTask) return;

    const targetStatus = over.id;
    
    // Validar se o status existe
    if (!['todo', 'in_progress', 'done'].includes(targetStatus)) {
      return;
    }

    try {
      // Se for movido para um status diferente
      if (activeTask.status !== targetStatus) {
        const tasksInTargetStatus = tasks.filter(t => t.status === targetStatus);
        const res = await tasksAPI.update(
          activeTask._id,
          {
            status: targetStatus,
            order: tasksInTargetStatus.length,
          },
          token
        );
        if (res.success) {
          loadUserAndTasks();
        } else {
          setError(res.message);
        }
      } else {
        // Se for reordenado dentro do mesmo status
        const res = await tasksAPI.update(
          activeTask._id,
          {
            status: targetStatus,
          },
          token
        );
        if (res.success) {
          loadUserAndTasks();
        } else {
          setError(res.message);
        }
      }
    } catch (err) {
      setError('Erro ao mover tarefa: ' + err.message);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div 
                className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-600 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
              >
                <Sparkles className="h-5 w-5 text-white" />
              </motion.div>
              <div>
                <h1 className="text-xl font-bold text-slate-800 tracking-tight">
                  Kanban
                </h1>
                <p className="text-xs text-slate-400">
                  {user?.name ? `Bem-vindo, ${user.name}` : 'Organize suas tarefas'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setNotesOpen(true)}
                className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Notas
              </button>
              <button
                onClick={() => handleAddClick('todo')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg shadow-lg flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Nova Tarefa
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sair
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

      {/* Kanban Board */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={(event) => setActiveDragId(event.active.id)}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 overflow-x-auto pb-6">
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
          <DragOverlay dropAnimation={{
            duration: 200,
            easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
          }}>
            {activeDragId ? (
              <motion.div
                className="bg-white rounded-lg shadow-2xl border-2 border-blue-400 p-4 cursor-grabbing transform rotate-3"
                style={{ width: '360px' }}
                initial={{ scale: 1, rotate: 0 }}
                animate={{ scale: 1.05, rotate: 3 }}
              >
                {(() => {
                  const task = tasks.find(t => t._id === activeDragId);
                  if (!task) return null;
                  
                  const priorityColors = {
                    alta: 'bg-red-100 text-red-700',
                    média: 'bg-yellow-100 text-yellow-700',
                    baixa: 'bg-green-100 text-green-700',
                  };
                  
                  return (
                    <div className="relative">
                      {/* Indicador de arrasto */}
                      <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full shadow-lg">
                        Arrastando...
                      </div>
                      
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <h3 className="font-semibold text-slate-800 flex-1 text-base">
                          {task.title}
                        </h3>
                        <GripVertical className="h-5 w-5 text-blue-400" />
                      </div>
                      
                      {task.description && (
                        <p className="text-sm text-slate-600 mb-3 line-clamp-3">
                          {task.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-3 py-1.5 rounded-lg font-medium ${priorityColors[task.priority || 'média']}`}>
                          {task.priority || 'Média'}
                        </span>
                        {task.dueDate && (
                          <span className="text-xs text-slate-500 font-medium">
                            📅 {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                          </span>
                        )}
                      </div>
                      
                      {task.assignee && (
                        <div className="mt-3 text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded">
                          👤 {task.assignee}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </motion.div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {tasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-slate-100 mb-4">
              <Sparkles className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              Comece a organizar
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              Crie sua primeira tarefa
            </p>
            <button
              onClick={() => handleAddClick('todo')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg flex items-center gap-2 mx-auto"
            >
              <Plus className="h-4 w-4" />
              Criar Tarefa
            </button>
          </motion.div>
        )}
      </main>

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