# 📋 FlowDuo - Agendador de Tarefas Kanban

<div align="center">

![FlowDuo Logo](https://img.shields.io/badge/FlowDuo-Kanban%20Board-blue?style=for-the-badge)

Sistema completo de gerenciamento de tarefas estilo Kanban com autenticação, notas e drag-and-drop intuitivo.

[![React](https://img.shields.io/badge/React-18.2-61dafb?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248?logo=mongodb)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

[Demo ao Vivo](#) | [Documentação](#-funcionalidades) | [Instalação](#-instalação) | [Deploy](#-deploy)

</div>

---

## ✨ Funcionalidades

### 🔐 Autenticação Completa
- ✅ Registro com email e senha
- ✅ Login com Google OAuth 2.0
- ✅ Verificação de email
- ✅ Recuperação de senha
- ✅ JWT tokens seguros

### 📊 Gerenciamento de Tarefas
- ✅ Quadro Kanban com 3 colunas (A Fazer, Em Progresso, Concluído)
- ✅ Drag-and-drop fluido com visual feedback
- ✅ Criar, editar e excluir tarefas
- ✅ Prioridades (Baixa, Média, Alta) com cores
- ✅ Atribuir tarefas a usuários
- ✅ Descrições detalhadas

### 📝 Sistema de Notas
- ✅ Criar notas rápidas
- ✅ Persistência no MongoDB
- ✅ Editar e deletar notas
- ✅ Sidebar flutuante

### 🎨 Interface Moderna
- ✅ Design responsivo
- ✅ Tailwind CSS
- ✅ Animações com Framer Motion
- ✅ Tema escuro nas colunas
- ✅ Feedback visual em todas as ações

---

## 🛠️ Tecnologias

### Frontend
- **React 18.2** - Biblioteca UI
- **Vite 4.5** - Build tool super rápido
- **Tailwind CSS 3.3** - Estilização utility-first
- **Framer Motion 10** - Animações fluidas
- **@dnd-kit** - Drag-and-drop moderno
- **Lucide React** - Ícones bonitos
- **React Router 6** - Navegação

### Backend
- **Node.js** - Runtime JavaScript
- **Express 4.18** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Mongoose 8.0** - ODM para MongoDB
- **Passport.js** - Autenticação
- **JWT** - Tokens seguros
- **Nodemailer** - Envio de emails
- **bcryptjs** - Hash de senhas

---

## 🚀 Instalação

### Pré-requisitos
- Node.js 18+ instalado
- MongoDB instalado e rodando
- Conta Google Cloud (para OAuth)
- Conta Mailtrap (para emails em desenvolvimento)

### 1. Clone o Repositório
```bash
git clone https://github.com/seu-usuario/flowduo.git
cd flowduo
```

### 2. Configure o Backend
```bash
cd backend
npm install

# Copie o arquivo de exemplo
cp .env.example .env

# Edite o .env com suas credenciais
# MONGODB_URI, GOOGLE_CLIENT_ID, etc.
```

### 3. Configure o Frontend
```bash
# Volte para a raiz
cd ..
npm install

# Copie o arquivo de exemplo
cp .env.example .env

# (Opcional) Configure VITE_API_URL se necessário
```

### 4. Configure o Google OAuth
Siga as instruções em [CONFIGURACAO_GOOGLE_OAUTH.md](CONFIGURACAO_GOOGLE_OAUTH.md)

### 5. Inicie os Servidores

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 6. Acesse o Aplicativo
Abra http://localhost:5173 no navegador

---

## 📁 Estrutura do Projeto

```
flowduo/
├── backend/
│   ├── config/
│   │   ├── database.js      # Configuração MongoDB
│   │   └── passport.js      # Configuração OAuth
│   ├── middleware/
│   │   └── auth.js          # Middleware JWT
│   ├── models/
│   │   ├── User.js          # Schema de usuário
│   │   ├── Task.js          # Schema de tarefa
│   │   └── Note.js          # Schema de nota
│   ├── routes/
│   │   ├── auth.js          # Rotas de autenticação
│   │   ├── tasks.js         # CRUD de tarefas
│   │   └── notes.js         # CRUD de notas
│   ├── utils/
│   │   └── emailService.js  # Serviço de email
│   ├── .env.example         # Template de variáveis
│   ├── package.json
│   └── server.js            # Servidor principal
├── src/
│   ├── config/
│   │   └── api.js           # Configuração de API
│   ├── services/
│   │   ├── api.js           # Chamadas à API
│   │   ├── authService.js   # Lógica de autenticação
│   │   └── dataService.js   # Serviços auxiliares
│   ├── styles/
│   │   └── auth.css         # Estilos de autenticação
│   ├── App.jsx              # Componente raiz
│   ├── main.jsx             # Entry point
│   └── index.css            # Estilos globais
├── Components/
│   ├── auth/
│   │   ├── LoginForm.jsx
│   │   ├── RegisterForm.jsx
│   │   ├── ForgotPassword.jsx
│   │   └── VerifyEmail.jsx
│   ├── kanban/
│   │   ├── KanbanColumn.jsx
│   │   ├── TaskCard.jsx
│   │   ├── TaskModal.jsx
│   │   └── DragOverlayCard.jsx
│   └── notes/
│       └── NoteSidebar.jsx
├── Pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   └── Kambam.jsx
├── .gitignore
├── package.json
├── vite.config.js
├── tailwind.config.js
├── GUIA_DEPLOY.md          # Guia completo de deploy
├── DEPLOY_RAPIDO.md        # Deploy em 15 minutos
└── README.md               # Este arquivo
```

---

## 🌐 Deploy para Produção

### 🚀 Deploy Rápido (15 minutos)
Siga o [DEPLOY_RAPIDO.md](DEPLOY_RAPIDO.md) para colocar no ar rapidamente usando:
- **MongoDB Atlas** (Banco de dados gratuito)
- **Railway** (Backend gratuito)
- **Vercel** (Frontend gratuito)

### 📚 Deploy Completo
Para instruções detalhadas e alternativas, consulte [GUIA_DEPLOY.md](GUIA_DEPLOY.md)

### 💰 Custo
**100% GRATUITO** usando os planos free tier:
- MongoDB Atlas: 512MB
- Railway: 500h/mês
- Vercel: Unlimited
- SendGrid: 100 emails/dia

---

## 📸 Screenshots

### Tela de Login
- Design moderno com gradiente slate
- Login com email/senha ou Google
- Ícone de visualização de senha
- Recuperação de senha
- Rodapé personalizado

### Dashboard Kanban
- 3 colunas customizáveis
- Drag-and-drop com feedback visual
- Cards coloridos por prioridade
- Contador de tarefas por coluna

### Sistema de Notas
- Sidebar flutuante
- Criação rápida
- Persistência automática

---

## 🔑 Variáveis de Ambiente

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/flowduo
GOOGLE_CLIENT_ID=seu_client_id
GOOGLE_CLIENT_SECRET=seu_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
JWT_SECRET=sua_chave_secreta_min_32_caracteres
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=seu_user_mailtrap
EMAIL_PASSWORD=sua_senha_mailtrap
EMAIL_FROM=noreply@kambam.com
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🧪 Testando

### Testes Manuais
1. **Autenticação**
   - Criar nova conta
   - Verificar email
   - Login com email/senha
   - Login com Google
   - Recuperar senha

2. **Tarefas**
   - Criar tarefa
   - Editar tarefa
   - Mover entre colunas (drag-and-drop)
   - Deletar tarefa
   - Filtrar por prioridade

3. **Notas**
   - Criar nota
   - Editar nota
   - Deletar nota

---

## 📝 API Endpoints

### Autenticação
- `POST /api/auth/register` - Criar conta
- `POST /api/auth/login` - Fazer login
- `POST /api/auth/verify-email` - Verificar email
- `POST /api/auth/forgot-password` - Solicitar reset de senha
- `POST /api/auth/reset-password` - Redefinir senha
- `GET /api/auth/google` - Login com Google
- `GET /api/auth/google/callback` - Callback do Google
- `GET /api/auth/me` - Obter usuário atual

### Tarefas
- `GET /api/tasks` - Listar todas as tarefas
- `GET /api/tasks/:id` - Obter tarefa específica
- `POST /api/tasks` - Criar nova tarefa
- `PUT /api/tasks/:id` - Atualizar tarefa
- `DELETE /api/tasks/:id` - Deletar tarefa

### Notas
- `GET /api/notes` - Listar todas as notas
- `POST /api/notes` - Criar nova nota
- `PUT /api/notes/:id` - Atualizar nota
- `DELETE /api/notes/:id` - Deletar nota

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 🐛 Problemas Conhecidos e Soluções

### CORS Error
**Solução**: Verifique se `FRONTEND_URL` está corretamente configurado no backend

### MongoDB Connection Error
**Solução**: Certifique-se de que o MongoDB está rodando localmente ou a string de conexão do Atlas está correta

### Google OAuth 400 Error
**Solução**: Consulte [CONFIGURACAO_GOOGLE_OAUTH.md](CONFIGURACAO_GOOGLE_OAUTH.md)

### Email não envia
**Solução**: Verifique credenciais do Mailtrap/SendGrid no .env

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Desenvolvedor

**Mateus Coelho**

- 💼 LinkedIn: [Seu LinkedIn]
- 🐙 GitHub: [Seu GitHub]
- 📧 Email: [Seu Email]

---

## 🙏 Agradecimentos

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [dnd-kit](https://dndkit.com/)
- [Lucide Icons](https://lucide.dev/)

---

<div align="center">

### ⭐ Se este projeto foi útil, deixe uma estrela!

Made with ❤️ by Mateus Coelho

</div>
