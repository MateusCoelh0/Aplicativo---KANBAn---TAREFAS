import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// 🔍 Debug: Verificar URL params ao carregar
console.log('=== KAMBAM DEBUG ===');
console.log('URL:', window.location.href);
console.log('Params:', window.location.search);

// Se há params de autenticação, logar
const params = new URLSearchParams(window.location.search);
if (params.has('token')) {
  console.log('✅ Token recebido na URL');
  const token = params.get('token');
  const user = params.get('user');
  console.log('Token:', token.substring(0, 30) + '...');
  console.log('User:', user?.substring(0, 50) + '...');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
