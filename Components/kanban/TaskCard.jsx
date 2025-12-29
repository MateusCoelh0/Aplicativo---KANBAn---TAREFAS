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
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityColors = {
    alta: 'bg-red-100 text-red-700',
    média: 'bg-yellow-100 text-yellow-700',
    baixa: 'bg-green-100 text-green-700',
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 border border-slate-100 cursor-grab active:cursor-grabbing group ${isDragging ? 'opacity-50' : ''}`}
    >
      <div className="flex justify-between items-start mb-2 gap-2">
        <div 
          {...attributes}
          {...listeners}
          className="p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing mt-1 flex-shrink-0"
        >
          <GripVertical className="h-4 w-4 text-slate-400" />
        </div>
        <h3 className="font-semibold text-slate-800 text-sm flex-1">{task.title}</h3>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="p-1 hover:bg-red-100 rounded text-slate-400 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-slate-600 text-xs mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center justify-between">
        <span className={`text-xs px-2 py-1 rounded ${priorityColors[task.priority || 'média']}`}>
          {task.priority || 'Média'}
        </span>
        {task.dueDate && (
          <span className="text-xs text-slate-400">
            {new Date(task.dueDate).toLocaleDateString('pt-BR')}
          </span>
        )}
      </div>

      {task.assignee && (
        <div className="mt-3 text-xs text-slate-500">
          Responsável: {task.assignee}
        </div>
      )}
    </motion.div>
  );
}