import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2 } from 'lucide-react';
import { notesAPI } from '../../src/services/api';

export default function NotesSidebar({ open, onClose }) {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (open && token) {
      loadNotes();
    }
  }, [open, token]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const response = await notesAPI.list(token);
      if (response.success) {
        setNotes(response.data || []);
      } else {
        setError('Erro ao carregar notas');
      }
    } catch (err) {
      console.error('Erro ao carregar notas:', err);
      setError('Erro ao carregar notas');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.title.trim() && !newNote.content.trim()) {
      return;
    }

    try {
      setError('');
      const response = await notesAPI.create({
        title: newNote.title || 'Nota sem título',
        content: newNote.content,
      }, token);
      
      if (response.success) {
        setNewNote({ title: '', content: '' });
        await loadNotes();
      } else {
        setError(response.message || 'Erro ao criar nota');
      }
    } catch (err) {
      console.error('Erro ao criar nota:', err);
      setError('Erro ao criar nota');
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      setError('');
      const response = await notesAPI.delete(id, token);
      if (response.success) {
        await loadNotes();
      } else {
        setError(response.message || 'Erro ao deletar nota');
      }
    } catch (err) {
      console.error('Erro ao deletar nota:', err);
      setError('Erro ao deletar nota');
    }
  };


  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, x: 400 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 400 }}
          className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-xl z-50 overflow-y-auto"
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
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

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
                disabled={loading}
                className="w-full px-3 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                {loading ? 'Salvando...' : 'Adicionar Nota'}
              </button>
            </form>

            {/* Notes List */}
            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-8 text-slate-400">
                  <p className="text-sm">Carregando notas...</p>
                </div>
              ) : notes.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <p className="text-sm">Nenhuma nota ainda</p>
                </div>
              ) : (
                notes.map((note) => (
                  <motion.div
                    key={note._id}
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
                        onClick={() => handleDeleteNote(note._id)}
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