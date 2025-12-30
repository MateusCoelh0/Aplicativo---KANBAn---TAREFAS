// Detecta automaticamente se está em desenvolvimento ou produção
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const API_BASE_URL = isDevelopment 
  ? 'http://localhost:5000/api'  // Desenvolvimento local
  : import.meta.env.VITE_API_URL || 'https://flowduo-backend.onrender.com/api'; // Produção

console.log('🌐 Ambiente:', isDevelopment ? 'Desenvolvimento' : 'Produção');
console.log('🔗 API URL:', API_BASE_URL);

export default API_BASE_URL;
