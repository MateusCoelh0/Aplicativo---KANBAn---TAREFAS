# 📦 Checklist de Preparação para Deploy

## ✅ Arquivos Criados

- [x] `.gitignore` - Atualizado para proteger dados sensíveis
- [x] `backend/.env.example` - Template de variáveis de ambiente
- [x] `.env.example` - Variáveis do frontend
- [x] `GUIA_DEPLOY.md` - Guia completo e detalhado
- [x] `DEPLOY_RAPIDO.md` - Passo a passo rápido (15 min)
- [x] `src/config/api.js` - Configuração dinâmica de API
- [x] `Procfile` - Para deploy no Heroku (alternativa)
- [x] `railway.json` - Configuração do Railway

## ✅ Código Atualizado

- [x] `src/services/api.js` - Usando configuração dinâmica
- [x] `Components/auth/LoginForm.jsx` - Google OAuth com URL dinâmica

## 📋 Próximos Passos

### 1. Teste Local
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
npm run dev
```

### 2. Criar Repositório no GitHub (se ainda não tiver)
```bash
git init
git add .
git commit -m "Preparação para deploy"
git branch -M main
git remote add origin https://github.com/seu-usuario/kambam.git
git push -u origin main
```

### 3. Deploy - Escolha o Guia

**Opção Rápida (15 min)**: Siga [DEPLOY_RAPIDO.md](DEPLOY_RAPIDO.md)
- MongoDB Atlas (5 min)
- Railway - Backend (5 min)
- Vercel - Frontend (3 min)
- Configurações finais (2 min)

**Opção Completa**: Siga [GUIA_DEPLOY.md](GUIA_DEPLOY.md)
- Explicações detalhadas
- Múltiplas opções de serviços
- Troubleshooting completo
- Dicas de monitoramento

## 🎯 Serviços Recomendados (100% Gratuitos)

| Serviço | Função | Plano Gratuito |
|---------|--------|----------------|
| **MongoDB Atlas** | Banco de Dados | 512MB |
| **Railway** | Backend (API) | 500h/mês |
| **Vercel** | Frontend | Unlimited |
| **SendGrid** | Email | 100 emails/dia |

**Total: R$ 0,00/mês** 🎉

## 📝 Variáveis de Ambiente Necessárias

### Backend (Railway)
```env
MONGODB_URI=mongodb+srv://...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=https://seu-backend.railway.app/api/auth/google/callback
JWT_SECRET=sua_chave_secreta_min_32_chars
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://kambam.vercel.app
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=sua_sendgrid_api_key
EMAIL_FROM=noreply@seu-email.com
```

### Frontend (Vercel)
```env
VITE_API_URL=https://seu-backend.railway.app/api
```

## 🔍 Verificação Final

Antes de fazer deploy, verifique:

- [ ] `.env` está no `.gitignore` (não será enviado ao GitHub)
- [ ] `client_secret_*.json` está no `.gitignore`
- [ ] `node_modules/` está no `.gitignore`
- [ ] Código está commitado no GitHub
- [ ] Backend roda localmente sem erros
- [ ] Frontend roda localmente sem erros
- [ ] Login funciona localmente
- [ ] Tarefas funcionam localmente
- [ ] Notas funcionam localmente

## 🚀 Comandos Úteis

### Build de Produção (teste local)
```bash
# Frontend
npm run build
npm run preview

# Backend (já está pronto)
cd backend
npm start
```

### Verificar se está tudo OK
```bash
# Verificar se há erros no código
npm run build

# Testar conexão com MongoDB
# (certifique-se de que o MongoDB está rodando)
```

## 📚 Documentação de Referência

- [MongoDB Atlas](https://www.mongodb.com/docs/atlas/)
- [Railway Docs](https://docs.railway.app/)
- [Vercel Docs](https://vercel.com/docs)
- [Vite Env Variables](https://vitejs.dev/guide/env-and-mode.html)

## 💡 Dicas Importantes

1. **Nunca commite arquivos .env** - Use sempre .env.example
2. **Use senhas fortes** - JWT_SECRET deve ter no mínimo 32 caracteres
3. **HTTPS automático** - Railway e Vercel já incluem SSL
4. **Deploy automático** - Cada push no GitHub dispara novo deploy
5. **Logs em tempo real** - Acesse o dashboard de cada serviço

## 🆘 Suporte

Se encontrar problemas:

1. Consulte [GUIA_DEPLOY.md](GUIA_DEPLOY.md) seção "Solução de Problemas"
2. Verifique os logs no Railway/Vercel
3. Teste as URLs diretamente no navegador
4. Verifique se todas as variáveis estão corretas

---

**Seu app está pronto para ir ao ar! 🚀**

Siga o [DEPLOY_RAPIDO.md](DEPLOY_RAPIDO.md) para colocar no ar em 15 minutos!

**Desenvolvido por Mateus Coelho**
