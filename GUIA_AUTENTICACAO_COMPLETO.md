# 🔐 Guia Completo: Autenticação com Email e Senha + Verificação de Email

## ✅ Status da Implementação

### ✅ Já Implementado:
- [x] **Login com email e senha** - Rota POST `/api/auth/login`
- [x] **Registro com email e senha** - Rota POST `/api/auth/register`
- [x] **Verificação de email** - Rota POST `/api/auth/verify-email`
- [x] **Componentes React** para Login, Registro e Verificação
- [x] **Serviço de email** com Nodemailer (suporte Mailtrap/Gmail)
- [x] **Token JWT** para autenticação
- [x] **Proteção de rotas** no frontend
- [x] **Hash de senhas** com bcrypt
- [x] **Segurança contra brute force** (bloqueio após 5 tentativas)
- [x] **Reset de senha**
- [x] **Integração com Google OAuth**

---

## 🚀 Como Começar

### 1. Configurar Variáveis de Ambiente

#### Backend - `backend/.env`

```dotenv
# MongoDB
MONGODB_URI=mongodb://localhost:27017/kambam

# Google OAuth
GOOGLE_CLIENT_ID=280633114534-dcnt1k9jqh4b3an8rlvjqc5cq86c6a22.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# JWT
JWT_SECRET=sua_chave_secreta_super_segura_aqui

# Environment
NODE_ENV=development
PORT=5000

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Email Configuration (Usar Mailtrap para desenvolvimento)
# Obtenha credenciais gratuitas em: https://mailtrap.io
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=seu_usuario_mailtrap
EMAIL_PASSWORD=sua_senha_mailtrap
EMAIL_SERVICE=gmail
EMAIL_FROM=noreply@kambam.com
```

#### Para Gmail em Produção (Opcional):

1. Ative "Senhas de Aplicativo": https://myaccount.google.com/apppasswords
2. Use a senha gerada nas variáveis de ambiente

```dotenv
NODE_ENV=production
EMAIL_SERVICE=gmail
EMAIL_USER=seu_email@gmail.com
EMAIL_PASSWORD=sua_senha_de_app
```

---

### 2. Instalar Dependências

#### Backend:
```bash
cd backend
npm install
```

#### Frontend:
```bash
npm install
```

---

### 3. Iniciar o Servidor

#### Terminal 1 - Backend:
```bash
cd backend
npm run dev
# O servidor estará em http://localhost:5000
```

#### Terminal 2 - Frontend:
```bash
npm run dev
# A aplicação estará em http://localhost:5173
```

---

## 🧪 Fluxo de Testes Passo a Passo

### **Teste 1: Registro com Email e Senha**

1. Abra `http://localhost:5173/register` no navegador
2. Preencha o formulário:
   - **Nome**: João Silva
   - **Email**: joao@exemplo.com
   - **Senha**: senha123456
   - **Confirmar Senha**: senha123456
3. Clique em "Registrar"
4. **Resultado Esperado**: 
   - ✅ Mensagem: "Conta criada! Verifique seu email para confirmar"
   - ✅ Email de verificação foi enviado

### **Teste 2: Verificar Email com Mailtrap**

1. Se estiver usando **Mailtrap**:
   - Acesse https://mailtrap.io
   - Login com sua conta
   - Na caixa de entrada, você verá o email de verificação
   - Clique no link ou copie o token

2. Se estiver usando **Gmail**:
   - Acesse sua caixa de entrada
   - Procure pelo email de "noreply@kambam.com"

3. Clique no link "Verificar Email"
   - **Resultado Esperado**: "✅ Email verificado com sucesso!"

### **Teste 3: Login com Email e Senha**

1. Acesse `http://localhost:5173/login`
2. Preencha:
   - **Email**: joao@exemplo.com
   - **Senha**: senha123456
3. Clique em "Fazer Login"
4. **Resultado Esperado**:
   - ✅ Redirecionado para `/dashboard`
   - ✅ Dados do usuário salvos em localStorage

### **Teste 4: Validações de Login**

#### 4a. Email Inválido:
- Tente logar com: `email-invalido`
- **Resultado**: ❌ Erro "Email inválido"

