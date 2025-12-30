import React from 'react';
import { motion } from 'framer-motion';
import TaskCard from './TaskCard';
import { Plus } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

const statusLabels = {
  todo: { label: 'A Fazer', color: 'bg-slate-100' },
  in_progress: { label: 'Em Progresso', color: 'bg-blue-100' },
  done: { label: 'Concluído', color: 'bg-green-100' },
};

export default function KanbanColumn({ status, tasks, onDelete, onEdit, onAddClick }) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: {
      type: 'column',
      status: status,
    },
  });

  return (
    <motion.div
      layout
      ref={setNodeRef}
      className={`flex-shrink-0 w-[85vw] md:w-auto bg-gradient-to-br from-slate-800 to-slate-600 rounded-2xl p-4 flex flex-col h-[calc(100vh-12rem)] border-2 border-slate-700 transition-all snap-center ${
        isOver ? 'ring-2 ring-blue-400 border-blue-400 shadow-xl' : ''
      }`}
    >
      {/* Header da coluna */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-600">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            status === 'todo' ? 'bg-slate-300' : 
            status === 'in_progress' ? 'bg-blue-400' : 
            'bg-green-400'
          }`}></div>
          <h2 className="text-sm font-semibold text-white">{statusLabels[status].label}</h2>
          <span className="text-xs bg-slate-700 text-slate-200 px-2 py-0.5 rounded-full font-medium">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAddClick(status)}
          className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors"
          title="Adicionar tarefa"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <SortableContext
        items={tasks.map(t => t._id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-2.5 pr-1 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent scroll-smooth">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}

          {tasks.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <p className="text-sm">Nenhuma tarefa</p>
              <p className="text-xs mt-1">Clique no + para adicionar</p>
            </div>
          )}
        </div>
      </SortableContext>
    </motion.div>
  );
}