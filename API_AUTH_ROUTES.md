# Rotas de Autenticação - KAMBAM

## Configuração de Email

Para receber emails de verificação e reset de senha, configure o Mailtrap (grátis):

1. Vá para https://mailtrap.io
2. Crie uma conta gratuita
3. Crie uma nova caixa de correio
4. Copie as credenciais SMTP
5. Atualize o `.env`:

```env
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=seu_usuario_mailtrap
EMAIL_PASSWORD=sua_senha_mailtrap
```

---

## Rotas de Registro e Login

### 1. Registrar novo usuário

**POST** `/api/auth/register`

```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123",
  "confirmPassword": "senha123"
}
```

**Resposta (201):**
```json
{
  "success": true,
  "message": "Conta criada! Verifique seu email para confirmar",
  "email": "joao@example.com"
}
```

---

### 2. Verificar Email

**POST** `/api/auth/verify-email`

```json
{
  "token": "token_recebido_no_email"
}
```

**Resposta (200):**
```json
{
  "success": true,
  "message": "Email verificado com sucesso! Você já pode fazer login"
}
```

---

### 3. Login com Email e Senha

**POST** `/api/auth/login`

```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Resposta (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "João Silva",
    "email": "joao@example.com",
    "photo": null,
    "isEmailVerified": true
  }
}
```

---

### 4. Solicitar Reset de Senha

**POST** `/api/auth/forgot-password`

```json
{
  "email": "joao@example.com"
}
```

**Resposta (200):**
```json
{
  "success": true,
  "message": "Email de reset enviado. Verifique sua caixa de entrada"
}
```

---

### 5. Redefinir Senha

**POST** `/api/auth/reset-password`

```json
{
  "token": "token_recebido_no_email",
  "password": "novaSenha123",
  "confirmPassword": "novaSenha123"
}
```

**Resposta (200):**
```json
{
  "success": true,
  "message": "Senha redefinida com sucesso! Faça login novamente"
}
```

---

### 6. Obter Usuário Atual

**GET** `/api/auth/me`

**Headers:**
```
Authorization: Bearer seu_jwt_token
```

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "name": "João Silva",
    "email": "joao@example.com",
    "isEmailVerified": true,
    "lastLogin": "2024-12-29T10:30:00.000Z",
    "createdAt": "2024-12-29T10:00:00.000Z",
    "updatedAt": "2024-12-29T10:30:00.000Z"
  }
}
```

---

### 7. Logout

**POST** `/api/auth/logout`

**Resposta (200):**
```json
{
  "success": true,
  "message": "Logout realizado com sucesso"
}
```

---

### 8. Login com Google (Existente)

**GET** `/api/auth/google`

Inicia o fluxo OAuth do Google

**Callback:** `/api/auth/google/callback`

Redireciona para o frontend com `token` e `user` nos parâmetros da URL

---

## Recursos de Segurança

✅ **Senhas com Hash** - Usando bcryptjs (10 rounds de salt)
✅ **Email Verification** - Token único com expiração de 24h
✅ **Password Reset** - Token único com expiração de 1h
✅ **Rate Limiting** - Conta bloqueada após 5 tentativas de login erradas (30 min)
✅ **JWT Tokens** - Expiram em 7 dias
✅ **Validação de Email** - Regex para validar formato de email

---

## Fluxo de Uso no Frontend

### Registro
1. Usuário preenche formulário (nome, email, senha)
2. POST para `/api/auth/register`
3. Email é enviado com link de verificação
4. Usuário clica no link e token é enviado para `/api/auth/verify-email`
5. Email é verificado ✓

### Login
1. Usuário entra com email e senha
2. POST para `/api/auth/login`
3. Recebe JWT token
4. Armazena token no localStorage/sessionStorage
5. Inclui token em todas as requisições: `Authorization: Bearer token`

### Recuperação de Senha
1. Usuário clica em "Esqueci minha senha"
2. POST para `/api/auth/forgot-password` com email
3. Email é enviado com link de reset
4. Usuário clica no link e é redirecionado para página de reset
5. POST para `/api/auth/reset-password` com nova senha
6. Pode fazer login com a nova senha

---

## Códigos de Erro

| Código | Significado |
|--------|------------|
| 400 | Requisição inválida (campos faltando, senhas não conferem, etc) |
| 401 | Não autenticado ou credenciais inválidas |
| 403 | Email não verificado |
| 404 | Usuário não encontrado |
| 423 | Conta bloqueada (muitas tentativas de login) |
| 500 | Erro do servidor |

---

## Modelo de Dados do Usuário

```javascript
{
  _id: ObjectId,
  googleId: String, // Opcional, apenas para Google OAuth
  name: String,
  email: String,
  password: String, // Hash bcrypt
  photo: String,
  isEmailVerified: Boolean,
  emailVerificationToken: String, // Hash do token
  emailVerificationTokenExpires: Date,
  passwordResetToken: String, // Hash do token
  passwordResetTokenExpires: Date,
  lastLogin: Date,
  loginAttempts: Number,
  lockUntil: Date, // Quando a conta foi bloqueada
  createdAt: Date,
  updatedAt: Date
}
```

