import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoginForm from '../Components/auth/LoginForm';
import { authService } from '../src/services/authService';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Verificar se já está logado
    const token = authService.getToken();
    if (token) {
      navigate('/dashboard');
      return;
    }

    // Processar callback do Google OAuth
    const tokenFromUrl = searchParams.get('token');
    const userFromUrl = searchParams.get('user');

    if (tokenFromUrl) {
      localStorage.setItem('token', tokenFromUrl);
      if (userFromUrl) {
        try {
          const userData = JSON.parse(userFromUrl);
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (e) {
          console.error('Erro ao parsear dados do usuário:', e);
        }
      }
      navigate('/dashboard');
    }
  }, [navigate, searchParams]);

  return <LoginForm />;
}
