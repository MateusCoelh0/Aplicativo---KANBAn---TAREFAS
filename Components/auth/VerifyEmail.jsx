import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import '../styles/auth.css';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setMessage('❌ Token de verificação não encontrado');
        setSuccess(false);
        setLoading(false);
        return;
      }

      const result = await authService.verifyEmail(token);

      if (result.success) {
        setMessage('✅ Email verificado com sucesso! Redirecionando...');
        setSuccess(true);

        // Redirecionar para login após 2 segundos
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setMessage(`❌ ${result.message}`);
        setSuccess(false);
      }

      setLoading(false);
    };

    verifyToken();
  }, [searchParams, navigate]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Verificando Email</h2>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Verificando seu email...</p>
          </div>
        ) : (
          <>
            <div className={`auth-${success ? 'success' : 'error'}`}>
              {message}
            </div>

            {!success && (
              <div className="verify-actions">
                <p>Pode tentar gerar um novo link</p>
                <a href="/register" className="auth-link-button">
                  Voltar para Registro
                </a>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        .loading-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          padding: 40px 20px;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #4CAF50;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .verify-actions {
          text-align: center;
          margin-top: 20px;
        }

        .auth-link-button {
          display: inline-block;
          margin-top: 15px;
          padding: 10px 20px;
          background-color: #4CAF50;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          transition: background-color 0.3s;
        }

        .auth-link-button:hover {
          background-color: #45a049;
        }
      `}</style>
    </div>
  );
}
