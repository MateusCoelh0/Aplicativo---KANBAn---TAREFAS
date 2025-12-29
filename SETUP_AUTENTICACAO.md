# 🚀 Setup - Autenticação com Email e Senha

## ✅ Checklist de Implementação

### Backend ✓
- [x] Rotas de autenticação (`/api/auth/register`, `/api/auth/login`, `/api/auth/verify-email`)
- [x] Modelo de usuário com verificação de email
- [x] Middleware de autenticação JWT
- [x] Serviço de email com Nodemailer
- [x] Validações e segurança
- [x] Google OAuth 2.0

### Frontend ✓
- [x] Componente LoginForm
- [x] Componente RegisterForm
- [x] Componente VerifyEmail
- [x] Componente ForgotPassword
- [x] Página Login.jsx
- [x] Página Register.jsx
- [x] Página ForgotPassword.jsx
- [x] Serviço authService
- [x] Rotas protegidas no App.jsx

---

## 🔧 Configuração Rápida (5 minutos)

### 1️⃣ Mailtrap (Recomendado para Desenvolvimento)

**Passo 1**: Criar conta grátis
- Acesse https://mailtrap.io
- Registre-se com email
- Confirme seu email

**Passo 2**: Obter credenciais
- No painel, vá para "Email Testing"
- Clique em "My Inbox"
- Abra as credenciais SMTP

**Passo 3**: Atualizar `.env`
```bash
cd backend
# Edite o arquivo .env com suas credenciais do Mailtrap
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=seu_usuario
EMAIL_PASSWORD=sua_senha
```

### 2️⃣ Instalar Dependências

```bash
# Backend
cd backend
npm install

# Frontend (na raiz do projeto)
npm install
```

### 3️⃣ Iniciar Servidores

**Terminal 1 - Backend**:
```bash
cd backend
npm run dev
# 🚀 Servidor rodando em http://localhost:5000
```

**Terminal 2 - Frontend**:
```bash
npm run dev
# 🚀 Aplicação rodando em http://localhost:5173
```

### 4️⃣ Testar

Abra em seu navegador:
- **Registro**: http://localhost:5173/register
- **Login**: http://localhost:5173/login
- **Dashboard**: http://localhost:5173/dashboard

---

## 🧪 Teste Rápido (3 minutos)

1. **Registre uma nova conta**:
   - Nome: Teste
   - Email: teste@exemplo.com
   - Senha: 123456

2. **Verifique o email**:
   - Abra https://mailtrap.io
   - Copie o link de verificação
   - Clique em `/verify-email?token=...`

3. **Faça login**:
   - Email: teste@exemplo.com
   - Senha: 123456
   - ✅ Você será redirecionado para o dashboard!

---

## 📧 Emails Automáticos

O sistema enviará automaticamente:

### 1. Email de Verificação (ao registrar)
- Enviado imediatamente após registro
- Link expira em 24 horas
- Necessário antes de fazer login

### 2. Email de Reset de Senha
- Enviado quando clica em "Esqueceu a senha?"
- Link expira em 1 hora
- Permite redefinir a senha

---

## 🔒 Segurança

### ✅ Implementado:
1. **Senhas em Hash**: Bcrypt com 10 rounds
2. **Tokens JWT**: Expiram em 7 dias
3. **Proteção contra Brute Force**: 5 tentativas = 30 min bloqueado
4. **Validação de Email**: Obrigatório antes do login
5. **CORS**: Apenas localhost:5173 autorizado
6. **Variáveis de Ambiente**: Senhas seguras no .env

---

## 🐛 Problemas Comuns

### "Email não está chegando"
```bash
# Verificar logs no backend
# Procure por erros do nodemailer
# Confirme credenciais Mailtrap em backend/.env
```

### "Token inválido"
```bash
# Token de verificação: válido por 24 horas
# Token de reset: válido por 1 hora
# Se expirou, gere um novo
```

### "Conta bloqueada"
```bash
# Após 5 tentativas incorretas, aguarde 30 min
# Ou faça reset de senha
```

---

## 📚 Próximos Passos

1. ✅ Conectar suas páginas ao dashboard
2. ✅ Adicionar mais campos de perfil (telefone, avatar, etc)
3. ✅ Implementar refresh de tokens
4. ✅ Adicionar autenticação em rotas protegidas
5. ✅ Integrar com serviço de tarefas

---

## 🎯 Fluxo Completo Esperado

```
REGISTRO → EMAIL DE VERIFICAÇÃO → VERIFICAR EMAIL → LOGIN → DASHBOARD
```

**Cada etapa é necessária para a próxima funcionar!**

---

Está pronto para usar! 🎉

Qualquer dúvida, consulte o `GUIA_AUTENTICACAO_COMPLETO.md`
