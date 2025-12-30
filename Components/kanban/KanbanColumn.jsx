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
      className={`flex-shrink-0 w-[85vw] sm:w-80 lg:w-96 bg-gradient-to-br from-slate-800 to-slate-600 rounded-xl p-3 sm:p-4 border-2 border-slate-700 transition-all snap-center ${
        isOver ? 'ring-2 ring-blue-400 border-blue-400' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-white">{statusLabels[status].label}</h2>
          <span className="text-xs bg-slate-700 text-slate-200 px-2 py-1 rounded-full">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAddClick(status)}
          className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <SortableContext
        items={tasks.map(t => t._id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3 min-h-[400px] sm:min-h-[600px] overflow-y-auto pr-2">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}

          {tasks.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <p className="text-sm">Nenhuma tarefa aqui</p>
            </div>
          )}
        </div>
      </SortableContext>
    </motion.div>
  );
}