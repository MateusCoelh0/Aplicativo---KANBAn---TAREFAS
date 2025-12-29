// Serviço de gerenciamento de dados local com localStorage
const STORAGE_KEY = 'kambam_tasks';
const NOTES_KEY = 'kambam_notes';

// Dados iniciais
const initialTasks = [
  {
    id: '1',
    title: 'Design do projeto',
    description: 'Criar mockups e wireframes',
    status: 'done',
    priority: 'high',
    order: 0,
    dueDate: new Date(2025, 11, 20).toISOString(),
    assignee: 'João',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Desenvolver backend',
    description: 'API REST com Node.js',
    status: 'in_progress',
    priority: 'high',
    order: 0,
    dueDate: new Date(2025, 12, 31).toISOString(),
    assignee: 'Maria',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Testes unitários',
    description: 'Escrever testes para componentes',
    status: 'todo',
    priority: 'medium',
    order: 0,
    dueDate: new Date(2026, 0, 15).toISOString(),
    assignee: 'Pedro',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const initialNotes = [
  {
    id: '1',
    title: 'Ideias para o projeto',
    content: 'Adicionar notificações em tempo real e melhorar UX',
    createdAt: new Date().toISOString(),
  },
];

// Inicializar localStorage
function initStorage() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTasks));
  }
  if (!localStorage.getItem(NOTES_KEY)) {
    localStorage.setItem(NOTES_KEY, JSON.stringify(initialNotes));
  }
}

// Tasks
export const taskService = {
  listTasks: () => {
    try {
      initStorage();
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  },

  getTask: (id) => {
    const tasks = taskService.listTasks();
    return tasks.find(t => t.id === id);
  },

  createTask: (data) => {
    const tasks = taskService.listTasks();
    const newTask = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    tasks.push(newTask);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return newTask;
  },

  updateTask: (id, data) => {
    const tasks = taskService.listTasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      tasks[index] = {
        ...tasks[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      return tasks[index];
    }
    return null;
  },

  deleteTask: (id) => {
    const tasks = taskService.listTasks();
    const filtered = tasks.filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },
};

// Notes
export const noteService = {
  listNotes: () => {
    try {
      initStorage();
      return JSON.parse(localStorage.getItem(NOTES_KEY)) || [];
    } catch {
      return [];
    }
  },

  createNote: (data) => {
    const notes = noteService.listNotes();
    const newNote = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
    };
    notes.push(newNote);
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    return newNote;
  },

  updateNote: (id, data) => {
    const notes = noteService.listNotes();
    const index = notes.findIndex(n => n.id === id);
    if (index !== -1) {
      notes[index] = { ...notes[index], ...data };
      localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
      return notes[index];
    }
    return null;
  },

  deleteNote: (id) => {
    const notes = noteService.listNotes();
    const filtered = notes.filter(n => n.id !== id);
    localStorage.setItem(NOTES_KEY, JSON.stringify(filtered));
    return true;
  },
};
