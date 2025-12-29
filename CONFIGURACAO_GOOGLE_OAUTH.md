# Configuração do Google OAuth

## Erro 400 - "A solicitação é inválida"

Este erro ocorre quando as credenciais do Google OAuth não estão configuradas corretamente.

## Passos para Configurar

### 1. Acessar o Google Cloud Console
- Acesse: https://console.cloud.google.com/
- Faça login com sua conta Google

### 2. Criar/Selecionar um Projeto
- Clique em "Select a project" no topo
- Clique em "NEW PROJECT"
- Nome do projeto: "Kambam" (ou outro nome)
- Clique em "CREATE"

### 3. Ativar a API do Google+
- No menu lateral, vá em "APIs & Services" > "Library"
- Procure por "Google+ API"
- Clique em "ENABLE"

### 4. Criar Credenciais OAuth 2.0
- Vá em "APIs & Services" > "Credentials"
- Clique em "CREATE CREDENTIALS" > "OAuth client ID"

#### 4.1 Configurar Tela de Consentimento (se necessário)
- Clique em "CONFIGURE CONSENT SCREEN"
- Selecione "External" (para testes)
- Clique em "CREATE"
- Preencha:
  - App name: Kambam
  - User support email: seu email
  - Developer contact: seu email
- Clique em "SAVE AND CONTINUE"
- Em "Scopes", clique em "SAVE AND CONTINUE"
- Em "Test users", adicione seu email de teste
- Clique em "SAVE AND CONTINUE"

#### 4.2 Criar OAuth Client ID
- Volte para "Credentials"
- Clique em "CREATE CREDENTIALS" > "OAuth client ID"
- Application type: "Web application"
- Name: "Kambam Web Client"
- Authorized JavaScript origins:
  - `http://localhost:5173`
  - `http://localhost:5000`
- Authorized redirect URIs:
  - `http://localhost:5000/api/auth/google/callback`
- Clique em "CREATE"

### 5. Copiar Credenciais
Após criar, você receberá:
- **Client ID**: algo como `280633114534-...apps.googleusercontent.com`
- **Client Secret**: algo como `GOCSPX-...`

### 6. Atualizar o arquivo .env
Abra o arquivo `backend/.env` e atualize:

```env
GOOGLE_CLIENT_ID=seu_client_id_completo_aqui
GOOGLE_CLIENT_SECRET=seu_client_secret_aqui
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

### 7. Reiniciar o Backend
Após atualizar o .env:
```bash
cd backend
npm start
```

## Verificação

1. Acesse: http://localhost:5173/login
2. Clique em "Entrar com Google"
3. Você será redirecionado para a tela de login do Google
4. Após fazer login, será redirecionado de volta para o aplicativo

## Problemas Comuns

### Erro 400: redirect_uri_mismatch
- **Causa**: A URL de callback não está configurada no Google Console
- **Solução**: Certifique-se de que `http://localhost:5000/api/auth/google/callback` está nas "Authorized redirect URIs"

### Erro 401: invalid_client
- **Causa**: Client ID ou Client Secret incorretos
- **Solução**: Verifique se copiou corretamente as credenciais do Google Console

### Erro 403: access_denied
- **Causa**: Usuário não está na lista de "Test users"
- **Solução**: Adicione o email do usuário em "OAuth consent screen" > "Test users"

## Configuração para Produção

Quando for colocar em produção:

1. Altere o modo do OAuth consent screen de "Testing" para "In production"
2. Atualize as URIs autorizadas com seus domínios reais:
   ```
   https://seu-dominio.com
   https://seu-dominio.com/api/auth/google/callback
   ```
3. Atualize o arquivo .env com as novas URLs

## Arquivo atual client_secret_*.json

O arquivo `client_secret_280633114534-dcnt1k9jqh4b3an8rlvjqc5cq86c6a22.apps.googleusercontent.com.json` contém suas credenciais.

Você pode abrir este arquivo e copiar:
- `client_id`
- `client_secret`
- Atualizar no `.env`

**⚠️ IMPORTANTE**: Nunca commite o arquivo .env ou client_secret no Git!
