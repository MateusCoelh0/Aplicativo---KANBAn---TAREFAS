# ⚡ COMECE AQUI - Primeiros Passos

## 🎯 Você tem 5 minutos? Siga isto:

### ⏱️ 1 minuto - Configurar Email

Abra o arquivo `backend/.env` e procure por:

```env
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=seu_usuario_mailtrap
EMAIL_PASSWORD=sua_senha_mailtrap
```

**Como obter credenciais:**
1. Acesse https://mailtrap.io
2. Crie conta grátis (clique em "Sign up")
3. Confirme seu email
4. Vá em "Email Testing" → "My Inbox"
5. Clique em "Show Credentials"
6. Copie as 4 credenciais SMTP (Host, Port, Username, Password)
7. Cole no seu `backend/.env`

---

### ⏱️ 2 minutos - Iniciar Servidores

**Terminal 1** (Backend):
```bash
cd backend
npm install    # Só primeira vez
npm run dev
# Você verá: 🚀 Servidor rodando em http://localhost:5000
```

**Terminal 2** (Frontend):
```bash
npm install    # Só primeira vez
npm run dev
# Você verá: 🚀 Local: http://localhost:5173
```

---

### ⏱️ 2 minutos - Testar

Abra seu navegador e:

#### 1. Registre uma Conta
```
URL: http://localhost:5173/register

Preencha:
- Nome: Teste
- Email: seu_email@exemplo.com
- Senha: 123456
- Confirmar: 123456

Clique "Registrar"
```

**Esperado**: Mensagem dizendo "Verifique seu email"

#### 2. Verifique o Email
```
1. Abra https://mailtrap.io em outra aba
2. Você verá um email na caixa de entrada
3. Procure pelo link azul "Verificar Email" ou copie o token
4. Cole o link no navegador
```

**Esperado**: "Email verificado com sucesso!"

#### 3. Faça Login
```
URL: http://localhost:5173/login

Preencha:
- Email: seu_email@exemplo.com
- Senha: 123456

Clique "Fazer Login"
```

**Esperado**: Redirecionado para dashboard

---

## ✅ Pronto!

Se você conseguiu fazer isso, **seu sistema de autenticação está 100% funcional!** 🎉

---

## 📚 O Que Vem Depois?

Agora você pode:

1. **Testar Mais Cenários**
   - Reset de senha
   - Email não verificado
   - Senha errada
   - Login com Google

   👉 Veja: [TESTE_RAPIDO_5MIN.md](TESTE_RAPIDO_5MIN.md)

2. **Aprender Como Funciona**
   - Backend
   - Frontend
   - Segurança

   👉 Veja: [ALTERACOES_REALIZADAS_AUTENTICACAO.md](ALTERACOES_REALIZADAS_AUTENTICACAO.md)

3. **Ler Documentação Completa**
   - Endpoints da API
   - Troubleshooting
   - Próximas melhorias

   👉 Veja: [GUIA_AUTENTICACAO_COMPLETO.md](GUIA_AUTENTICACAO_COMPLETO.md)

4. **Preparar para Produção**
   - Configurar SendGrid ou Gmail
   - Configurar HTTPS
   - Deploy

   👉 Veja: [SETUP_AUTENTICACAO.md](SETUP_AUTENTICACAO.md)

---

## 🆘 Algo Deu Errado?

### "Email não está chegando"
```
1. Verifique se backend está rodando
2. Confirme credenciais do Mailtrap em backend/.env
3. Vá em https://mailtrap.io e veja a caixa de entrada
4. Procure por erros nos logs do backend
```

### "Connection refused"
```
1. Certifique-se que backend rodando: npm run dev
2. Certifique-se que frontend rodando: npm run dev
3. Verifique portas 5000 e 5173
```

### "Token inválido"
```
Tokens expiram em:
- Verificação: 24 horas
- Reset: 1 hora

Gere um novo se expirado
```

### "Conta bloqueada"
```
Após 5 tentativas erradas = 30 minutos bloqueada
Ou faça reset de senha para desbloquear
```

---

## 🔑 URLs Importantes

```
📱 Frontend:
  http://localhost:5173/login       ← Login
  http://localhost:5173/register    ← Registrar
  http://localhost:5173/dashboard   ← Protegido

🔌 Backend:
  http://localhost:5000/api/health  ← Teste servidor

📧 Email:
  https://mailtrap.io               ← Ver emails
```

---

## 📞 Próximas Dúvidas?

- **Quero entender o código** → [ALTERACOES_REALIZADAS_AUTENTICACAO.md](ALTERACOES_REALIZADAS_AUTENTICACAO.md)
- **Quero testar mais** → [TESTE_RAPIDO_5MIN.md](TESTE_RAPIDO_5MIN.md)
- **Preciso de documentação completa** → [GUIA_AUTENTICACAO_COMPLETO.md](GUIA_AUTENTICACAO_COMPLETO.md)
- **Tenho dúvidas gerais** → [README_AUTENTICACAO.md](README_AUTENTICACAO.md)

---

## ✨ Parabéns!

Você acabou de implementar um sistema de autenticação **seguro e profissional** em **5 minutos**! 🚀

**Próximo passo**: Estudar a documentação ou começar a conectar suas funcionalidades.

---

💡 **Dica**: Abra 3 janelas do VS Code:
1. Uma para `backend/.env`
2. Uma para seu código
3. Uma para seus testes

---

Bom trabalho! 🎉

*Última atualização: 29 de dezembro de 2024*
