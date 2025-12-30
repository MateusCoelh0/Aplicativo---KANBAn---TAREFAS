import React from 'react';
import { Trash2, Edit2, GripVertical } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function TaskCard({ task, onEdit, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const priorityColors = {
    alta: 'border-l-red-500 bg-red-50/30',
    média: 'border-l-amber-500 bg-amber-50/30',
    baixa: 'border-l-green-500 bg-green-50/30',
  };

  const priorityBadge = {
    alta: 'bg-red-100 text-red-700',
    média: 'bg-amber-100 text-amber-700',
    baixa: 'bg-green-100 text-green-700',
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isDragging ? 0.5 : 1, 
        y: 0, 
        scale: isDragging ? 1.05 : 1,
        transition: { duration: 0.3 }
      }}
      exit={{ opacity: 0, y: -20 }}
      className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-3.5 border-l-[3px] ${
        isDragging 
          ? 'border-l-blue-500 bg-blue-50 shadow-2xl cursor-grabbing' 
          : priorityColors[task.priority || 'média']
      } cursor-grab group relative touch-none select-none`}
    >
      {/* Indicador visual de arrastar */}
      <div className="absolute top-2 right-2 p-1.5 bg-slate-100 rounded-lg group-hover:bg-slate-200 transition-colors pointer-events-none">
        <GripVertical className="h-4 w-4 text-slate-400" />
      </div>

      {/* Título */}
      <h3 className="font-medium text-slate-800 text-[13px] leading-snug mb-2 pr-10 line-clamp-2">
        {task.title}
      </h3>

      {/* Descrição */}
      {task.description && (
        <p className="text-slate-500 text-xs leading-relaxed mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Informações extras */}
      <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-100">
        <span className={`text-[10px] px-2 py-1 rounded-md font-medium ${priorityBadge[task.priority || 'média']}`}>
          {task.priority || 'Média'}
        </span>
        
        {task.dueDate && (
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {new Date(task.dueDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
          </span>
        )}
      </div>

      {/* Botões de ação (aparecem no hover) */}
      <div className="absolute bottom-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(task);
          }}
          className="p-1.5 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600 transition-colors"
          title="Editar"
        >
          <Edit2 className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task._id);
          }}
          className="p-1.5 hover:bg-red-100 rounded-md text-slate-400 hover:text-red-600 transition-colors"
          title="Excluir"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  );
}