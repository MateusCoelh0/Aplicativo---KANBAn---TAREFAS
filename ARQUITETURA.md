# 🏗️ ARQUITETURA - FlowDuo

Este documento detalha a arquitetura técnica do projeto FlowDuo, incluindo decisões de design, padrões utilizados e estrutura do código.

---

## 📖 Índice

- [Visão Geral da Arquitetura](#-visão-geral-da-arquitetura)
- [Stack Tecnológico](#-stack-tecnológico)
- [Arquitetura do Backend](#-arquitetura-do-backend)
- [Arquitetura do Frontend](#-arquitetura-do-frontend)
- [Banco de Dados](#-banco-de-dados)
- [Autenticação e Autorização](#-autenticação-e-autorização)
- [API REST](#-api-rest)
- [Segurança](#-segurança)
- [Padrões de Código](#-padrões-de-código)
- [Performance](#-performance)
- [Deploy e Infraestrutura](#-deploy-e-infraestrutura)

---

## 🎯 Visão Geral da Arquitetura

O FlowDuo segue uma **arquitetura cliente-servidor** clássica com separação clara entre frontend e backend:

```
┌─────────────────────────────────────────────────────────┐
│                    ARQUITETURA GERAL                    │
└─────────────────────────────────────────────────────────┘

┌──────────────────┐              ┌──────────────────┐
│                  │   HTTP/REST  │                  │
│    FRONTEND      │◄────────────►│    BACKEND       │
│   (React SPA)    │   JSON       │  (Express API)   │
│                  │              │                  │
└──────────────────┘              └────────┬─────────┘
        │                                  │
        │                                  │
        │ localStorage (JWT)               │ Mongoose ODM
        │                                  │
        │                         ┌────────▼─────────┐
        │                         │                  │
        └─────────────────────────┤    MongoDB       │
                                  │   (Database)     │
                                  │                  │
                                  └──────────────────┘
```

### Características Principais

- **SPA (Single Page Application)**: React no frontend
- **API RESTful**: Endpoints bem definidos
- **Stateless**: JWT para autenticação sem sessões
- **NoSQL**: MongoDB para flexibilidade de dados
- **Escalável**: Microserviços-ready

---

## 🛠️ Stack Tecnológico

### Visão Completa

| Camada | Tecnologia | Versão | Justificativa |
|--------|-----------|--------|---------------|
| **Frontend Framework** | React | 18.2 | Virtual DOM, componentes reutilizáveis, ecossistema robusto |
| **Build Tool** | Vite | 4.4 | HMR ultra-rápido, build otimizado, ESM nativo |
| **UI Styling** | Tailwind CSS | 3.3 | Utility-first, produtividade, design consistente |
| **Animações** | Framer Motion | 10.0 | Animações declarativas, spring physics |
| **Drag-and-Drop** | @dnd-kit | 6.3 | Acessível, performático, TypeScript |
| **Ícones** | Lucide React | 0.263 | SVG otimizados, tree-shakeable |
| **Roteamento** | React Router | 6.30 | Navegação declarativa, lazy loading |
| **Runtime** | Node.js | 18+ | V8 engine, async I/O, NPM ecosystem |
| **Framework Backend** | Express | 4.18 | Minimalista, middleware flexível |
| **Database** | MongoDB | 6.0+ | NoSQL, schemas flexíveis, escalável |
| **ODM** | Mongoose | 8.0 | Schemas, validações, hooks |
| **Autenticação** | Passport.js | 0.7 | Estratégias plugáveis, OAuth |
| **Tokens** | JWT | 9.0 | Stateless, portable, seguro |
| **Hash** | bcryptjs | 2.4 | Salting, slow hashing (brute-force resistant) |
| **Email** | Nodemailer | 6.10 | SMTP, templates HTML |

---

## 🔧 Arquitetura do Backend

### Estrutura de Diretórios

```
backend/
├── config/
│   ├── database.js          # Configuração MongoDB
│   └── passport.js          # Estratégias de autenticação
├── middleware/
│   └── auth.js              # Middleware JWT
├── models/
│   ├── User.js              # Schema de usuário
│   ├── Task.js              # Schema de tarefa
│   └── Note.js              # Schema de nota
├── routes/
│   ├── auth.js              # Rotas de autenticação
│   ├── tasks.js             # Rotas de tarefas
│   └── notes.js             # Rotas de notas
├── utils/
│   └── emailService.js      # Serviço de email
├── .env                     # Variáveis de ambiente
├── server.js                # Entry point
└── package.json
```

### Padrão MVC Adaptado

```
┌─────────────────────────────────────────┐
│         FLUXO DE REQUISIÇÃO             │
└─────────────────────────────────────────┘

Cliente (Frontend)
      │
      ├─ HTTP Request (JSON)
      │
      v
┌──────────────┐
│   Routes     │  ← Define endpoints e métodos HTTP
└──────┬───────┘
       │
       ├─ Middleware (auth.js)
       │
       v
┌──────────────┐
│ Controllers  │  ← Lógica de negócio (inline nas rotas)
└──────┬───────┘
       │
       v
┌──────────────┐
│   Models     │  ← Mongoose schemas, validações
└──────┬───────┘
       │
       v
┌──────────────┐
│   MongoDB    │  ← Persistência de dados
└──────────────┘
```

### Fluxo de Requisição Detalhado

1. **Requisição HTTP** chega ao Express
2. **Middlewares globais** (CORS, JSON parser)
3. **Roteamento** (`/api/tasks`, `/api/auth`, etc.)
4. **Middleware de autenticação** (se rota protegida)
5. **Controller** (lógica de negócio)
6. **Model** (Mongoose - validações e queries)
7. **MongoDB** (operações CRUD)
8. **Resposta JSON** enviada ao cliente

### Exemplo de Rota Completa

```javascript
// routes/tasks.js
import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import Task from '../models/Task.js';

const router = express.Router();

// GET /api/tasks - Listar tarefas do usuário
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Controller logic
    const tasks = await Task.find({ userId: req.userId })
      .sort({ createdAt: -1 });
    
    res.json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar tarefas' });
  }
});

// POST /api/tasks - Criar tarefa
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, priority, status } = req.body;
    
    // Validações
    if (!title) {
      return res.status(400).json({ message: 'Título é obrigatório' });
    }
    
    // Criar tarefa
    const task = new Task({
      title,
      description,
      priority,
      status,
      userId: req.userId,
    });
    
    await task.save();
    
    res.status(201).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar tarefa' });
  }
});

export default router;
```

### Middleware de Autenticação

```javascript
// middleware/auth.js
import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  // 1. Extrair token do header Authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"
  
  // 2. Verificar se token existe
  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }
  
  // 3. Validar token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido ou expirado' });
    }
    
    // 4. Adicionar userId ao request
    req.userId = decoded.userId;
    next();
  });
};
```

### Server.js - Entry Point

```javascript
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import passport from './config/passport.js';
import authRoutes from './routes/auth.js';
import tasksRoutes from './routes/tasks.js';
import notesRoutes from './routes/notes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Conectar ao MongoDB
connectDB();

// Middlewares globais
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
  },
}));

app.use(passport.initialize());
app.use(passport.session());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/notes', notesRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Error handling
app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
```

---

## 🎨 Arquitetura do Frontend

### Estrutura de Diretórios

```
frontend/
├── src/
│   ├── config/
│   │   └── api.js           # Configuração do Axios
│   ├── services/
│   │   ├── api.js           # Cliente HTTP base
│   │   ├── authService.js   # Serviço de autenticação
│   │   └── dataService.js   # Serviço de dados (tasks, notes)
│   ├── styles/
│   │   └── auth.css         # Estilos específicos de auth
│   ├── App.jsx              # Rotas principais
│   ├── main.jsx             # Entry point
│   └── index.css            # Estilos globais + Tailwind
│
├── Pages/
│   ├── Login.jsx            # Página de login
│   ├── Register.jsx         # Página de registro
│   ├── ForgotPassword.jsx   # Recuperação de senha
│   ├── Dashboard.jsx        # Dashboard protegido
│   └── Kambam.jsx           # Board Kanban
│
├── Components/
│   ├── auth/
│   │   ├── LoginForm.jsx
│   │   ├── RegisterForm.jsx
│   │   ├── VerifyEmail.jsx
│   │   └── ForgotPassword.jsx
│   ├── kanban/
│   │   ├── KanbanColumn.jsx
│   │   ├── TaskCard.jsx
│   │   ├── TaskModal.jsx
│   │   └── DragOverlayCard.jsx
│   └── notes/
│       └── NoteSidebar.jsx
│
└── Entities/
    ├── task.JSON
    └── Note.JSON
```

### Padrão de Componentes

```
┌─────────────────────────────────────────┐
│      HIERARQUIA DE COMPONENTES          │
└─────────────────────────────────────────┘

App.jsx (Router)
    │
    ├── Login (Page)
    │     └── LoginForm (Component)
    │
    ├── Register (Page)
    │     └── RegisterForm (Component)
    │
    └── Dashboard (Page - Protected)
          │
          ├── Kambam (Page)
          │     ├── KanbanColumn (Component)
          │     │     └── TaskCard (Component)
          │     └── DragOverlay (Component)
          │
          └── NoteSidebar (Component)
```

### Camada de Serviços

#### api.js - Cliente HTTP Base

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratar erros 401 (não autorizado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

#### authService.js - Serviço de Autenticação

```javascript
import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },
  
  register: async (name, email, password, confirmPassword) => {
    const response = await api.post('/auth/register', {
      name,
      email,
      password,
      confirmPassword,
    });
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
  },
  
  getToken: () => localStorage.getItem('token'),
  
  isAuthenticated: () => !!localStorage.getItem('token'),
};
```

#### dataService.js - Serviço de Dados

```javascript
import api from './api';

export const dataService = {
  // Tasks
  getTasks: async () => {
    const response = await api.get('/tasks');
    return response.data.tasks;
  },
  
  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data.task;
  },
  
  updateTask: async (taskId, updates) => {
    const response = await api.put(`/tasks/${taskId}`, updates);
    return response.data.task;
  },
  
  deleteTask: async (taskId) => {
    await api.delete(`/tasks/${taskId}`);
  },
  
  // Notes
  getNotes: async () => {
    const response = await api.get('/notes');
    return response.data.notes;
  },
  
  createNote: async (noteData) => {
    const response = await api.post('/notes', noteData);
    return response.data.note;
  },
  
  deleteNote: async (noteId) => {
    await api.delete(`/notes/${noteId}`);
  },
};

export default dataService;
```

### Roteamento e Proteção

```javascript
// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './services/authService';

// Componente de rota protegida
function ProtectedRoute({ element }) {
  const isAuthenticated = authService.isAuthenticated();
  return isAuthenticated ? element : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Rotas protegidas */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<Dashboard />} />}
        />
        
        {/* Redirect padrão */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
```

---

## 💾 Banco de Dados

### MongoDB - Schemas

#### User Schema

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique, indexed),
  password: String (required, hashed),
  
  // Email verification
  isEmailVerified: Boolean (default: false),
  emailVerificationToken: String (SHA-256 hash),
  emailVerificationTokenExpires: Date,
  
  // Password reset
  passwordResetToken: String (SHA-256 hash),
  passwordResetTokenExpires: Date,
  
  // Security
  loginAttempts: Number (default: 0),
  lockUntil: Date,
  
  // OAuth
  googleId: String,
  
  // Metadata
  lastLogin: Date,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

#### Task Schema

```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String,
  status: String (enum: ['todo', 'inProgress', 'done']),
  priority: String (enum: ['low', 'medium', 'high']),
  assignedTo: String,
  userId: ObjectId (ref: 'User', required, indexed),
  order: Number (default: 0),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

#### Note Schema

```javascript
{
  _id: ObjectId,
  content: String (required),
  userId: ObjectId (ref: 'User', required, indexed),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Índices e Performance

```javascript
// Índices criados automaticamente
User: { email: 1 }        // Unique index
Task: { userId: 1 }       // Para queries por usuário
Note: { userId: 1 }       // Para queries por usuário

// Índices compostos (futuro)
Task: { userId: 1, status: 1, order: 1 }  // Para ordenação eficiente
```

---

## 🔐 Autenticação e Autorização

### Fluxo de Autenticação JWT

```
┌────────────────────────────────────────────────────────┐
│              FLUXO DE AUTENTICAÇÃO JWT                 │
└────────────────────────────────────────────────────────┘

1. REGISTRO
   Usuario → POST /api/auth/register
          → Senha hasheada (bcrypt)
          → Token de verificação gerado
          → Email enviado

2. VERIFICAÇÃO
   Usuario → Clica no link do email
          → POST /api/auth/verify-email
          → isEmailVerified = true

3. LOGIN
   Usuario → POST /api/auth/login
          → Validação de credenciais
          → Verificação de email obrigatória
          → JWT gerado (payload: { userId }, 7 dias)
          → Token retornado ao cliente

4. REQUISIÇÕES AUTENTICADAS
   Cliente → GET /api/tasks
          → Header: Authorization: Bearer <token>
          → Middleware valida JWT
          → userId extraído do token
          → Dados filtrados por userId

5. LOGOUT
   Cliente → Remove token do localStorage
```

### Estrutura do JWT

```javascript
// Header
{
  "alg": "HS256",
  "typ": "JWT"
}

// Payload
{
  "userId": "507f1f77bcf86cd799439011",
  "iat": 1703890800,  // Issued at
  "exp": 1704495600   // Expires in 7 days
}

// Signature
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  JWT_SECRET
)
```

### Google OAuth Flow

```
1. Usuario clica "Login com Google"
2. Redireciona para Google OAuth
3. Usuario autoriza no Google
4. Google redireciona para callback URL
5. Backend recebe authorization code
6. Backend troca code por access token
7. Backend busca perfil do usuário no Google
8. Backend cria/atualiza usuário no MongoDB
9. Backend gera JWT
10. Frontend recebe token e armazena
```

---

## 🌐 API REST

### Endpoints Disponíveis

#### Autenticação (`/api/auth`)

| Método | Endpoint | Auth | Descrição |
|--------|----------|------|-----------|
| POST | `/register` | ❌ | Registrar novo usuário |
| POST | `/verify-email` | ❌ | Verificar email com token |
| POST | `/login` | ❌ | Login com email e senha |
| POST | `/forgot-password` | ❌ | Solicitar reset de senha |
| POST | `/reset-password` | ❌ | Redefinir senha com token |
| GET | `/google` | ❌ | Iniciar OAuth Google |
| GET | `/google/callback` | ❌ | Callback OAuth Google |
| GET | `/me` | ✅ | Obter dados do usuário logado |
| POST | `/logout` | ✅ | Logout (invalida token no cliente) |

#### Tarefas (`/api/tasks`)

| Método | Endpoint | Auth | Descrição |
|--------|----------|------|-----------|
| GET | `/` | ✅ | Listar todas as tarefas do usuário |
| POST | `/` | ✅ | Criar nova tarefa |
| GET | `/:id` | ✅ | Obter tarefa por ID |
| PUT | `/:id` | ✅ | Atualizar tarefa |
| DELETE | `/:id` | ✅ | Deletar tarefa |

#### Notas (`/api/notes`)

| Método | Endpoint | Auth | Descrição |
|--------|----------|------|-----------|
| GET | `/` | ✅ | Listar todas as notas do usuário |
| POST | `/` | ✅ | Criar nova nota |
| DELETE | `/:id` | ✅ | Deletar nota |

### Formato de Respostas

#### Sucesso

```json
{
  "success": true,
  "message": "Operação realizada com sucesso",
  "data": { ... }
}
```

#### Erro

```json
{
  "success": false,
  "message": "Descrição do erro",
  "error": "Detalhes técnicos (apenas em dev)"
}
```

---

## 🔒 Segurança

### Camadas de Segurança Implementadas

#### 1. Autenticação
- ✅ **Hash de Senhas**: bcrypt com 10 salt rounds
- ✅ **JWT Stateless**: Não mantém sessões no servidor
- ✅ **Token Expiration**: 7 dias (configurável)
- ✅ **Email Verification**: Obrigatória antes do login

#### 2. Autorização
- ✅ **Middleware JWT**: Valida token em todas as rotas protegidas
- ✅ **User-scoped Data**: Usuário só acessa seus próprios dados
- ✅ **Query Filtering**: `{ userId: req.userId }` em todas as queries

#### 3. Proteção contra Ataques

##### Brute Force Protection
```javascript
if (user.loginAttempts >= 5) {
  user.lockUntil = Date.now() + 30 * 60 * 1000; // 30 min
}
```

##### SQL/NoSQL Injection
- ✅ Mongoose sanitization automática
- ✅ Validações de entrada

##### XSS (Cross-Site Scripting)
- ✅ React escaping automático
- ✅ Sanitização de inputs

##### CSRF (Cross-Site Request Forgery)
- ✅ SameSite cookies
- ✅ CORS configurado

#### 4. CORS (Cross-Origin Resource Sharing)

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL, // Apenas frontend autorizado
  credentials: true,
}));
```

#### 5. Variáveis de Ambiente

```env
# NUNCA commitar este arquivo!
JWT_SECRET=chave_super_secreta_aqui
MONGODB_URI=mongodb://...
GOOGLE_CLIENT_SECRET=...
EMAIL_PASSWORD=...
```

#### 6. Validações

```javascript
// Backend
if (!email || !password) {
  return res.status(400).json({ message: 'Campos obrigatórios' });
}

if (password.length < 6) {
  return res.status(400).json({ message: 'Senha muito curta' });
}

// Frontend (adicional, não substitui backend)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  setError('Email inválido');
}
```

---

## 📐 Padrões de Código

### Convenções de Nomenclatura

```javascript
// Variáveis e funções: camelCase
const userName = 'João';
function getUserById(id) { ... }

// Componentes React: PascalCase
function LoginForm() { ... }
function TaskCard() { ... }

// Constantes: UPPER_SNAKE_CASE
const MAX_LOGIN_ATTEMPTS = 5;
const TOKEN_EXPIRATION = '7d';

// Arquivos:
// - Componentes: PascalCase (LoginForm.jsx)
// - Services: camelCase (authService.js)
// - Config: camelCase (database.js)
```

### Estrutura de Componentes React

```javascript
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Componente de card de tarefa
 * @param {Object} task - Objeto da tarefa
 * @param {Function} onEdit - Callback ao editar
 * @param {Function} onDelete - Callback ao deletar
 */
export default function TaskCard({ task, onEdit, onDelete }) {
  // 1. Hooks
  const [isHovered, setIsHovered] = useState(false);
  
  // 2. Effects
  useEffect(() => {
    // ...
  }, [task]);
  
  // 3. Handlers
  const handleEdit = () => {
    onEdit(task);
  };
  
  // 4. Render
  return (
    <div className="task-card">
      {/* ... */}
    </div>
  );
}

// 5. PropTypes
TaskCard.propTypes = {
  task: PropTypes.object.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};
```

### Error Handling

```javascript
// Backend
try {
  const result = await someAsyncOperation();
  res.json({ success: true, data: result });
} catch (error) {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: 'Erro no servidor',
    ...(process.env.NODE_ENV === 'development' && { error: error.message }),
  });
}

// Frontend
try {
  const data = await authService.login(email, password);
  navigate('/dashboard');
} catch (error) {
  const message = error.response?.data?.message || 'Erro desconhecido';
  setError(message);
}
```

---

## ⚡ Performance

### Otimizações Implementadas

#### Frontend
- ✅ **Code Splitting**: React.lazy() para páginas
- ✅ **Tree Shaking**: Vite elimina código não usado
- ✅ **Memoization**: React.memo em componentes pesados
- ✅ **Debounce**: Em inputs de busca
- ✅ **Lazy Loading**: Imagens e componentes

#### Backend
- ✅ **Índices MongoDB**: Em campos frequentemente consultados
- ✅ **Lean Queries**: `.lean()` quando não precisa de métodos Mongoose
- ✅ **Projection**: Selecionar apenas campos necessários
- ✅ **Connection Pooling**: MongoDB mantém pool de conexões

#### Bundle Size
```
Vite build:
- JS: ~150KB (gzipped)
- CSS: ~10KB (gzipped)
- Total: ~160KB
```

---

## 🚀 Deploy e Infraestrutura

### Ambientes

| Ambiente | Frontend | Backend | Database |
|----------|----------|---------|----------|
| **Dev** | localhost:5173 | localhost:5000 | MongoDB local |
| **Prod** | Vercel | Railway | MongoDB Atlas |

### Variáveis de Ambiente por Ambiente

#### Development
```env
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/flowduo
EMAIL_HOST=smtp.mailtrap.io  # Mailtrap
```

#### Production
```env
NODE_ENV=production
FRONTEND_URL=https://flowduo.vercel.app
MONGODB_URI=mongodb+srv://...  # MongoDB Atlas
EMAIL_HOST=smtp.gmail.com     # Gmail
```

### CI/CD (Futuro)

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm test
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - run: vercel --prod
```

---

## 📊 Métricas e Monitoramento (Planejado)

### Métricas a Serem Implementadas
- [ ] Logs estruturados (Winston)
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring (New Relic)
- [ ] Analytics (Google Analytics)
- [ ] Uptime monitoring (UptimeRobot)

---

## 🎓 Referências Técnicas

### Documentação Oficial
- [React Architecture](https://react.dev/learn/thinking-in-react)
- [Express Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [MongoDB Data Modeling](https://www.mongodb.com/docs/manual/core/data-modeling-introduction/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

### Padrões de Design Utilizados
- **Repository Pattern**: Services abstraem acesso a dados
- **Middleware Pattern**: Express middleware chain
- **Singleton Pattern**: MongoDB connection, Axios instance
- **Observer Pattern**: React state management
- **Factory Pattern**: Mongoose model creation

---

## 📝 Conclusão

A arquitetura do FlowDuo foi desenhada para ser:
- **Escalável**: Adicionar features sem refatoração massiva
- **Manutenível**: Código organizado e documentado
- **Segura**: Múltiplas camadas de proteção
- **Performática**: Otimizações em todas as camadas
- **Testável**: Separação de concerns facilita testes

Esta base sólida permite evolução contínua do projeto.

---

<div align="center">

**[⬆ Voltar ao topo](#-arquitetura---flowduo)**

</div>
