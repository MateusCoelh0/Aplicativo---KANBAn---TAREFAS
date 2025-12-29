import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { authService } from '../../src/services/authService';
import '../../src/styles/auth.css';

export default function LoginForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showResendEmail, setShowResendEmail] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Remover erro deste campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setShowResendEmail(false);
    setResendMessage('');

    const result = await authService.login(formData.email, formData.password);

    if (result.success) {
      // Redirecionar para dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } else {
      setErrorMessage(`❌ ${result.message}`);
      
      // Se o erro for de email não verificado, mostrar opção de reenviar
      if (result.message.includes('Verifique seu email') || result.message.includes('verificar')) {
        setShowResendEmail(true);
      }
    }

    setLoading(false);
  };

  const handleResendEmail = async () => {
    setResendLoading(true);
    setResendMessage('');

    const result = await authService.resendVerification(formData.email);

    if (result.success) {
      setResendMessage('✅ ' + result.message);
      setShowResendEmail(false);
    } else {
      setResendMessage('❌ ' + result.message);
    }

    setResendLoading(false);
  };

  const handleGoogleLogin = () => {
    const backendUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 
      'http://localhost:5000';
    window.location.href = `${backendUrl}/api/auth/google`;
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Logo FlowDuo */}
        <div className="logo-container">
          <svg 
            className="logo-svg" 
            viewBox="0 0 200 80" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* F */}
            <path d="M 20 20 L 20 60 M 20 20 L 45 20 M 20 40 L 42 40" 
                  stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" fill="none"/>
            
            {/* Círculo do O com efeito de fluxo */}
            <circle cx="65" cy="40" r="15" 
                    stroke="#3b82f6" strokeWidth="4" fill="none"/>
            <circle cx="65" cy="40" r="8" 
                    fill="#3b82f6" opacity="0.3"/>
            
            {/* Setas de fluxo */}
            <path d="M 85 35 L 95 40 L 85 45" 
                  stroke="#3b82f6" strokeWidth="3" fill="none" strokeLinecap="round"/>
            <path d="M 90 40 L 105 40" 
                  stroke="#3b82f6" strokeWidth="3" strokeLinecap="round"/>
            
            {/* D */}
            <path d="M 115 20 L 115 60 M 115 20 Q 145 20 145 40 Q 145 60 115 60" 
                  stroke="#8b5cf6" strokeWidth="4" strokeLinecap="round" fill="none"/>
            
            {/* U com duplo traço */}
            <path d="M 155 20 L 155 45 Q 155 60 170 60 Q 185 60 185 45 L 185 20" 
                  stroke="#8b5cf6" strokeWidth="4" strokeLinecap="round" fill="none"/>
            <path d="M 157 35 L 157 45 Q 157 55 170 55 Q 183 55 183 45 L 183 35" 
                  stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5"/>
          </svg>
          <h1 className="logo-text">FlowDuo</h1>
        </div>
        
        <p className="auth-subtitle">Seja bem vindo ao FlowDuo seu agendador de tarefas</p>
        <center><h2>Fazer Login</h2></center>
        

        {errorMessage && (
          <div className="auth-error">
            {errorMessage}
            {showResendEmail && (
              <button
                type="button"
                onClick={handleResendEmail}
                disabled={resendLoading}
                className="resend-email-button"
              >
                {resendLoading ? '📧 Enviando...' : '📧 Reenviar email de verificação'}
              </button>
            )}
          </div>
        )}

        {resendMessage && (
          <div className={resendMessage.includes('✅') ? 'auth-success' : 'auth-error'}>
            {resendMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha *</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Sua senha"
                className={errors.password ? 'input-error' : ''}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Mostrar/ocultar senha"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <a href="/forgot-password" className="forgot-password-link">
            Esqueceu sua senha?
          </a>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Entrando...' : 'Fazer Login'}
          </button>
        </form>

        <div className="auth-divider">
          <span>ou</span>
        </div>

        <button onClick={handleGoogleLogin} className="google-button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Entrar com Google
        </button>

        <p className="auth-link">
          Não tem conta? <a href="/register">Registre-se aqui</a>
        </p>
        
        <div className="auth-footer">
          <div className="flex items-center justify-center gap-3">
            <span className="text-sm text-slate-600">
              Desenvolvido por <span className="font-semibold">Mateus Coelho</span>
            </span>
            <span className="text-slate-300">|</span>
            <a
              href="https://www.linkedin.com/in/mateus-afranio-8302731b5"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
              aria-label="LinkedIn de Mateus Coelho"
            >
              <svg
                className="h-4 w-4"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span className="text-sm font-medium">LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
