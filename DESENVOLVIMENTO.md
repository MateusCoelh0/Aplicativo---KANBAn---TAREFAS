# 📘 DESENVOLVIMENTO - FlowDuo

Este documento detalha o processo completo de desenvolvimento do projeto FlowDuo, desde a concepção até a implementação final.

---

## 📖 Índice

- [Visão Geral](#-visão-geral)
- [Fase 1: Planejamento](#-fase-1-planejamento)
- [Fase 2: Setup Inicial](#-fase-2-setup-inicial)
- [Fase 3: Backend - API](#-fase-3-backend---api)
- [Fase 4: Frontend - Interface](#-fase-4-frontend---interface)
- [Fase 5: Autenticação](#-fase-5-autenticação)
- [Fase 6: Sistema Kanban](#-fase-6-sistema-kanban)
- [Fase 7: Sistema de Notas](#-fase-7-sistema-de-notas)
- [Fase 8: Testes e Refinamentos](#-fase-8-testes-e-refinamentos)
- [Desafios e Soluções](#-desafios-e-soluções)
- [Lições Aprendidas](#-lições-aprendidas)

---

## 🎯 Visão Geral

O FlowDuo foi desenvolvido como uma solução moderna para gerenciamento de tarefas, integrando:
- Sistema Kanban interativo
- Autenticação robusta
- Persistência de dados
- Interface responsiva e animada

**Tempo Total de Desenvolvimento**: ~40 horas  
**Stack**: MERN (MongoDB, Express, React, Node.js)  
**Padrão**: Arquitetura REST API

---

## 📋 Fase 1: Planejamento

### Objetivos Definidos
1. ✅ Criar um sistema Kanban funcional
2. ✅ Implementar autenticação completa
3. ✅ Adicionar sistema de notas
4. ✅ Design moderno e responsivo
5. ✅ Deploy em produção

### Requisitos Levantados

#### Funcionais
- Registro e login de usuários
- Verificação de email
- Recuperação de senha
- CRUD de tarefas
- Drag-and-drop de tarefas
- CRUD de notas
- Priorização de tarefas

#### Não Funcionais
- Performance: Carregamento < 2s
- Segurança: Senhas em hash, JWT
- UX: Interface intuitiva
- Responsividade: Mobile-first

### Tecnologias Escolhidas

| Categoria | Tecnologia | Justificativa |
|-----------|-----------|---------------|
| **Frontend** | React 18.2 | Componentes reutilizáveis, ecossistema rico |
| **Build Tool** | Vite 4.4 | Fast refresh, build otimizado |
| **Styling** | Tailwind CSS | Desenvolvimento rápido, customizável |
| **Animações** | Framer Motion | Animações declarativas e performáticas |
| **Drag-and-Drop** | @dnd-kit | Moderno, acessível, TypeScript |
| **Backend** | Express 4.18 | Minimalista, flexível |
| **Database** | MongoDB 6.0 | NoSQL, flexível para tarefas |
| **ODM** | Mongoose 8.0 | Schemas, validações, middlewares |
| **Autenticação** | Passport.js + JWT | Estratégias múltiplas, stateless |

---

## 🔧 Fase 2: Setup Inicial

### 2.1. Estrutura de Pastas

```bash
# Criação da estrutura base
mkdir flowduo
cd flowduo
mkdir backend src Pages Components Entities
mkdir backend/{config,middleware,models,routes,utils}
mkdir Components/{auth,kanban,notes}
mkdir src/{config,services,styles}
```

### 2.2. Inicialização do Projeto

#### Frontend
```bash
npm create vite@latest . -- --template react
npm install react-router-dom @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm install framer-motion lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

#### Backend
```bash
cd backend
npm init -y
npm install express mongoose cors dotenv express-session
npm install passport passport-google-oauth20 jsonwebtoken bcryptjs
npm install nodemailer
npm install -D nodemon
```

### 2.3. Configurações Base

#### Tailwind Config (`tailwind.config.js`)
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./Pages/**/*.{js,ts,jsx,tsx}",
    "./Components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

#### Vite Config (`vite.config.js`)
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
})
```

---

## 🔌 Fase 3: Backend - API

### 3.1. Configuração do Banco de Dados

**Arquivo**: `backend/config/database.js`

```javascript
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB conectado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error.message);
    process.exit(1);
  }
};

export default connectDB;
```

**Decisões**:
- ✅ Mongoose para schemas e validações
- ✅ Conexão assíncrona com tratamento de erros
- ✅ Exit code 1 em caso de falha

### 3.2. Modelos de Dados

#### User Model (`backend/models/User.js`)

```javascript
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // Verificação de email
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationToken: String,
  emailVerificationTokenExpires: Date,
  
  // Reset de senha
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
  
  // Brute force protection
  loginAttempts: { type: Number, default: 0 },
  lockUntil: Date,
  
  // OAuth
  googleId: String,
  
  lastLogin: Date,
}, { timestamps: true });

// Hash de senha antes de salvar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Método para comparar senhas
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
```

**Recursos Implementados**:
- ✅ Hash automático de senhas (bcrypt, 10 rounds)
- ✅ Verificação de email com token e expiração
- ✅ Reset de senha seguro
- ✅ Proteção contra brute force
- ✅ Suporte a OAuth (Google)
- ✅ Timestamps automáticos

#### Task Model (`backend/models/Task.js`)

```javascript
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: {
    type: String,
    enum: ['todo', 'inProgress', 'done'],
    default: 'todo'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  assignedTo: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Task', taskSchema);
```

**Decisões**:
- ✅ Status com enum para prevenir valores inválidos
- ✅ Campo `order` para ordenação personalizada
- ✅ Referência ao usuário (proteção de dados)

#### Note Model (`backend/models/Note.js`)

```javascript
import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  content: { type: String, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
}, { timestamps: true });

export default mongoose.model('Note', noteSchema);
```

### 3.3. Rotas de Autenticação

**Arquivo**: `backend/routes/auth.js`

#### Endpoints Implementados

| Método | Rota | Descrição | Proteção |
|--------|------|-----------|----------|
| POST | `/api/auth/register` | Registrar novo usuário | Pública |
| POST | `/api/auth/verify-email` | Verificar email | Pública |
| POST | `/api/auth/login` | Fazer login | Pública |
| POST | `/api/auth/forgot-password` | Solicitar reset de senha | Pública |
| POST | `/api/auth/reset-password` | Redefinir senha | Pública |
| GET | `/api/auth/google` | Iniciar OAuth Google | Pública |
| GET | `/api/auth/google/callback` | Callback OAuth Google | Pública |
| GET | `/api/auth/me` | Obter dados do usuário | Privada (JWT) |
| POST | `/api/auth/logout` | Fazer logout | Privada (JWT) |

#### Fluxo de Registro

```javascript
// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    
    // 1. Validações
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }
    
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'As senhas não coincidem' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ message: 'A senha deve ter pelo menos 6 caracteres' });
    }
    
    // 2. Verificar email duplicado
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Este email já está cadastrado' });
    }
    
    // 3. Gerar token de verificação
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
    
    // 4. Criar usuário
    const user = new User({
      name,
      email,
      password, // Será hasheado pelo middleware
      emailVerificationToken: hashedToken,
      emailVerificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 horas
    });
    
    await user.save();
    
    // 5. Enviar email de verificação
    await sendVerificationEmail(email, verificationToken);
    
    res.status(201).json({
      success: true,
      message: 'Usuário criado! Verifique seu email.',
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor' });
  }
});
```

**Segurança Implementada**:
- ✅ Validação de todos os campos
- ✅ Verificação de email duplicado
- ✅ Token de verificação com hash SHA-256
- ✅ Expiração de 24 horas
- ✅ Senha hasheada automaticamente

#### Fluxo de Login

```javascript
// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 1. Validações básicas
    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }
    
    // 2. Buscar usuário
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email ou senha incorretos' });
    }
    
    // 3. Verificar se email foi verificado
    if (!user.isEmailVerified && !user.googleId) {
      return res.status(403).json({
        message: 'Por favor, verifique seu email antes de fazer login',
      });
    }
    
    // 4. Verificar se conta está bloqueada
    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(403).json({
        message: 'Conta bloqueada. Tente novamente mais tarde.',
      });
    }
    
    // 5. Validar senha
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      // Incrementar tentativas
      user.loginAttempts += 1;
      if (user.loginAttempts >= 5) {
        user.lockUntil = Date.now() + 30 * 60 * 1000; // 30 minutos
      }
      await user.save();
      
      return res.status(401).json({ message: 'Email ou senha incorretos' });
    }
    
    // 6. Reset de tentativas e atualizar último login
    user.loginAttempts = 0;
    user.lockUntil = null;
    user.lastLogin = Date.now();
    await user.save();
    
    // 7. Gerar JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor' });
  }
});
```

**Proteções**:
- ✅ Verificação obrigatória de email
- ✅ Bloqueio após 5 tentativas falhas
- ✅ Bloqueio temporário de 30 minutos
- ✅ Reset automático de tentativas
- ✅ JWT com expiração de 7 dias

### 3.4. Middleware de Autenticação

**Arquivo**: `backend/middleware/auth.js`

```javascript
import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido ou expirado' });
    }
    req.userId = decoded.userId;
    next();
  });
};
```

### 3.5. Serviço de Email

**Arquivo**: `backend/utils/emailService.js`

```javascript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: '✅ Verifique seu email - FlowDuo',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Bem-vindo ao FlowDuo!</h2>
        <p>Clique no link abaixo para verificar seu email:</p>
        <a href="${verificationUrl}" style="...">Verificar Email</a>
        <p>Este link expira em 24 horas.</p>
      </div>
    `,
  };
  
  await transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async (email, token) => {
  // Similar ao de verificação
};
```

**Suporte**:
- ✅ Mailtrap (desenvolvimento)
- ✅ Gmail (produção)
- ✅ Templates HTML responsivos

### 3.6. Configuração do Passport (OAuth)

**Arquivo**: `backend/config/passport.js`

```javascript
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Buscar usuário existente
        let user = await User.findOne({ googleId: profile.id });
        
        if (!user) {
          // Criar novo usuário
          user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            isEmailVerified: true, // Google já verificou
            password: Math.random().toString(36), // Senha aleatória
          });
          await user.save();
        }
        
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

export default passport;
```

---

## 🎨 Fase 4: Frontend - Interface

### 4.1. Configuração de Rotas

**Arquivo**: `src/App.jsx`

```javascript
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../Pages/Login';
import Register from '../Pages/Register';
import Dashboard from '../Pages/Dashboard';
import VerifyEmail from '../Components/auth/VerifyEmail';
import ForgotPassword from '../Pages/ForgotPassword';
import { authService } from './services/authService';

function ProtectedRoute({ element }) {
  const token = authService.getToken();
  return token ? element : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
```

### 4.2. Serviço de Autenticação

**Arquivo**: `src/services/authService.js`

```javascript
import api from './api';

export const authService = {
  // Login
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },
  
  // Registro
  register: async (name, email, password, confirmPassword) => {
    const response = await api.post('/auth/register', {
      name,
      email,
      password,
      confirmPassword,
    });
    return response.data;
  },
  
  // Verificar email
  verifyEmail: async (token) => {
    const response = await api.post('/auth/verify-email', { token });
    return response.data;
  },
  
  // Logout
  logout: () => {
    localStorage.removeItem('token');
  },
  
  // Obter token
  getToken: () => localStorage.getItem('token'),
  
  // Verificar autenticação
  isAuthenticated: () => !!localStorage.getItem('token'),
};
```

### 4.3. Componentes de Autenticação

#### LoginForm.jsx

```javascript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../src/services/authService';

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await authService.login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Campos do formulário */}
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
      <button type="button" onClick={handleGoogleLogin}>
        Entrar com Google
      </button>
    </form>
  );
}
```

---

## 🔐 Fase 5: Autenticação

### Implementação Completa

1. ✅ **Registro de Usuário**
   - Validação de campos
   - Hash de senha
   - Geração de token de verificação
   - Envio de email

2. ✅ **Verificação de Email**
   - Token único com expiração
   - Link de verificação
   - Confirmação visual

3. ✅ **Login**
   - Validação de credenciais
   - Verificação obrigatória de email
   - Proteção contra brute force
   - Geração de JWT

4. ✅ **Recuperação de Senha**
   - Solicitação de reset
   - Email com token
   - Redefinição segura
   - Desbloqueio de conta

5. ✅ **Login com Google OAuth**
   - Integração com Passport.js
   - Criação automática de usuário
   - Email pré-verificado
   - JWT gerado

### Fluxo Completo

```
┌─────────────┐
│   Registro  │
└─────┬───────┘
      │
      ├─ Validações
      ├─ Hash de senha
      ├─ Gerar token
      └─ Enviar email
            │
            v
      ┌──────────────┐
      │ Verificação  │
      │   de Email   │
      └──────┬───────┘
             │
             v
       ┌──────────┐
       │  Login   │
       └────┬─────┘
            │
            ├─ Validar credenciais
            ├─ Verificar email
            ├─ Gerar JWT
            └─ Redirecionar
                  │
                  v
            ┌──────────┐
            │ Dashboard│
            └──────────┘
```

---

## 📊 Fase 6: Sistema Kanban

### 6.1. Implementação do Drag-and-Drop

**Biblioteca**: @dnd-kit

**Arquivo**: `Pages/Kambam.jsx`

```javascript
import { DndContext, DragOverlay, closestCorners } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

function Kambam() {
  const [tasks, setTasks] = useState([]);
  const [activeId, setActiveId] = useState(null);
  
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };
  
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const activeTask = tasks.find(t => t._id === active.id);
    const newStatus = over.id; // 'todo', 'inProgress', 'done'
    
    // Atualizar localmente
    setTasks(tasks.map(t =>
      t._id === active.id ? { ...t, status: newStatus } : t
    ));
    
    // Atualizar no backend
    await dataService.updateTask(active.id, { status: newStatus });
    
    setActiveId(null);
  };
  
  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="kanban-board">
        {['todo', 'inProgress', 'done'].map(status => (
          <KanbanColumn key={status} status={status} tasks={tasks} />
        ))}
      </div>
      
      <DragOverlay>
        {activeId ? <DragOverlayCard task={tasks.find(t => t._id === activeId)} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
```

### 6.2. Componentes Kanban

#### KanbanColumn.jsx

```javascript
import { useDroppable } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';

export default function KanbanColumn({ status, tasks }) {
  const { setNodeRef } = useDroppable({ id: status });
  const columnTasks = tasks.filter(t => t.status === status);
  
  return (
    <div ref={setNodeRef} className="kanban-column">
      <h2>{statusLabels[status]}</h2>
      <SortableContext items={columnTasks.map(t => t._id)}>
        {columnTasks.map(task => (
          <TaskCard key={task._id} task={task} />
        ))}
      </SortableContext>
    </div>
  );
}
```

#### TaskCard.jsx

```javascript
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';

export default function TaskCard({ task }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task._id,
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`task-card priority-${task.priority}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <span className="priority-badge">{task.priority}</span>
    </motion.div>
  );
}
```

### 6.3. CRUD de Tarefas

#### Criar Tarefa

```javascript
const createTask = async (taskData) => {
  const response = await api.post('/tasks', {
    ...taskData,
    userId: getUserId(), // Do token JWT
  });
  return response.data;
};
```

#### Atualizar Tarefa

```javascript
const updateTask = async (taskId, updates) => {
  const response = await api.put(`/tasks/${taskId}`, updates);
  return response.data;
};
```

#### Deletar Tarefa

```javascript
const deleteTask = async (taskId) => {
  await api.delete(`/tasks/${taskId}`);
};
```

---

## 📝 Fase 7: Sistema de Notas

### 7.1. Sidebar de Notas

**Arquivo**: `Components/notes/NoteSidebar.jsx`

```javascript
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Trash2 } from 'lucide-react';
import dataService from '../../src/services/dataService';

export default function NoteSidebar() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    loadNotes();
  }, []);
  
  const loadNotes = async () => {
    const data = await dataService.getNotes();
    setNotes(data);
  };
  
  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    
    await dataService.createNote({ content: newNote });
    setNewNote('');
    loadNotes();
  };
  
  const handleDeleteNote = async (id) => {
    await dataService.deleteNote(id);
    loadNotes();
  };
  
  return (
    <motion.div
      initial={{ x: 300 }}
      animate={{ x: isOpen ? 0 : 280 }}
      className="note-sidebar"
    >
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X /> : <Plus />}
      </button>
      
      {isOpen && (
        <div className="notes-container">
          <input
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Nova nota..."
          />
          <button onClick={handleAddNote}>Adicionar</button>
          
          <AnimatePresence>
            {notes.map(note => (
              <motion.div
                key={note._id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="note-item"
              >
                <p>{note.content}</p>
                <button onClick={() => handleDeleteNote(note._id)}>
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
```

---

## 🧪 Fase 8: Testes e Refinamentos

### 8.1. Testes Realizados

#### Autenticação
- ✅ Registro com email válido/inválido
- ✅ Login com credenciais corretas/incorretas
- ✅ Verificação de email
- ✅ Recuperação de senha
- ✅ Bloqueio após 5 tentativas
- ✅ Login com Google OAuth

#### Kanban
- ✅ Criar tarefa
- ✅ Editar tarefa
- ✅ Deletar tarefa
- ✅ Arrastar entre colunas
- ✅ Prioridades diferentes
- ✅ Persistência no MongoDB

#### Notas
- ✅ Criar nota
- ✅ Deletar nota
- ✅ Sidebar responsiva

### 8.2. Otimizações

#### Performance
- ✅ Lazy loading de componentes
- ✅ Memoização com `React.memo`
- ✅ Debounce em busca
- ✅ Índices no MongoDB

#### UX
- ✅ Loading states
- ✅ Error handling
- ✅ Feedback visual
- ✅ Animações suaves

#### SEO
- ✅ Meta tags
- ✅ Títulos dinâmicos
- ✅ Descrições

---

## ⚠️ Desafios e Soluções

### Desafio 1: Drag-and-Drop Complexo

**Problema**: @dnd-kit tem curva de aprendizado íngreme

**Solução**:
- Estudei a documentação oficial
- Implementei exemplo básico primeiro
- Adicionei features gradualmente
- Usei DragOverlay para melhor UX

### Desafio 2: Proteção contra Brute Force

**Problema**: Necessário balancear segurança e UX

**Solução**:
- Implementei contador de tentativas
- Bloqueio temporário de 30 minutos
- Reset automático após login bem-sucedido
- Mensagens claras ao usuário

### Desafio 3: Google OAuth em Localhost

**Problema**: Configuração de URIs autorizadas

**Solução**:
- Adicionei `http://localhost:5173` nas origens autorizadas
- Configurei callback URL correta
- Testei com conta de teste do Google

### Desafio 4: Email em Desenvolvimento

**Problema**: Não queria enviar emails reais em dev

**Solução**:
- Integrei Mailtrap para testes
- Configurei variáveis de ambiente
- Suporte a Gmail para produção

---

## 💡 Lições Aprendidas

### Técnicas
1. **MongoDB é flexível**: Ideal para dados não-relacionais como tarefas
2. **JWT é stateless**: Não precisa armazenar sessões no servidor
3. **@dnd-kit é poderoso**: Drag-and-drop acessível e performático
4. **Framer Motion facilita**: Animações complexas com código simples
5. **Tailwind acelera**: Desenvolvimento rápido com classes utilitárias

### Arquitetura
1. **Separação de concerns**: Services, models, routes bem organizados
2. **Middleware reutilizável**: Auth middleware usado em várias rotas
3. **Validações duplas**: Frontend (UX) e backend (segurança)
4. **Error handling consistente**: Try-catch em todas as rotas
5. **Schemas Mongoose**: Validações e transformações automáticas

### Boas Práticas
1. **Variáveis de ambiente**: Nunca commitar credenciais
2. **Hash de senhas**: Sempre usar bcrypt
3. **Tokens com expiração**: Segurança e renovação
4. **CORS configurado**: Apenas origins autorizadas
5. **Logs adequados**: Console.log em desenvolvimento

---

## 📈 Próximos Passos

### Funcionalidades Futuras
- [ ] Modo escuro
- [ ] Notificações em tempo real
- [ ] Anexos em tarefas
- [ ] Filtros e busca avançada
- [ ] Compartilhamento de boards
- [ ] Timeline de atividades
- [ ] Etiquetas personalizadas
- [ ] Integração com calendário

### Melhorias Técnicas
- [ ] Testes automatizados (Jest, Cypress)
- [ ] CI/CD pipeline
- [ ] Docker para desenvolvimento
- [ ] Rate limiting mais sofisticado
- [ ] Logs estruturados (Winston)
- [ ] Monitoramento (Sentry)
- [ ] Cache com Redis
- [ ] WebSockets para real-time

---

## 🎓 Recursos Utilizados

### Documentação
- [React Docs](https://react.dev/)
- [Vite Guide](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [@dnd-kit](https://docs.dndkit.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Express Guide](https://expressjs.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [Passport.js](http://www.passportjs.org/)

### Tutoriais e Referências
- MongoDB University (cursos gratuitos)
- Net Ninja - MERN Stack Tutorial
- Web Dev Simplified - JWT Authentication
- Kevin Powell - CSS/Tailwind
- Traversy Media - Full Stack Projects

---

## 📝 Conclusão

O FlowDuo foi desenvolvido seguindo boas práticas de desenvolvimento full-stack, com foco em:
- **Segurança**: Hash, JWT, validações, brute force protection
- **UX**: Interface moderna, responsiva, animações fluidas
- **Performance**: Otimizações, lazy loading, índices no BD
- **Manutenibilidade**: Código limpo, organizado, comentado
- **Escalabilidade**: Arquitetura preparada para crescimento

O projeto está pronto para uso em produção e serve como base sólida para futuras expansões.

---

<div align="center">

**[⬆ Voltar ao topo](#-desenvolvimento---flowduo)**

</div>
