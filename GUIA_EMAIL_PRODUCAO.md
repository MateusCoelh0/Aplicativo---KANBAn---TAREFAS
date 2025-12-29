# 📧 Guia de Configuração de Email - Desenvolvimento e Produção

## 🧪 DESENVOLVIMENTO - Mailtrap (AGORA)

### Passo 1: Criar conta no Mailtrap
1. Acesse: https://mailtrap.io
2. Crie uma conta gratuita
3. Confirme seu email

### Passo 2: Obter credenciais
1. Vá em **Email Testing** > **Inboxes**
2. Selecione **My Inbox** (ou crie um novo)
3. Na aba **SMTP Settings**, clique em **Show Credentials**
4. Copie os valores:
   - **Username** (ex: a1b2c3d4e5f6g7)
   - **Password** (ex: 1234567890abcd)

### Passo 3: Configurar no projeto
Abra o arquivo `backend/.env` e substitua:

```env
EMAIL_USER=SEU_USERNAME_MAILTRAP_AQUI
EMAIL_PASSWORD=SEU_PASSWORD_MAILTRAP_AQUI
```

### Passo 4: Testar
1. Reinicie o servidor backend
2. Crie uma nova conta no app
3. Acesse https://mailtrap.io/inboxes
4. Veja o email de verificação recebido!

---

## 🚀 PRODUÇÃO - Opções para Escalar

### Opção 1: SendGrid (⭐ RECOMENDADO)

**Vantagens:**
- ✅ 100 emails/dia GRÁTIS para sempre
- ✅ Fácil de configurar
- ✅ Excelente entregabilidade
- ✅ Dashboard com analytics
- ✅ Escala até 40.000 emails/mês no plano grátis (primeiro mês)

**Preço:**
- Grátis: 100 emails/dia
- Essentials: $19.95/mês (50.000 emails)
- Pro: $89.95/mês (1.5 milhão emails)

**Configuração:**
```env
NODE_ENV=production
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxx
EMAIL_FROM=noreply@seudominio.com
```

**Como obter:**
1. Cadastre-se em: https://sendgrid.com
2. Vá em Settings > API Keys
3. Crie uma nova API Key
4. Copie e cole no .env

---

### Opção 2: AWS SES (💰 MAIS BARATO EM ESCALA)

**Vantagens:**
- ✅ $0.10 por 1.000 emails (super barato!)
- ✅ 62.000 emails/mês GRÁTIS (se hospedar na AWS)
- ✅ Infraestrutura da Amazon
- ✅ Alta escalabilidade

**Preço:**
- Dentro da AWS EC2: 62.000 emails/mês grátis
- Fora da AWS: $0.10 por 1.000 emails
- Sem limite máximo

**Configuração:**
```env
NODE_ENV=production
EMAIL_SERVICE=ses
SES_HOST=email-smtp.us-east-1.amazonaws.com
SES_USER=AKIAXXXXXXXXXXXXXXXX
SES_PASSWORD=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@seudominio.com
```

**Melhor para:**
- Apps com MUITO volume de emails
- Já hospeda na AWS
- Precisa de preço baixo em escala

---

### Opção 3: Mailgun

**Vantagens:**
- ✅ 5.000 emails/mês grátis (3 meses)
- ✅ API simples
- ✅ Boa para desenvolvedores

**Preço:**
- Trial: 5.000 emails grátis (3 meses)
- Foundation: $35/mês (50.000 emails)
- Growth: $80/mês (100.000 emails)

---

### Opção 4: Postmark (📬 MELHOR ENTREGABILIDADE)

**Vantagens:**
- ✅ 100 emails/mês grátis
- ✅ Melhor taxa de entrega (98%+)
- ✅ Foco em emails transacionais
- ✅ Suporte excelente

**Preço:**
- 100 emails/mês grátis
- $15/mês por 10.000 emails
- $1.25 por 1.000 emails adicionais

---

## 🎯 Qual Escolher?

| Cenário | Recomendação |
|---------|-------------|
| **Começando / Teste** | Mailtrap (dev) + SendGrid (prod) |
| **Startup pequena** | SendGrid (100 emails/dia grátis) |
| **Médio volume (10k-100k/mês)** | SendGrid ou Mailgun |
| **Alto volume (100k+/mês)** | AWS SES |
| **Máxima entregabilidade** | Postmark |
| **Já usa AWS** | AWS SES |

---

## 📝 Checklist para Produção

Antes de lançar, certifique-se:

- [ ] Configurou domínio próprio (ex: noreply@seuapp.com)
- [ ] Configurou SPF, DKIM e DMARC no DNS
- [ ] Verificou o domínio no serviço de email escolhido
- [ ] Testou envio de emails em produção
- [ ] Configurou rate limiting para evitar spam
- [ ] Adicionou opção de "Descadastrar" nos emails
- [ ] Monitorou taxa de entrega e bounces
- [ ] Configurou alertas para falhas de envio

---

## 🔧 Mudando de Mailtrap para Produção

Quando estiver pronto para produção:

1. Escolha o serviço (ex: SendGrid)
2. Crie a conta e obtenha as credenciais
3. Atualize o `.env` de produção:
   ```env
   NODE_ENV=production
   EMAIL_SERVICE=sendgrid
   SENDGRID_API_KEY=sua_chave_aqui
   ```
4. Faça o deploy
5. Teste com um email real!

**Pronto! Seu sistema de emails estará funcionando perfeitamente! 📧✨**
