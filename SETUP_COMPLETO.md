# 🚀 KAMBAM - Guia Completo de Setup

## 📋 Arquitetura do Projeto

```
KAMBAM/
├── frontend/                 (React + Vite)
│   ├── src/
│   ├── Pages/
│   ├── Components/
│   ├── package.json
│   └── vite.config.js
│
└── backend/                  (Node.js + Express)
    ├── models/              (Mongoose schemas)
    ├── routes/              (API endpoints)
    ├── middleware/          (Autenticação JWT)
    ├── config/              (Banco e Passport)
    ├── server.js
    ├── package.json
    └── .env
```

---

## 🔧 Pré-requisitos

- **Node.js** (v14+) - [Download](https://nodejs.org/)
- **MongoDB** (local ou cloud)
- **Google OAuth Credentials**
- **Git** (opcional)

---

## 📦 Step 1: Instalação de Dependências

### Frontend
```bash
cd "d:\Aplicativo - KAMBAM - TAREFAS"
npm install
```

### Backend
```bash
cd "d:\Aplicativo - KAMBAM - TAREFAS\backend"
npm install
```

---

## 🔐 Step 2: Configurar Google OAuth

### 2.1 Criar Projeto no Google Cloud Console

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Clique em **Novo Projeto**
3. Nome: "KAMBAM App"
4. Vá em **APIs e Serviços** → **Biblioteca**
5. Procure por "Google+ API" e ative
6. Procure por "Google Identity Services" e ative

### 2.2 Criar Credenciais OAuth 2.0

1. Em **APIs e Serviços** → **Credenciais**
2. Clique em **+ Criar Credenciais** → **ID do Cliente OAuth 2.0**
3. Selecione **Aplicação Web**
4. Preencha:
   - **Nome**: "KAMBAM Web App"

### 2.3 Adicionar URIs Autorizadas

Na seção **URIs de Redirecionamento Autorizados**, adicione:
```
http://localhost:5000/api/auth/google/callback
```

Na seção **JavaScript Autorizados**, adicione:
```
http://localhost:5173
http://localhost:3000
http://localhost:5000
```

### 2.4 Copiar Credenciais

Após criar, você receberá:
- **Client ID**
- **Client Secret**

---

## 🗄️ Step 3: Configurar MongoDB

### Opção A: MongoDB Local (Recomendado para Desenvolvimento)

**Windows:**
1. Baixe [MongoDB Community Edition](https://www.mongodb.com/try/download/community)
2. Siga o instalador
3. MongoDB rodará automaticamente em `localhost:27017`

**Verificar se está rodando:**
```bash
mongosh
db.adminCommand("ping")
```

### Opção B: MongoDB Atlas (Cloud)

1. Acesse [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crie uma conta gratuita
3. Crie um novo cluster
4. Configure um usuário (Database Access)
5. Whitelist IP: 0.0.0.0/0 (para desenvolvimento)
6. Copie a connection string

---

## 🔑 Step 4: Configurar Variáveis de Ambiente

### Backend (.env)

Crie o arquivo `backend/.env`:

```env
# MongoDB Local
MONGODB_URI=mongodb://localhost:27017/kambam

# MongoDB Atlas (descomente se usar cloud)
# MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/kambam

# Google OAuth (copie do Google Cloud Console)
GOOGLE_CLIENT_ID=seu_client_id_aqui
GOOGLE_CLIENT_SECRET=seu_client_secret_aqui
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# JWT
JWT_SECRET=chave_super_secreta_12345_nao_compartilhe

# Environment
NODE_ENV=development
PORT=5000

# Frontend
FRONTEND_URL=http://localhost:5173
```

---

## 🚀 Step 5: Rodar a Aplicação

### Terminal 1: Backend
```bash
cd "d:\Aplicativo - KAMBAM - TAREFAS\backend"
npm run dev
```

Você verá:
```
✅ MongoDB conectado com sucesso!
🚀 Servidor rodando em http://localhost:5000
```

### Terminal 2: Frontend
```bash
cd "d:\Aplicativo - KAMBAM - TAREFAS"
npm run dev
```

Você verá:
```
VITE v4.5.14  ready in XXX ms
➜  Local:   http://localhost:5173/
```

---

## 🧪 Step 6: Testar a Aplicação

### 6.1 Acessar a Página de Login
1. Abra [http://localhost:5173/login](http://localhost:5173/login)
2. Clique em "Entrar com Google"
3. Faça login com sua conta Google
4. Você será redirecionado para o dashboard

### 6.2 Testar CRUD de Tarefas
- ✅ Criar tarefa: Clique em "Nova Tarefa"
- ✅ Editar tarefa: Clique no ícone de edição (✏️)
- ✅ Deletar tarefa: Clique no ícone de lixo (🗑️)
- ✅ Mover tarefa: Arraste entre colunas (Drag & Drop)

### 6.3 Testar Notas
- Clique em "Notas" para abrir a sidebar
- Crie, edite e delete notas

---

## 📡 Endpoints da API

### Autenticação
```
GET  /api/auth/google              # Iniciar login Google
GET  /api/auth/google/callback     # Callback do Google
POST /api/auth/logout              # Logout
GET  /api/auth/me                  # Obter usuário atual
```

### Tarefas
```
GET    /api/tasks                  # Listar tarefas
GET    /api/tasks/:id              # Obter tarefa específica
POST   /api/tasks                  # Criar tarefa
PUT    /api/tasks/:id              # Atualizar tarefa
DELETE /api/tasks/:id              # Deletar tarefa
```

### Notas
```
GET    /api/notes                  # Listar notas
GET    /api/notes/:id              # Obter nota específica
POST   /api/notes                  # Criar nota
PUT    /api/notes/:id              # Atualizar nota
DELETE /api/notes/:id              # Deletar nota
```

### Health Check
```
GET /api/health                    # Status do servidor
```

---

## 🔍 Troubleshooting

### Erro: "Port 5000 is already in use"
```bash
# Mude a porta no .env
PORT=5001
```

### Erro: "MongoDB connection failed"
```bash
# Certifique-se que MongoDB está rodando
mongosh

# Ou use MongoDB Atlas (veja Step 3)
```

### Erro: "Google OAuth credentials invalid"
```bash
# Verifique as credenciais no Google Cloud Console
# Certifique-se que URIs estão corretos
```

### Erro: "CORS error"
```bash
# Certifique-se que FRONTEND_URL está correto no .env
FRONTEND_URL=http://localhost:5173
```

---

## 📊 Estrutura de Dados

### User
```javascript
{
  _id: ObjectId,
  googleId: String,
  name: String,
  email: String,
  photo: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Task
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  title: String,
  description: String,
  status: 'todo' | 'in_progress' | 'done',
  priority: 'baixa' | 'média' | 'alta',
  dueDate: Date,
  assignee: String,
  order: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Note
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  title: String,
  content: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎯 Próximos Passos

- [ ] Adicionar validação de formulários mais robusta
- [ ] Implementar paginação de tarefas
- [ ] Adicionar filtros por prioridade/responsável
- [ ] Implementar compartilhamento de tarefas entre usuários
- [ ] Adicionar notificações push
- [ ] Implementar modo escuro
- [ ] Deploy em produção (Heroku, Vercel, etc)

---

## 📚 Stack Tecnológico

**Frontend:**
- React 18.2.0
- Vite 4.4.0
- Tailwind CSS 3.3.0
- Framer Motion 10.0.0
- DND Kit (Drag & Drop)
- React Router DOM 6.16.0

**Backend:**
- Node.js + Express 4.18.2
- MongoDB + Mongoose 8.0.0
- Passport.js 0.7.0
- JWT (JSON Web Tokens) 9.0.0
- Google OAuth 2.0

---

## ❓ Suporte

Se encontrar problemas:
1. Verifique se todos os pré-requisitos estão instalados
2. Consulte os logs no terminal
3. Verifique as variáveis de ambiente
4. Reinicie os servidores

---

**Criado com ❤️ para KAMBAM**
