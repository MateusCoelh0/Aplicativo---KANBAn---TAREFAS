# 🚀 Guia de Deploy - FlowDuo

Este guia mostra como publicar o aplicativo FlowDuo para produção usando serviços gratuitos.

## 📋 Índice

1. [Preparação do Projeto](#preparação)
2. [Deploy do Backend (Railway/Render)](#backend)
3. [Deploy do Frontend (Vercel/Netlify)](#frontend)
4. [Configuração do Banco de Dados (MongoDB Atlas)](#mongodb)
5. [Configuração de Email](#email)
6. [Google OAuth para Produção](#google-oauth)
7. [Testes Finais](#testes)

---

## 🔧 Preparação do Projeto {#preparação}

### 1. Atualizar .gitignore

O arquivo `.gitignore` já está configurado para não enviar dados sensíveis.

### 2. Criar arquivo .env.example

Já foi criado em `backend/.env.example` como template.

### 3. Build do Frontend

```bash
npm run build
```

Isso criará a pasta `dist/` com os arquivos otimizados.

---

## 🖥️ Deploy do Backend {#backend}

### Opção 1: Railway (Recomendado - Simples e Gratuito)

#### Passo 1: Criar conta no Railway
- Acesse: https://railway.app/
- Faça login com GitHub

#### Passo 2: Criar novo projeto
- Clique em "New Project"
- Selecione "Deploy from GitHub repo"
- Autorize o Railway a acessar seus repositórios
- Selecione o repositório do FlowDuo

#### Passo 3: Configurar o Backend
- Railway detectará automaticamente o Node.js
- Vá em "Settings" do seu projeto
- Configure as variáveis de ambiente:

```env
MONGODB_URI=sua_uri_do_mongodb_atlas
GOOGLE_CLIENT_ID=seu_client_id
GOOGLE_CLIENT_SECRET=seu_client_secret
GOOGLE_CALLBACK_URL=https://seu-app.railway.app/api/auth/google/callback
JWT_SECRET=sua_chave_secreta_super_segura_min_32_chars
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://seu-app.vercel.app
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=sua_api_key_sendgrid
EMAIL_FROM=noreply@seu-dominio.com
```

#### Passo 4: Configurar Start Command
- Em "Settings" > "Deploy"
- Root Directory: `backend`
- Start Command: `npm start`

#### Passo 5: Deploy
- Clique em "Deploy"
- Aguarde o deploy (2-3 minutos)
- Copie a URL do seu backend (ex: https://flowduo-production.up.railway.app)

---

### Opção 2: Render (Alternativa Gratuita)

#### Passo 1: Criar conta no Render
- Acesse: https://render.com/
- Faça login com GitHub

#### Passo 2: Criar Web Service
- Clique em "New +" > "Web Service"
- Conecte seu repositório GitHub
- Configure:
  - Name: flowduo-backend
  - Environment: Node
  - Region: Oregon (US West) ou próximo
  - Branch: main
  - Root Directory: backend
  - Build Command: `npm install`
  - Start Command: `npm start`

#### Passo 3: Adicionar variáveis de ambiente
- Na aba "Environment", adicione todas as variáveis do .env.example

#### Passo 4: Deploy
- Clique em "Create Web Service"
- Aguarde o deploy
- Copie a URL (ex: https://flowduo-backend.onrender.com)

---

## 🌐 Deploy do Frontend {#frontend}

### Opção 1: Vercel (Recomendado)

#### Passo 1: Criar conta na Vercel
- Acesse: https://vercel.com/
- Faça login com GitHub

#### Passo 2: Importar projeto
- Clique em "Add New..." > "Project"
- Selecione seu repositório
- Configure:
  - Framework Preset: Vite
  - Root Directory: ./
  - Build Command: `npm run build`
  - Output Directory: dist

#### Passo 3: Variáveis de ambiente
- Adicione: `VITE_API_URL=https://seu-backend.railway.app/api`

#### Passo 4: Deploy
- Clique em "Deploy"
- Aguarde (1-2 minutos)
- Copie a URL (ex: https://flowduo.vercel.app)

---

### Opção 2: Netlify (Alternativa)

#### Passo 1: Criar conta no Netlify
- Acesse: https://netlify.com/
- Faça login com GitHub

#### Passo 2: Adicionar novo site
- "Add new site" > "Import an existing project"
- Conecte com GitHub
- Selecione o repositório

#### Passo 3: Configurações de build
- Build command: `npm run build`
- Publish directory: `dist`
- Adicione variável: `VITE_API_URL=https://seu-backend.railway.app/api`

#### Passo 4: Deploy
- Clique em "Deploy site"
- Aguarde o deploy

---

## 🗄️ MongoDB Atlas (Banco de Dados na Nuvem) {#mongodb}

### Passo 1: Criar conta no MongoDB Atlas
- Acesse: https://www.mongodb.com/cloud/atlas/register
- Crie uma conta gratuita

### Passo 2: Criar cluster
- Escolha "Free Shared Cluster" (M0)
- Provider: AWS
- Region: Escolha a mais próxima dos seus usuários
- Cluster Name: flowduo-cluster
- Clique em "Create Cluster"

### Passo 3: Configurar acesso
1. **Database Access**:
   - Clique em "Database Access" (menu lateral)
   - "Add New Database User"
   - Username: flowduo_admin
   - Password: Gere uma senha segura
   - Database User Privileges: "Read and write to any database"
   - Clique em "Add User"

2. **Network Access**:
   - Clique em "Network Access"
   - "Add IP Address"
   - "Allow Access from Anywhere" (0.0.0.0/0)
   - Clique em "Confirm"

### Passo 4: Obter Connection String
- Clique em "Clusters" > "Connect"
- "Connect your application"
- Copie a connection string:
  ```
  mongodb+srv://flowduo_admin:<password>@flowduo-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
  ```
- Substitua `<password>` pela senha do usuário
- Adicione o nome do banco: `.../flowduo?retryWrites=true&w=majority`

### Passo 5: Atualizar variável MONGODB_URI
- No Railway/Render, atualize a variável `MONGODB_URI` com essa string

---

## 📧 Configuração de Email {#email}

### Opção 1: SendGrid (Recomendado - 100 emails/dia grátis)

#### Passo 1: Criar conta
- Acesse: https://sendgrid.com/
- Crie conta gratuita

#### Passo 2: Criar API Key
- Settings > API Keys
- Create API Key
- Nome: FlowDuo Production
- Full Access
- Copie a API Key (guarde bem!)

#### Passo 3: Verificar domínio remetente
- Settings > Sender Authentication
- "Verify a Single Sender"
- Preencha com seu email
- Verifique o email de confirmação

#### Passo 4: Configurar no backend
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=sua_api_key_aqui
EMAIL_FROM=seu-email-verificado@gmail.com
```

---

### Opção 2: Gmail (Alternativa)

#### Passo 1: Ativar verificação em 2 etapas
- Acesse: https://myaccount.google.com/security
- Ative a "Verificação em duas etapas"

#### Passo 2: Gerar senha de app
- "Senhas de app"
- App: "Email"
- Dispositivo: "Outro (Nome personalizado)"
- Nome: "FlowDuo"
- Copie a senha gerada

#### Passo 3: Configurar
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu-email@gmail.com
EMAIL_PASSWORD=senha_de_app_gerada
EMAIL_FROM=seu-email@gmail.com
```

---

## 🔐 Google OAuth para Produção {#google-oauth}

### Passo 1: Atualizar OAuth Consent Screen
- Acesse: https://console.cloud.google.com/
- Navegue para "APIs & Services" > "OAuth consent screen"
- Clique em "PUBLISH APP" (mudar de Testing para Production)

### Passo 2: Atualizar Authorized URLs
- Vá em "Credentials"
- Clique no seu OAuth 2.0 Client ID
- **Authorized JavaScript origins**:
  ```
  https://flowduo.vercel.app
  https://seu-dominio-custom.com (se houver)
  ```
- **Authorized redirect URIs**:
  ```
  https://flowduo-backend.railway.app/api/auth/google/callback
  ```

### Passo 3: Atualizar .env do backend
```env
GOOGLE_CALLBACK_URL=https://seu-backend.railway.app/api/auth/google/callback
FRONTEND_URL=https://flowduo.vercel.app
```

---

## 🎯 Atualizar URLs no Frontend

### Passo 1: Criar arquivo de configuração
Crie `src/config/api.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV 
    ? 'http://localhost:5000/api' 
    : 'https://seu-backend.railway.app/api');

export default API_BASE_URL;
```

### Passo 2: Atualizar src/services/api.js
```javascript
import API_BASE_URL from '../config/api';

const api = {
  baseURL: API_BASE_URL,
  // ... resto do código
};
```

### Passo 3: Atualizar LoginForm para Google OAuth
Em `Components/auth/LoginForm.jsx`, linha ~100:
```javascript
const handleGoogleLogin = () => {
  const backendUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 
    'http://localhost:5000';
  window.location.href = `${backendUrl}/api/auth/google`;
};
```

---

## ✅ Checklist Final de Deploy

### Backend
- [ ] MongoDB Atlas configurado e conectado
- [ ] Variáveis de ambiente configuradas
- [ ] Email service configurado (SendGrid/Gmail)
- [ ] Google OAuth atualizado para produção
- [ ] Backend deployado e rodando
- [ ] Teste: https://seu-backend.com/api (deve retornar JSON)

### Frontend
- [ ] VITE_API_URL configurado
- [ ] Build gerado sem erros
- [ ] Frontend deployado
- [ ] Domínio customizado configurado (opcional)

### Integrações
- [ ] Login com email/senha funcionando
- [ ] Login com Google funcionando
- [ ] Envio de emails funcionando
- [ ] Criação de tarefas funcionando
- [ ] Drag and drop funcionando
- [ ] Notas funcionando

---

## 🧪 Testando o Aplicativo {#testes}

### 1. Teste de Registro
- Acesse seu frontend em produção
- Crie uma nova conta
- Verifique se recebeu o email de verificação
- Clique no link de verificação

### 2. Teste de Login
- Faça login com email/senha
- Teste o "Esqueci minha senha"
- Teste login com Google

### 3. Teste de Funcionalidades
- Crie uma tarefa
- Arraste entre colunas
- Edite uma tarefa
- Delete uma tarefa
- Crie uma nota
- Delete uma nota

---

## 🚨 Solução de Problemas Comuns

### CORS Error
**Problema**: "Access to fetch has been blocked by CORS policy"

**Solução**: No backend `server.js`, certifique-se de que o CORS está configurado:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

### MongoDB Connection Error
**Problema**: "MongoServerError: bad auth"

**Solução**:
1. Verifique usuário/senha do MongoDB
2. Certifique-se de que substituiu `<password>` na connection string
3. Verifique se o IP 0.0.0.0/0 está liberado no Network Access

### Email não enviando
**Problema**: Emails de verificação não chegam

**Solução**:
1. Verifique as credenciais do SendGrid/Gmail
2. Certifique-se de que verificou o sender no SendGrid
3. Verifique os logs do backend para erros
4. Teste com Mailtrap primeiro

### Google OAuth não funciona
**Problema**: Erro 400 ao clicar em "Entrar com Google"

**Solução**:
1. Verifique se as URLs estão corretas no Google Console
2. Certifique-se de que o app está "Published" (não Testing)
3. Verifique se GOOGLE_CALLBACK_URL está correta
4. Limpe cache do navegador

---

## 🎉 Pronto!

Seu aplicativo está no ar! Compartilhe a URL com seus usuários:
- Frontend: `https://flowduo.vercel.app`
- Convide pessoas para testar
- Monitore logs para erros
- Colete feedback dos usuários

## 📊 Monitoramento

### Railway/Render
- Acesse o dashboard para ver logs em tempo real
- Configure alertas de downtime
- Monitore uso de recursos

### Vercel/Netlify
- Analytics built-in
- Monitore tempo de carregamento
- Veja acessos em tempo real

---

## 🔄 Atualizações Futuras

Para atualizar o aplicativo:
1. Faça as alterações no código
2. Commit e push para o GitHub
3. O deploy automático será acionado
4. Aguarde 2-3 minutos
5. Teste as alterações em produção

---

## 💰 Custos (Estimativa)

### Plano Gratuito Completo:
- **MongoDB Atlas**: Free tier (512MB)
- **Railway**: 500h/mês grátis (mais que suficiente)
- **Vercel**: Unlimited deployments
- **SendGrid**: 100 emails/dia grátis

**Total: R$ 0,00/mês** 🎉

### Se precisar escalar:
- MongoDB Atlas: A partir de $9/mês (10GB)
- Railway: $5/mês por serviço
- SendGrid: A partir de $15/mês (40.000 emails)

---

**Desenvolvido por Mateus Coelho**
