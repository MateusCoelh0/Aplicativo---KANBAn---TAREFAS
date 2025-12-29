// 🔍 DEBUG SCRIPT - Verificar autenticação

console.log('=== DEBUG AUTENTICAÇÃO ===');

// Verificar se há token no localStorage
const token = localStorage.getItem('token');
const user = localStorage.getItem('user');

console.log('Token no localStorage:', token ? '✅ SIM' : '❌ NÃO');
console.log('User no localStorage:', user ? '✅ SIM' : '❌ NÃO');

if (token) {
  console.log('Token:', token.substring(0, 20) + '...');
}

if (user) {
  try {
    const userData = JSON.parse(user);
    console.log('User Data:', userData);
  } catch (e) {
    console.log('User Data (raw):', user.substring(0, 50) + '...');
  }
}

// Verificar URL atual
console.log('URL atual:', window.location.href);
console.log('Search params:', window.location.search);

// Testar conexão com backend
fetch('http://localhost:5000/api/health')
  .then(res => res.json())
  .then(data => {
    console.log('✅ Backend respondendo:', data);
  })
  .catch(err => {
    console.log('❌ Backend não respondendo:', err.message);
  });

// Se há token, testar /api/auth/me
if (token) {
  fetch('http://localhost:5000/api/auth/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      console.log('✅ /api/auth/me respondendo:', data);
    })
    .catch(err => {
      console.log('❌ /api/auth/me erro:', err.message);
    });
}
