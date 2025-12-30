# 📋 FlowDuo - Sistema de Gerenciamento de Tarefas Kanban

<div align="center">

![FlowDuo Logo](https://img.shields.io/badge/FlowDuo-Kanban%20Board-blue?style=for-the-badge)

Sistema completo de gerenciamento de tarefas estilo Kanban com autenticação avançada, notas e drag-and-drop intuitivo.

[![React](https://img.shields.io/badge/React-18.2-61dafb?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4.18-000000?logo=express)](https://expressjs.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

</div>

---

## 📖 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Como Executar](#-como-executar)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Deploy](#-deploy)
- [Documentação Adicional](#-documentação-adicional)

---

## 🎯 Sobre o Projeto

**FlowDuo** é uma aplicação web moderna de gerenciamento de tarefas no estilo Kanban, desenvolvida para organizar projetos de forma visual e intuitiva. O sistema conta com autenticação completa, incluindo login social (Google OAuth), verificação de email, recuperação de senha e um sistema de notas integrado.

### Características Principais
- ✅ Interface moderna e responsiva
- ✅ Autenticação completa e segura
- ✅ Drag-and-drop fluido
- ✅ Persistência de dados em MongoDB
- ✅ API RESTful bem estruturada
- ✅ Sistema de notas rápidas
- ✅ Proteção de rotas

---

## ✨ Funcionalidades

### 🔐 Autenticação Completa
- ✅ **Registro** com email e senha
- ✅ **Login** com email e senha
- ✅ **Login Social** com Google OAuth 2.0
- ✅ **Verificação de Email** obrigatória
- ✅ **Recuperação de Senha** via email
- ✅ **JWT Tokens** com expiração de 7 dias
- ✅ **Proteção contra Brute Force** (bloqueio após 5 tentativas)
- ✅ **Hash Seguro** de senhas com bcryptjs

### 📊 Gerenciamento de Tarefas Kanban
- ✅ **Quadro Kanban** com 3 colunas:
  - 🆕 A Fazer (To Do)
  - ⚙️ Em Progresso (In Progress)
  - ✅ Concluído (Done)
- ✅ **Drag-and-Drop** fluido com feedback visual
- ✅ **Criar, Editar e Excluir** tarefas
- ✅ **Prioridades** (Baixa, Média, Alta) com cores distintas
- ✅ **Atribuir Tarefas** a usuários
- ✅ **Descrições Detalhadas** para cada tarefa
- ✅ **Persistência** no MongoDB

### 📝 Sistema de Notas
- ✅ Criar notas rápidas
- ✅ Editar e deletar notas
- ✅ Sidebar flutuante
- ✅ Sincronização com o banco de dados

### 🎨 Interface Moderna
- ✅ Design responsivo
- ✅ Tema escuro nas colunas Kanban
- ✅ Animações suaves com Framer Motion
- ✅ Feedback visual em todas as ações
- ✅ Ícones elegantes com Lucide React

---

## 🛠️ Tecnologias

### Frontend
| Tecnologia | Versão | Descrição |
|-----------|--------|-----------|
| **React** | 18.2 | Biblioteca JavaScript para UI |
| **Vite** | 4.4 | Build tool moderno e rápido |
| **React Router** | 6.30 | Navegação e rotas |
| **Tailwind CSS** | 3.3 | Framework CSS utility-first |
| **Framer Motion** | 10.0 | Biblioteca de animações |
| **@dnd-kit** | 6.3 | Drag-and-drop moderno e acessível |
| **Lucide React** | 0.263 | Conjunto de ícones SVG |

### Backend
| Tecnologia | Versão | Descrição |
|-----------|--------|-----------|
| **Node.js** | 18+ | Runtime JavaScript |
| **Express** | 4.18 | Framework web minimalista |
| **MongoDB** | 6.0+ | Banco de dados NoSQL |
| **Mongoose** | 8.0 | ODM para MongoDB |
| **Passport.js** | 0.7 | Middleware de autenticação |
| **JWT** | 9.0 | JSON Web Tokens |
| **bcryptjs** | 2.4 | Hash de senhas |
| **Nodemailer** | 6.10 | Envio de emails |
| **CORS** | 2.8 | Cross-Origin Resource Sharing |

### Ferramentas de Desenvolvimento
- **Nodemon** - Auto-reload do servidor
- **PostCSS** - Processamento CSS
- **Autoprefixer** - Prefixos CSS automáticos
- **dotenv** - Gerenciamento de variáveis de ambiente

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior) - [Download](https://nodejs.org/)
- **MongoDB** (versão 6.0 ou superior)
  - **Opção 1**: [MongoDB Community Edition](https://www.mongodb.com/try/download/community) (local)
  - **Opção 2**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cloud - grátis)
- **Git** (opcional) - [Download](https://git-scm.com/)
- **Conta Google Cloud** (para OAuth) - [Google Cloud Console](https://console.cloud.google.com/)
- **Conta Mailtrap** (para emails de desenvolvimento) - [Mailtrap.io](https://mailtrap.io/)

---

## 🚀 Instalação

### 1. Clone o Repositório
```bash
git clone https://github.com/seu-usuario/flowduo.git
cd flowduo
```

### 2. Instale as Dependências

#### Frontend
```bash
npm install
```

#### Backend
```bash
cd backend
npm install
```

---

## ⚙️ Configuração

### 1. Configurar MongoDB

#### Opção A: MongoDB Local
```bash
# Windows
# Instale o MongoDB Community Edition
# O MongoDB rodará automaticamente em mongodb://localhost:27017

# macOS
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Opção B: MongoDB Atlas (Cloud)
1. Crie uma conta em [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crie um cluster gratuito
3. Clique em "Connect" → "Connect your application"
4. Copie a string de conexão

### 2. Configurar Google OAuth

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto
3. Vá em **APIs e Serviços** → **Credenciais**
4. Clique em **+ Criar Credenciais** → **ID do Cliente OAuth 2.0**
5. Configure:
   - **Tipo**: Aplicação Web
   - **URIs de redirecionamento autorizados**:
     ```
     http://localhost:5000/api/auth/google/callback
     ```
   - **Origens JavaScript autorizadas**:
     ```
     http://localhost:5173
     http://localhost:5000
     ```
6. Copie o **Client ID** e **Client Secret**

### 3. Configurar Variáveis de Ambiente

#### Backend - Crie o arquivo `backend/.env`
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/flowduo
# OU para MongoDB Atlas:
# MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/flowduo

# Google OAuth
GOOGLE_CLIENT_ID=seu_client_id_aqui
GOOGLE_CLIENT_SECRET=seu_client_secret_aqui
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# JWT
JWT_SECRET=sua_chave_secreta_super_segura_aqui_123456

# Server
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# Email (Mailtrap para desenvolvimento)
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=seu_usuario_mailtrap
EMAIL_PASSWORD=sua_senha_mailtrap
EMAIL_FROM=noreply@flowduo.com
```

#### Como obter credenciais do Mailtrap:
1. Crie uma conta gratuita em [Mailtrap.io](https://mailtrap.io/)
2. Acesse **Email Testing** → **Inboxes**
3. Copie as credenciais SMTP

---

## 🏃 Como Executar

### Desenvolvimento Local

#### 1. Iniciar o Backend
```bash
cd backend
npm run dev
```
O servidor backend estará rodando em `http://localhost:5000`

#### 2. Iniciar o Frontend (em outro terminal)
```bash
npm run dev
```
A aplicação frontend estará disponível em `http://localhost:5173`

### Acessar a Aplicação

1. Abra o navegador em `http://localhost:5173`
2. Crie uma nova conta em `/register`
3. Verifique o email no Mailtrap
4. Faça login e comece a usar!

### Scripts Disponíveis

#### Frontend
```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview do build de produção
```

#### Backend
```bash
npm start        # Inicia servidor em produção
npm run dev      # Inicia servidor com Nodemon (auto-reload)
```

---

## 📁 Estrutura do Projeto

```
flowduo/
├── backend/                    # Servidor Node.js/Express
│   ├── config/
│   │   ├── database.js        # Configuração MongoDB
│   │   └── passport.js        # Configuração OAuth
│   ├── middleware/
│   │   └── auth.js            # Middleware JWT
│   ├── models/
│   │   ├── User.js            # Schema de usuário
│   │   ├── Task.js            # Schema de tarefa
│   │   └── Note.js            # Schema de nota
│   ├── routes/
│   │   ├── auth.js            # Rotas de autenticação
│   │   ├── tasks.js           # Rotas de tarefas
│   │   └── notes.js           # Rotas de notas
│   ├── utils/
│   │   └── emailService.js    # Serviço de envio de emails
│   ├── .env                   # Variáveis de ambiente
│   ├── server.js              # Entry point do servidor
│   └── package.json
│
├── src/                        # Código fonte React
│   ├── config/
│   │   └── api.js             # Configuração da API
│   ├── services/
│   │   ├── api.js             # Cliente HTTP
│   │   ├── authService.js     # Serviço de autenticação
│   │   └── dataService.js     # Serviço de dados
│   ├── styles/
│   │   └── auth.css           # Estilos de autenticação
│   ├── App.jsx                # Componente raiz e rotas
│   ├── main.jsx               # Entry point React
│   └── index.css              # Estilos globais
│
├── Pages/                      # Páginas da aplicação
│   ├── Login.jsx              # Página de login
│   ├── Register.jsx           # Página de registro
│   ├── ForgotPassword.jsx     # Recuperação de senha
│   ├── Dashboard.jsx          # Dashboard principal
│   └── Kambam.jsx             # Página Kanban
│
├── Components/                 # Componentes reutilizáveis
│   ├── auth/
│   │   ├── LoginForm.jsx      # Formulário de login
│   │   ├── RegisterForm.jsx   # Formulário de registro
│   │   ├── VerifyEmail.jsx    # Verificação de email
│   │   └── ForgotPassword.jsx # Recuperação de senha
│   ├── kanban/
│   │   ├── KanbanColumn.jsx   # Coluna Kanban
│   │   ├── TaskCard.jsx       # Card de tarefa
│   │   ├── TaskModal.jsx      # Modal de edição
│   │   └── DragOverlayCard.jsx
│   └── notes/
│       └── NoteSidebar.jsx    # Sidebar de notas
│
├── Entities/                   # Schemas JSON
│   ├── task.JSON              # Estrutura de tarefa
│   └── Note.JSON              # Estrutura de nota
│
├── index.html                  # HTML principal
├── vite.config.js             # Configuração Vite
├── tailwind.config.js         # Configuração Tailwind
├── postcss.config.js          # Configuração PostCSS
├── package.json               # Dependências frontend
├── README.md                  # Este arquivo
├── DESENVOLVIMENTO.md         # Processo de desenvolvimento
└── ARQUITETURA.md            # Documentação técnica
```

---

## 🌐 Deploy

### Opções de Deploy

#### Backend
- **Railway** - Recomendado
- **Render**
- **Heroku**
- **DigitalOcean**

#### Frontend
- **Vercel** - Recomendado
- **Netlify**
- **GitHub Pages**

### Configuração para Produção

1. **Backend**: Configure as variáveis de ambiente no serviço de hospedagem
2. **Frontend**: Atualize a URL da API em `src/config/api.js`
3. **MongoDB**: Use MongoDB Atlas para produção
4. **Email**: Configure SMTP com Gmail ou SendGrid

---

## 📚 Documentação Adicional

- **[DESENVOLVIMENTO.md](DESENVOLVIMENTO.md)** - Processo completo de desenvolvimento
- **[ARQUITETURA.md](ARQUITETURA.md)** - Arquitetura e decisões técnicas

---

## 🔒 Segurança

- ✅ Senhas armazenadas com hash bcrypt (10 rounds)
- ✅ JWT tokens com expiração de 7 dias
- ✅ Proteção contra brute force
- ✅ Verificação obrigatória de email
- ✅ CORS configurado corretamente
- ✅ Validações no frontend e backend
- ✅ Tokens de email com hash SHA-256
- ✅ Tokens de reset com expiração de 1 hora

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

## 👨‍💻 Autor

Desenvolvido com ❤️ 

---

<div align="center">

**[⬆ Voltar ao topo](#-flowduo---sistema-de-gerenciamento-de-tarefas-kanban)**

</div>