#### 4b. Senha Incorreta:
- Email: joao@exemplo.com
- Senha: senhaerrada123
- **Resultado**: ❌ Erro "Email ou senha inválidos"
- **Segurança**: Após 5 tentativas, a conta será bloqueada por 30 minutos

#### 4c. Email Não Verificado:
- Crie uma nova conta mas NÃO verifique o email
- Tente fazer login
- **Resultado**: ❌ Erro "Verifique seu email antes de fazer login"

### **Teste 5: Reset de Senha**

1. Acesse `http://localhost:5173/login`
2. Clique em "Esqueceu sua senha?"
3. Digite seu email: joao@exemplo.com
4. **Resultado**: ✅ Email de reset foi enviado
5. Procure o email no Mailtrap/Gmail
6. Clique no link para redefinir
7. Nova senha: novaSenha123456
8. Confirme a nova senha
9. Clique em "Redefinir Senha"
10. **Resultado**: ✅ Você será redirecionado para login
11. Faça login com a nova senha

### **Teste 6: Logout**

1. Estando autenticado no dashboard
2. Clique em logout (verificar se há botão)
3. **Resultado**: ✅ Redirecionado para login, localStorage limpo

### **Teste 7: Rota Protegida**

1. Abra `http://localhost:5173/dashboard` sem estar logado
2. **Resultado**: ✅ Redirecionado para login

### **Teste 8: Login com Google OAuth**

1. Na página de login, clique em "Entrar com Google"
2. Selecione sua conta Google
3. **Resultado**: ✅ Redirecionado para dashboard, usuário criado/atualizado

---

## 📧 Estrutura do Email de Verificação

O email enviado para verificação contém:

```html
Subject: Verifique seu email - KAMBAM

Bem-vindo ao KAMBAM!

Para completar seu registro, clique no link abaixo para verificar seu email:
[Botão: Verificar Email]

Este link expira em 24 horas.

Se você não criou esta conta, ignore este email.
```

---

## 🔐 Segurança Implementada

### ✅ Medidas de Segurança:

1. **Hash de Senhas**: Bcrypt com salt de 10 rounds
2. **JWT com Expiração**: 7 dias de validade
3. **Bloqueio de Brute Force**: Máximo 5 tentativas, bloqueio por 30 minutos
4. **Token de Verificação**: Salvo com hash SHA-256, expira em 24 horas
5. **Token de Reset**: Expira em 1 hora
6. **Email Verificado Obrigatório**: Não pode fazer login sem verificar
7. **CORS**: Configurado para apenas frontend autorizado
8. **Validação de Email**: Regex validação de formato
9. **Validação de Senha**: Mínimo 6 caracteres

---

## 🐛 Troubleshooting

### Problema: "Email de verificação não está chegando"

**Solução**:
1. Verifique as credenciais do Mailtrap em `backend/.env`
2. Acesse https://mailtrap.io e verifique a caixa de entrada
3. Verifique se o FRONTEND_URL está correto
4. Consulte os logs do servidor para erros

### Problema: "Token inválido ou expirado"

**Solução**:
1. O token expira em 24 horas para verificação
2. E em 1 hora para reset de senha
3. Gere um novo token solicitando novamente

### Problema: "Email já registrado"

**Solução**:
1. Use um email diferente
2. Ou delete o usuário do MongoDB e tente novamente

### Problema: "Conta bloqueada temporariamente"

**Solução**:
1. Você excedeu 5 tentativas de login
2. Aguarde 30 minutos
3. Ou faça reset de senha para desbloquear

---

## 📊 Diagrama de Fluxo

```
REGISTRO
  └─ Email + Senha
     └─ Validar
     └─ Verificar se existe
     └─ Hash de senha
     └─ Gerar token de verificação
     └─ Salvar no DB
     └─ Enviar email
     └─ Mostrar mensagem

VERIFICAÇÃO
  └─ Clica no link do email
     └─ Token extraído da URL
     └─ Validar token
     └─ Marcar email como verificado
     └─ Redirecionar para login

LOGIN
  └─ Email + Senha
     └─ Validar
     └─ Buscar usuário
     └─ Verificar se email está confirmado
     └─ Validar bloqueio
     └─ Comparar senha
     └─ Incrementar tentativas se falhar
     └─ Bloquear se 5+ tentativas
     └─ Reset de tentativas se sucesso
     └─ Gerar JWT
     └─ Retornar token

RESET DE SENHA
  └─ Email
     └─ Gerar token de reset
     └─ Salvar com hash
     └─ Enviar email
     └─ Clica no link
     └─ Nova Senha
     └─ Validar token
     └─ Hash de nova senha
     └─ Salvar no DB
     └─ Sucesso!
```

