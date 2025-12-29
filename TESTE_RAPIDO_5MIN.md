# 🚀 TESTE RÁPIDO - 5 MINUTOS

## ⚡ Pré-Requisitos
- [ ] Node.js instalado
- [ ] MongoDB rodando (local ou Atlas)
- [ ] Conta Mailtrap (grátis em https://mailtrap.io)

---

## 🔧 Setup (2 minutos)

### Passo 1: Configurar Mailtrap
```bash
# 1. Acesse https://mailtrap.io e crie conta
# 2. Vá em "Email Testing" → "My Inbox"
# 3. Copie as 4 credenciais SMTP
```

### Passo 2: Atualizar `.env`
```bash
# backend/.env
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=seu_usuario  # copie do Mailtrap
EMAIL_PASSWORD=sua_senha  # copie do Mailtrap
```

### Passo 3: Instalar e Iniciar
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev
# 🚀 Servidor em http://localhost:5000

# Terminal 2 - Frontend (nova janela)
npm install  
npm run dev
# 🚀 App em http://localhost:5173
```

---

## ✅ Testes (3 minutos)

### Teste 1: Registrar
```
1. Abra http://localhost:5173/register
2. Preencha:
   Nome: TestUser
   Email: teste@exemplo.com
   Senha: 123456
   Confirmar: 123456
3. Clique "Registrar"
4. ✅ Deve aparecer: "Conta criada! Verifique seu email"
```

### Teste 2: Verificar Email
```
1. Abra https://mailtrap.io (na outra aba)
2. Você verá um email novo
3. Copie o link "Verificar Email" ou o token
4. Cole a URL no navegador
5. ✅ Deve aparecer: "Email verificado com sucesso!"
```

### Teste 3: Login
```
1. Abra http://localhost:5173/login
2. Preencha:
   Email: teste@exemplo.com
   Senha: 123456
3. Clique "Fazer Login"
4. ✅ Será redirecionado para /dashboard
```

### Teste 4: Logout (se houver botão)
```
1. No dashboard, procure botão de logout
2. Clique
3. ✅ Será redirecionado para login
```

---

## 🎯 Cenários Adicionais (Opcionais)

### Teste: Email Não Verificado
```
1. Registre novamente com outro email
2. NÃO verifique o email
3. Tente fazer login
4. ✅ Será bloqueado: "Verifique seu email antes de fazer login"
```

### Teste: Senha Errada
```
1. Login com email correto
2. Senha errada: wrongpassword
3. ✅ Erro: "Email ou senha inválidos"
```

### Teste: Reset de Senha
```
1. Na página login, clique "Esqueceu sua senha?"
2. Digite o email registrado
3. ✅ Email será enviado (veja em Mailtrap)
4. Clique no link do email
5. Digite nova senha: novaSenha123456
6. Confirme
7. Clique "Redefinir Senha"
8. ✅ Mensagem: "Senha redefinida com sucesso!"
9. Faça login com a nova senha
```

---

## 🎉 Se Tudo Funcionou!

Parabéns! Seu sistema de autenticação está **100% FUNCIONAL** ✅

**Próximos passos**:
1. Conectar usuário às tarefas
2. Implementar dashboard
3. Adicionar mais OAuth (GitHub, etc)
4. Preparar para produção

---

## 🐛 Erro? Aqui está a Solução:

| Problema | Solução |
|----------|---------|
| Email não chega | Verificar credenciais Mailtrap em `.env` |
| "Connection refused" | Certifique-se que backend rodando em :5000 |
| "Verifique seu email" | Você se registrou mas não verificou |
| "Conta bloqueada" | Aguarde 30 min ou faça reset |
| CORS error | Checar `FRONTEND_URL` em `backend/.env` |

---

## 📱 Resumo das URLs

```
🌐 Frontend:
   http://localhost:5173/login       ← Fazer Login
   http://localhost:5173/register    ← Criar Conta
   http://localhost:5173/dashboard   ← Área Protegida

🔌 Backend:
   http://localhost:5000/api/health  ← Testar servidor
   POST /api/auth/login             ← Login
   POST /api/auth/register          ← Registrar
   POST /api/auth/verify-email      ← Verificar
```

---

## 📧 Credenciais de Teste

```
Email: teste@exemplo.com (ou seu_email@seu_dominio.com)
Senha: 123456 (mínimo 6 caracteres)
```

---

Está pronto! Bom teste! 🚀

*Para detalhes completos, veja `GUIA_AUTENTICACAO_COMPLETO.md`*
