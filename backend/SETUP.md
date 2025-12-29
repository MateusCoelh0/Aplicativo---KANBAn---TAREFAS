# 🔐 Configuração Google OAuth - KAMBAM Backend

## Passo 1: Criar Credenciais Google

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Clique em "Novo Projeto"
3. Escolha um nome (ex: "KAMBAM App")
4. Vá para **APIs e Serviços** → **Credenciais**
5. Clique em **Criar Credenciais** → **ID do Cliente OAuth 2.0**
6. Selecione **Aplicação Web**

## Passo 2: Configurar URLs de Redirecionamento

**URIs JavaScript Autorizadas:**
```
http://localhost:5173
http://localhost:3000
http://localhost:5000
```

**URIs de Redirecionamento Autorizadas:**
```
http://localhost:5000/api/auth/google/callback
```

## Passo 3: Copiar Credenciais

Após criar, você receberá:
- **Client ID**
- **Client Secret**

## Passo 4: Configurar .env

No arquivo `.env` da pasta `backend/`, adicione:

```
GOOGLE_CLIENT_ID=seu_client_id_aqui
GOOGLE_CLIENT_SECRET=seu_client_secret_aqui
```

## Passo 5: MongoDB

### Opção A: MongoDB Local (Recomendado para desenvolvimento)

Instale [MongoDB Community Edition](https://www.mongodb.com/try/download/community)

Depois, MongoDB estará rodando em: `mongodb://localhost:27017`

A variável .env está configurada como:
```
MONGODB_URI=mongodb://localhost:27017/kambam
```

### Opção B: MongoDB Atlas (Cloud)

1. Acesse [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crie um cluster gratuito
3. Configure um usuário e senha
4. Copie a connection string
5. Atualize `.env`:
```
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/kambam
```

## Passo 6: Rodar o Backend

```bash
cd backend
npm run dev
```

Você verá:
```
✅ MongoDB conectado com sucesso!
🚀 Servidor rodando em http://localhost:5000
```

## Testando a Autenticação

Acesse no navegador:
```
http://localhost:5000/api/auth/google
```

Você será redirecionado para o login do Google e depois para o frontend com um token JWT.

---

### Portas

- **Frontend (Vite)**: http://localhost:5173
- **Backend (Express)**: http://localhost:5000
- **MongoDB**: localhost:27017

### Variáveis de Ambiente Completas

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/kambam

# Google OAuth
GOOGLE_CLIENT_ID=seu_google_client_id_aqui
GOOGLE_CLIENT_SECRET=seu_google_client_secret_aqui
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# JWT
JWT_SECRET=sua_chave_jwt_muito_secreta_aqui_12345

# Environment
NODE_ENV=development
PORT=5000

# Frontend URL
FRONTEND_URL=http://localhost:5173
```
