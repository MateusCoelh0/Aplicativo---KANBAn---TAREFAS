# 🚀 Deploy Rápido - Passo a Passo

## ⚡ Início Rápido (15 minutos)

### 1️⃣ MongoDB Atlas (5 min)
1. Acesse https://www.mongodb.com/cloud/atlas/register
2. Crie conta gratuita
3. "Create Cluster" → Free (M0)
4. Database Access → Add User → username: `flowduo_admin`
5. Network Access → Add IP → `0.0.0.0/0`
6. Clusters → Connect → "Connect your application"
7. Copie a connection string (guarde!)

### 2️⃣ Railway - Backend (5 min)
1. Acesse https://railway.app/
2. Login com GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Selecione seu repositório
5. **Configure as variáveis de ambiente**:
   - Vá em "Variables"
   - Adicione todas as variáveis do arquivo `.env.example`
   - **IMPORTANTE**: Use a connection string do MongoDB Atlas
6. Settings → Root Directory: `backend`
7. Settings → Start Command: `npm start`
8. Deploy!
9. Copie a URL (ex: `https://flowduo-production.up.railway.app`)

### 3️⃣ Vercel - Frontend (3 min)
1. Acesse https://vercel.com/
2. Login com GitHub
3. "Add New..." → "Project"
4. Selecione o repositório
5. Configure:
   - Framework: **Vite**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. **Environment Variable**:
   - Nome: `VITE_API_URL`
   - Valor: `https://SUA-URL-RAILWAY.railway.app/api`
7. Deploy!
8. Copie a URL (ex: `https://flowduo.vercel.app`)

### 4️⃣ Atualizar Google OAuth (2 min)
1. https://console.cloud.google.com/
2. APIs & Services → Credentials
3. Clique no seu OAuth Client ID
4. **Authorized JavaScript origins**:
   ```
   https://flowduo.vercel.app
   ```
5. **Authorized redirect URIs**:
   ```
   https://SUA-URL-RAILWAY.railway.app/api/auth/google/callback
   ```
6. Salve

### 5️⃣ Atualizar Variáveis no Railway
Volte no Railway e atualize:
- `FRONTEND_URL`: `https://flowduo.vercel.app`
- `GOOGLE_CALLBACK_URL`: `https://SUA-URL-RAILWAY.railway.app/api/auth/google/callback`

### 6️⃣ SendGrid - Email (Opcional - 2 min)
1. https://sendgrid.com/ → Criar conta
2. Settings → API Keys → Create
3. Copie a API Key
4. No Railway, atualize:
   ```
   EMAIL_HOST=smtp.sendgrid.net
   EMAIL_PORT=587
   EMAIL_USER=apikey
   EMAIL_PASSWORD=sua_api_key_aqui
   ```

---

## ✅ Checklist Rápido

- [ ] MongoDB Atlas criado
- [ ] Railway deployado com variáveis configuradas
- [ ] Vercel deployado
- [ ] Google OAuth atualizado
- [ ] Testar: criar conta, fazer login
- [ ] Testar: criar tarefa, arrastar
- [ ] Testar: criar nota

---

## 📱 URLs Finais

**Frontend**: https://flowduo.vercel.app
**Backend**: https://flowduo-production.up.railway.app
**Database**: MongoDB Atlas (cloud)

---

## 🆘 Problemas?

### Backend não inicia
- Verifique logs no Railway
- Confirme que todas as variáveis estão corretas
- Verifique connection string do MongoDB

### Frontend não conecta ao backend
- Verifique `VITE_API_URL` no Vercel
- Teste a URL do backend diretamente: `https://sua-url.railway.app/api`

### Login com Google não funciona
- Verifique URLs no Google Console
- Certifique-se que incluiu `/api/auth/google/callback`
- Limpe cache do navegador

---

## 💡 Dicas

1. **Logs em tempo real**: Railway → View Logs
2. **Redeploy**: Só fazer push no GitHub
3. **Domínio customizado**: Configure no Vercel (Settings → Domains)
4. **HTTPS**: Automático no Railway e Vercel!

---

**Pronto! Seu app está no ar! 🎉**

Compartilhe a URL do frontend com seus amigos!
