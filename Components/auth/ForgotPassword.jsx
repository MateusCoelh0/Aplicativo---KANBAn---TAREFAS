import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authService } from '../../src/services/authService';
import '../../src/styles/auth.css';

export default function ForgotPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const resetToken = searchParams.get('token');

  const [step, setStep] = useState(resetToken ? 'reset' : 'request');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Etapa 1: Solicitar Reset
  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email inválido';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setMessage('');

    const result = await authService.forgotPassword(email);

    if (result.success) {
      setMessageType('success');
      setMessage('✅ Email enviado! Verifique sua caixa de entrada.');
      setEmail('');
      setErrors({});

      // Redirecionar para login após 3 segundos
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } else {
      setMessageType('error');
      setMessage(`❌ ${result.message}`);
    }

    setLoading(false);
  };

  // Etapa 2: Redefinir Senha
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas não conferem';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setMessage('');

    const result = await authService.resetPassword(resetToken, password, confirmPassword);

    if (result.success) {
      setMessageType('success');
      setMessage('✅ Senha redefinida com sucesso! Redirecionando para login...');
      setPassword('');
      setConfirmPassword('');
      setErrors({});

      // Redirecionar para login após 2 segundos
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setMessageType('error');
      setMessage(`❌ ${result.message}`);
    }

    setLoading(false);
  };

  const handleChange = (field, value) => {
    if (field === 'email') setEmail(value);
    if (field === 'password') setPassword(value);
    if (field === 'confirmPassword') setConfirmPassword(value);

    // Remover erro do campo
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {step === 'request' ? (
          <>
            <h2>Recuperar Senha</h2>
            <p className="auth-subtitle">
              Informe seu email para receber um link de reset
            </p>

            {message && (
              <div className={`auth-${messageType}`}>{message}</div>
            )}

            <form onSubmit={handleRequestSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="seu@email.com"
                  className={errors.email ? 'input-error' : ''}
                />
                {errors.email && (
                  <span className="error-text">{errors.email}</span>
                )}
              </div>

              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar Link de Reset'}
              </button>
            </form>

            <p className="auth-link">
              Lembrou sua senha? <a href="/login">Faça login aqui</a>
            </p>
          </>
        ) : (
          <>
            <h2>Redefinir Senha</h2>
            <p className="auth-subtitle">Digite sua nova senha</p>

            {message && (
              <div className={`auth-${messageType}`}>{message}</div>
            )}

            <form onSubmit={handleResetSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="password">Nova Senha *</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className={errors.password ? 'input-error' : ''}
                />
                {errors.password && (
                  <span className="error-text">{errors.password}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar Senha *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) =>
                    handleChange('confirmPassword', e.target.value)
                  }
                  placeholder="Confirme sua senha"
                  className={errors.confirmPassword ? 'input-error' : ''}
                />
                {errors.confirmPassword && (
                  <span className="error-text">{errors.confirmPassword}</span>
                )}
              </div>

              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? 'Redefinindo...' : 'Redefinir Senha'}
              </button>
            </form>

            <p className="auth-link">
              <a href="/login">Voltar para login</a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
