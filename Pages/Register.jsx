import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../Components/auth/RegisterForm';
import { authService } from '../src/services/authService';

export default function Register() {
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se já está logado
    const token = authService.getToken();
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return <RegisterForm />;
}
