// serviço de autenticação - faz requisições para o backend

const API_URL = 'http://localhost:5000/api/auth';

export const authService = {
  /**
   * Registrar novo usuário
   */
  register: async (name, email, password, confirmPassword) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao conectar com o servidor',
        error: error.message,
      };
    }
  },

  /**
   * Verificar email com token
   */
  verifyEmail: async (token) => {
    try {
      const response = await fetch(`${API_URL}/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao verificar email',
        error: error.message,
      };
    }
  },

  /**
   * Login com email e senha
   */
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // Salvar token se login foi bem-sucedido
      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao fazer login',
        error: error.message,
      };
    }
  },

  /**
   * Solicitar reset de senha
   */
  forgotPassword: async (email) => {
    try {
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao solicitar reset de senha',
        error: error.message,
      };
    }
  },

  /**
   * Redefinir senha com token
   */
  resetPassword: async (token, password, confirmPassword) => {
    try {
      const response = await fetch(`${API_URL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password, confirmPassword }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao redefinir senha',
        error: error.message,
      };
    }
  },

  /**
   * Obter usuário atual
   */
  getCurrentUser: async (token) => {
    try {
      const response = await fetch(`${API_URL}/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao obter usuário',
        error: error.message,
      };
    }
  },

  /**
   * Logout
   */
  logout: async () => {
    try {
      const response = await fetch(`${API_URL}/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      // Limpar localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      return data;
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao fazer logout',
        error: error.message,
      };
    }
  },

  /**
   * Obter token armazenado
   */
  getToken: () => localStorage.getItem('token'),

  /**
   * Obter usuário armazenado
   */
  getStoredUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Verificar se está logado
   */
  isLoggedIn: () => !!localStorage.getItem('token'),
};

export default authService;
