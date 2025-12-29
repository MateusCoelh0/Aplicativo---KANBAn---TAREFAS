import React from 'react';
import { DragOverlay } from '@dnd-kit/core';
import { useDndContext } from '@dnd-kit/core';

export default function DragOverlayCard({ tasks }) {
  const { active } = useDndContext();
  
  if (!active) {
    return null;
  }

  const draggedTask = tasks.find(t => t.id === active.id);
  
  if (!draggedTask) {
    return null;
  }

  const priorityColors = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-green-100 text-green-700',
  };

  return (
    <DragOverlay>
      <div className="bg-white rounded-lg shadow-2xl p-4 border border-slate-100 w-80 opacity-90">
        <h3 className="font-semibold text-slate-800 text-sm mb-2">{draggedTask.title}</h3>
        
        {draggedTask.description && (
          <p className="text-slate-600 text-xs mb-3 line-clamp-2">{draggedTask.description}</p>
        )}

        <div className="flex items-center justify-between">
          <span className={`text-xs px-2 py-1 rounded ${priorityColors[draggedTask.priority || 'medium']}`}>
            {draggedTask.priority || 'Média'}
          </span>
          {draggedTask.dueDate && (
            <span className="text-xs text-slate-400">
              {new Date(draggedTask.dueDate).toLocaleDateString('pt-BR')}
            </span>
          )}
        </div>
      </div>
    </DragOverlay>
  );
}
