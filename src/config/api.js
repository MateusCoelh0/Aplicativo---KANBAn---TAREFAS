// Detecta automaticamente se está em desenvolvimento ou produção
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const API_BASE_URL = isDevelopment 
  ? 'http://localhost:5000/api'  // Desenvolvimento local
  : 'https://flowduo-backend.onrender.com/api'; // Produção

// Logs detalhados para debug
console.log('🌐 Hostname atual:', window.location.hostname);
console.log('🔧 Ambiente:', isDevelopment ? 'Desenvolvimento' : 'Produção');
console.log('🔗 API URL:', API_BASE_URL);
console.log('📍 URL completa:', window.location.href);

export default API_BASE_URL;
