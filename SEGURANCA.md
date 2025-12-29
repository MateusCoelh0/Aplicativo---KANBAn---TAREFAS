# 🔒 Checklist de Segurança - Deploy

## ⚠️ ANTES DE FAZER DEPLOY

### 1. Verificar Arquivos Sensíveis

- [ ] ✅ `.env` está no `.gitignore`
- [ ] ✅ `backend/.env` está no `.gitignore`
- [ ] ✅ `client_secret_*.json` está no `.gitignore`
- [ ] ✅ `node_modules/` está no `.gitignore`
- [ ] ⚠️ **NUNCA** commite arquivos `.env` no Git

### 2. Validar Credenciais

- [ ] JWT_SECRET tem no mínimo 32 caracteres aleatórios
- [ ] MongoDB password é forte (min 12 caracteres, letras, números, símbolos)
- [ ] Google Client Secret não está exposto
- [ ] Email password (SendGrid API Key) está seguro

### 3. Verificar Variáveis de Ambiente

- [ ] `NODE_ENV=production` no backend de produção
- [ ] `FRONTEND_URL` aponta para domínio correto
- [ ] `GOOGLE_CALLBACK_URL` usa HTTPS (não HTTP)
- [ ] `MONGODB_URI` usa credenciais de produção (não desenvolvimento)

---

## 🔐 Boas Práticas Implementadas

### ✅ Autenticação
- [x] Senhas hasheadas com bcrypt (12 rounds)
- [x] JWT tokens com expiração (7 dias)
- [x] Tokens de verificação de email expiram (24 horas)
- [x] Tokens de reset de senha expiram (1 hora)
- [x] HTTP-only cookies para sessões

### ✅ Banco de Dados
- [x] MongoDB com autenticação obrigatória
- [x] Validações no Schema (Mongoose)
- [x] Índices para performance
- [x] Timestamps automáticos

### ✅ API
- [x] CORS configurado corretamente
- [x] Rate limiting (recomendado adicionar)
- [x] Validação de entrada
- [x] Tratamento de erros
- [x] HTTPS obrigatório em produção

### ✅ Frontend
- [x] Tokens armazenados no localStorage (não em cookies visíveis)
- [x] Validação de formulários client-side
- [x] Sanitização de inputs
- [x] Redirecionamento automático se não autenticado

---

## 🚨 Ações de Segurança Adicionais (Recomendadas)

### Para Produção Avançada

#### 1. Adicionar Rate Limiting
No `backend/server.js`:
```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // limite de 100 requisições por IP
});

app.use('/api/', limiter);
```

#### 2. Helmet.js (Proteção de Headers)
```javascript
import helmet from 'helmet';
app.use(helmet());
```

#### 3. Validação com Express Validator
```javascript
import { body, validationResult } from 'express-validator';

router.post('/register',
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // ... resto do código
  }
);
```

#### 4. Monitoramento
- Configure logs com Winston
- Use Sentry para tracking de erros
- Configure alertas no Railway/Vercel

---

## 📋 Checklist de Deploy Final

### Antes de Publicar

- [ ] Código testado localmente
- [ ] Build de produção funciona (`npm run build`)
- [ ] Todas as variáveis de ambiente configuradas
- [ ] Google OAuth atualizado para URLs de produção
- [ ] MongoDB Atlas configurado e acessível
- [ ] Email service testado e funcionando

### Após Deploy

- [ ] Teste registro de nova conta
- [ ] Teste login com email/senha
- [ ] Teste login com Google
- [ ] Teste recuperação de senha
- [ ] Teste criação de tarefas
- [ ] Teste drag-and-drop
- [ ] Teste criação de notas
- [ ] Verifique logs de erro no console

### Segurança Contínua

- [ ] Monitore logs regularmente
- [ ] Atualize dependências mensalmente (`npm audit`)
- [ ] Faça backup do banco de dados
- [ ] Revise acessos e permissões
- [ ] Mantenha documentação atualizada

---

## 🔑 Gerando Senhas Seguras

### JWT_SECRET (32+ caracteres)
```javascript
// Node.js
const crypto = require('crypto');
console.log(crypto.randomBytes(32).toString('hex'));
```

```bash
# PowerShell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

### MongoDB Password
Use um gerador de senhas como:
- 1Password
- LastPass
- Bitwarden
- ou: https://passwordsgenerator.net/

Mínimo recomendado:
- 12 caracteres
- Letras maiúsculas e minúsculas
- Números
- Símbolos especiais

---

## 🚫 O QUE NUNCA FAZER

### ❌ NUNCA:
1. Commitar arquivos `.env` no Git
2. Expor credenciais em logs
3. Usar senhas fracas ou padrões
4. Deixar MongoDB sem senha
5. Usar HTTP em produção (sempre HTTPS)
6. Compartilhar API keys publicamente
7. Confiar em validações apenas no frontend
8. Armazenar senhas em texto plano
9. Usar `console.log()` com dados sensíveis em produção
10. Ignorar avisos de segurança do `npm audit`

---

## 📞 Em Caso de Incidente de Segurança

### Se credenciais forem expostas:

1. **Imediatamente:**
   - Revogue todos os tokens JWT
   - Mude todas as senhas
   - Revogue API keys (SendGrid, Google)
   - Rotacione credenciais do MongoDB

2. **Ações:**
   - Force logout de todos os usuários
   - Notifique usuários sobre mudança de senha
   - Investigue origem do vazamento
   - Atualize `.gitignore` se necessário

3. **Prevenção:**
   - Use git-secrets ou similar
   - Configure pre-commit hooks
   - Revise PRs cuidadosamente

---

## ✅ Status de Segurança

### Atual
- [x] Autenticação implementada
- [x] Senhas hasheadas
- [x] JWT com expiração
- [x] CORS configurado
- [x] HTTPS em produção (Railway/Vercel)
- [x] Variáveis de ambiente isoladas

### Melhorias Futuras (Opcional)
- [ ] Rate limiting
- [ ] Helmet.js
- [ ] 2FA (autenticação de dois fatores)
- [ ] Logs centralizados
- [ ] Monitoramento de intrusão

---

## 📚 Recursos Adicionais

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

**⚠️ Lembre-se: Segurança é um processo contínuo, não um estado final!**

Revise este checklist regularmente e mantenha-se atualizado com as melhores práticas.

**Desenvolvido por Mateus Coelho**
