import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2 } from 'lucide-react';
import { noteService } from '../../src/services/dataService';

export default function NotesSidebar({ open, onClose }) {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: '', content: '' });

  useEffect(() => {
    if (open) {
      loadNotes();
    }
  }, [open]);

  const loadNotes = () => {
    try {
      const allNotes = noteService.listNotes();
      setNotes(allNotes);
    } catch (err) {
      console.error('Erro ao carregar notas:', err);
    }
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.title.trim() && !newNote.content.trim()) {
      return;
    }

    try {
      noteService.createNote({
        title: newNote.title || 'Nota sem título',
        content: newNote.content,
      });
      setNewNote({ title: '', content: '' });
      loadNotes();
    } catch (err) {
      console.error('Erro ao criar nota:', err);
    }
  };

  const handleDeleteNote = (id) => {
    try {
      noteService.deleteNote(id);
      loadNotes();
    } catch (err) {
      console.error('Erro ao deletar nota:', err);
    }
  };


  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, x: 400 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 400 }}
          className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl z-50 overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 flex items-center justify-between p-6 border-b border-slate-100 bg-white">
            <h2 className="text-lg font-semibold text-slate-800">Anotações</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            {/* New Note Form */}
            <form onSubmit={handleAddNote} className="space-y-3 p-4 bg-slate-50 rounded-lg">
              <input
                type="text"
                placeholder="Título da nota"
                value={newNote.title}
                onChange={(e) =>
                  setNewNote((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 text-sm"
              />
              <textarea
                placeholder="Conteúdo da nota"
                value={newNote.content}
                onChange={(e) =>
                  setNewNote((prev) => ({ ...prev, content: e.target.value }))
                }
                rows="3"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 text-sm"
              />
              <button
                type="submit"
                className="w-full px-3 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 text-sm font-medium flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Adicionar Nota
              </button>
            </form>

            {/* Notes List */}
            <div className="space-y-3">
              {notes.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <p className="text-sm">Nenhuma nota ainda</p>
                </div>
              ) : (
                notes.map((note) => (
                  <motion.div
                    key={note.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 group hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-slate-800 text-sm">
                        {note.title}
                      </h3>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-100 rounded text-slate-400 hover:text-red-600 transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-slate-600 text-xs whitespace-pre-wrap">
                      {note.content}
                    </p>
                    <p className="text-xs text-slate-400 mt-2">
                      {new Date(note.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}