# 📧 Configuração de Email - Resend

## ✅ O que foi corrigido

- ❌ **REMOVIDO**: Nodemailer + Mailtrap (causava timeout em produção)
- ✅ **ADICIONADO**: Resend (API moderna, gratuita e confiável)

## 🚀 Como configurar no Render.com

### 1. Criar conta no Resend (GRATUITO)

1. Acesse: https://resend.com/signup
2. Crie uma conta gratuita
3. Confirme seu email

### 2. Gerar API Key

1. Acesse: https://resend.com/api-keys
2. Clique em **"Create API Key"**
3. Nome: `FlowDuo Production`
4. Permissão: **"Sending access"**
5. Clique em **"Create"**
6. **COPIE a chave** (começa com `re_...`)
7. ⚠️ **Guarde em local seguro** - só aparece uma vez!

### 3. Configurar no Render Dashboard

1. Acesse seu projeto no Render
2. Vá em **"Environment"** → **"Environment Variables"**
3. Adicione a variável:
   ```
   RESEND_API_KEY=re_sua_chave_aqui
   ```
4. Adicione também (se não existir):
   ```
   EMAIL_FROM=FlowDuo <onboarding@resend.dev>
   FRONTEND_URL=https://aplicativo-kambam-tarefas.vercel.app
   ```
5. Clique em **"Save Changes"**

### 4. Fazer Deploy

O Render vai automaticamente:
- Instalar `resend@^3.0.0`
- Usar a nova configuração
- Emails funcionarão sem timeout!

## 📊 Limitações do Plano Gratuito

- ✅ **3.000 emails/mês**
- ✅ **100 emails/dia**
- ✅ Email remetente: `onboarding@resend.dev`
- ✅ Sem timeout
- ✅ Entrega garantida

## 🎯 Para usar domínio próprio (Opcional)

Se quiser enviar de `noreply@flowduo.com.br`:

1. Adicione seu domínio no Resend: https://resend.com/domains
2. Configure os registros DNS que eles fornecerem
3. Aguarde verificação (1-24h)
4. Atualize `EMAIL_FROM=FlowDuo <noreply@flowduo.com.br>`

## 🧪 Testar localmente

```bash
cd backend
npm install
# Adicione RESEND_API_KEY no seu .env local
npm run dev
```

## 📝 Logs de Debug

O sistema agora exibe logs detalhados:
- ✅ Configuração do Resend
- ✅ Email enviado com sucesso (com ID da mensagem)
- ❌ Erros com mensagens claras

## ⚠️ Importante

- Nunca commite a API Key no Git
- Use apenas variáveis de ambiente
- O `.env.render` é apenas um template

## 🆘 Suporte

- Documentação: https://resend.com/docs
- Status: https://resend.com/status
- Suporte: support@resend.com