---

## 🛠️ Endpoints da API

### Autenticação

#### Registro
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "password": "senha123456",
  "confirmPassword": "senha123456"
}

Response:
{
  "success": true,
  "message": "Conta criada! Verifique seu email para confirmar",
  "email": "joao@exemplo.com"
}
```

#### Verificar Email
```
POST /api/auth/verify-email
Content-Type: application/json

{
  "token": "token_do_email"
}

Response:
{
  "success": true,
  "message": "Email verificado com sucesso! Você já pode fazer login"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "joao@exemplo.com",
  "password": "senha123456"
}

Response:
{
  "success": true,
  "token": "jwt_token_aqui",
  "user": {
    "id": "user_id",
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "isEmailVerified": true
  }
}
```

#### Esquecer Senha
```
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "joao@exemplo.com"
}

Response:
{
  "success": true,
  "message": "Email de reset enviado. Verifique sua caixa de entrada"
}
```

#### Redefinir Senha
```
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "token_do_reset",
  "password": "novaSenha123456",
  "confirmPassword": "novaSenha123456"
}

Response:
{
  "success": true,
  "message": "Senha redefinida com sucesso! Faça login novamente"
}
```

#### Obter Usuário Atual
```
GET /api/auth/me
Authorization: Bearer jwt_token_aqui

Response:
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "isEmailVerified": true,
    "photo": null,
    "createdAt": "2024-12-29T10:30:00Z"
  }
}
```

#### Logout
```
POST /api/auth/logout
Content-Type: application/json

Response:
{
  "success": true,
  "message": "Logout realizado com sucesso"
}
```

---

## 📝 Próximas Melhorias (Opcional)

- [ ] 2FA (Two-Factor Authentication)
- [ ] Login por SMS
- [ ] Integração com outros provedores (GitHub, Microsoft)
- [ ] Rate limiting
- [ ] Email para recuperação de conta
- [ ] Histórico de login
- [ ] Autenticação por fingerprint

---

## 📚 Estrutura de Arquivos

```
projeto/
├── backend/
│   ├── routes/
│   │   └── auth.js          ✅ Rotas de autenticação
│   ├── models/
│   │   └── User.js          ✅ Modelo de usuário com campos de verificação
│   ├── middleware/
│   │   └── auth.js          ✅ Middleware de verificação de JWT
│   ├── utils/
│   │   └── emailService.js  ✅ Serviço de envio de emails
│   ├── config/
│   │   └── passport.js      ✅ Configuração de OAuth
│   └── server.js            ✅ Servidor Express
├── Components/
│   └── auth/
│       ├── LoginForm.jsx        ✅ Formulário de login
│       ├── RegisterForm.jsx     ✅ Formulário de registro
│       ├── VerifyEmail.jsx      ✅ Verificação de email
│       └── ForgotPassword.jsx   ✅ Reset de senha
├── Pages/
│   ├── Login.jsx            ✅ Página de login
│   ├── Register.jsx         ✅ Página de registro
│   └── ForgotPassword.jsx   ✅ Página de reset
├── src/
│   ├── services/
│   │   └── authService.js   ✅ Chamadas à API
│   └── App.jsx              ✅ Rotas protegidas
└── README.md

```

---

## ✨ Conclusão

Sua autenticação agora está totalmente funcional com:
- ✅ Registro e login com email/senha
- ✅ Verificação obrigatória de email
- ✅ Segurança contra brute force
- ✅ Reset de senha
- ✅ Integração com Google OAuth
- ✅ Proteção de rotas
- ✅ Persistência de sessão

**Próximos passos**: Testar todos os cenários e você terá um sistema de autenticação robusto! 🚀

---

*Documentação criada em 29 de dezembro de 2024*
