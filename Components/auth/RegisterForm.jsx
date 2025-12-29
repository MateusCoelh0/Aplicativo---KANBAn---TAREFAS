import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { authService } from '../../src/services/authService';
import '../../src/styles/auth.css';

export default function RegisterForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não conferem';
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

    // Remover erro deste campo quando o usuário começar a digitar
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
    setSuccessMessage('');

    const result = await authService.register(
      formData.name,
      formData.email,
      formData.password,
      formData.confirmPassword
    );

    if (result.success) {
      setSuccessMessage('✅ Conta criada com sucesso! Verifique seu email para confirmar.');
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });

      // Chamar callback de sucesso se fornecido
      if (onSuccess) {
        setTimeout(() => onSuccess(), 2000);
      }
    } else {
      setErrorMessage(`❌ ${result.message}`);
    }

    setLoading(false);
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
        
        <h2>Criar Conta</h2>
        <p className="auth-subtitle">Seja bem vindo ao FlowDuo seu agendador de tarefas</p>

        {successMessage && <div className="auth-success">{successMessage}</div>}
        {errorMessage && <div className="auth-error">{errorMessage}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Nome Completo *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="João Silva"
              className={errors.name ? 'input-error' : ''}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

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
                placeholder="Mínimo 6 caracteres"
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
            {!errors.password && formData.password.length > 0 && formData.password.length < 6 && (
              <span className="info-text">⚠️ A senha deve ter no mínimo 6 caracteres</span>
            )}
            {!errors.password && formData.password.length === 0 && (
              <span className="info-text">💡 Use no mínimo 6 caracteres para sua senha</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Senha *</label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirme sua senha"
                className={errors.confirmPassword ? 'input-error' : ''}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label="Mostrar/ocultar confirmação de senha"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="error-text">{errors.confirmPassword}</span>
            )}
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrar'}
          </button>
        </form>

        <p className="auth-link">
          Já tem conta? <a href="/login">Faça login aqui</a>
        </p>
        
        <div className="auth-footer">
          Desenvolvido por Mateus Coelho
        </div>
      </div>
    </div>
  );
}
