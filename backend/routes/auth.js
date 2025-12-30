import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/emailService.js';

const router = express.Router();

/**
 * REGISTRO COM EMAIL E SENHA
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validações
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Todos os campos são obrigatórios',
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'As senhas não conferem',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'A senha deve ter no mínimo 6 caracteres',
      });
    }

    // Verificar se usuário já existe
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Este email já está registrado',
      });
    }

    // Gerar token de verificação
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

    // Criar novo usuário
    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      emailVerificationToken: crypto.createHash('sha256').update(verificationToken).digest('hex'),
      emailVerificationTokenExpires: verificationTokenExpires,
      isEmailVerified: false,
    });

    await user.save();

    // Enviar email de verificação
    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      success: true,
      message: 'Conta criada! Verifique seu email para confirmar',
      email: email,
    });
  } catch (error) {
    console.error('Erro ao registrar:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao registrar usuário',
      error: error.message,
    });
  }
});

/**
 * VERIFICAR EMAIL
 */
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token de verificação é obrigatório',
      });
    }

    // Buscar usuário com o token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token inválido ou expirado',
      });
    }

    // Marcar email como verificado
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Email verificado com sucesso! Você já pode fazer login',
    });
  } catch (error) {
    console.error('Erro ao verificar email:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao verificar email',
    });
  }
});

/**
 * REENVIAR EMAIL DE VERIFICAÇÃO
 */
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email é obrigatório',
      });
    }

    // Buscar usuário
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado',
      });
    }

    // Verificar se já está verificado
    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Este email já foi verificado',
      });
    }

    // Gerar novo token de verificação
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

    // Atualizar token do usuário
    user.emailVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
    user.emailVerificationTokenExpires = verificationTokenExpires;
    await user.save();

    // Reenviar email
    await sendVerificationEmail(email, verificationToken);

    res.json({
      success: true,
      message: 'Email de verificação reenviado com sucesso! Verifique sua caixa de entrada',
    });
  } catch (error) {
    console.error('Erro ao reenviar email:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao reenviar email de verificação',
    });
  }
});

/**
 * LOGIN COM EMAIL E SENHA
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validações
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email e senha são obrigatórios',
      });
    }

    // Buscar usuário
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.password) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha inválidos',
      });
    }

    // Verificar se email está verificado
    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: 'Verifique seu email antes de fazer login',
      });
    }

    // Verificar se conta está bloqueada
    if (user.lockUntil && user.lockUntil > new Date()) {
      return res.status(423).json({
        success: false,
        message: 'Conta bloqueada temporariamente. Tente novamente mais tarde',
      });
    }

    // Comparar senha
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      // Incrementar tentativas de login
      user.loginAttempts += 1;
      if (user.loginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // Bloquear por 30 minutos
      }
      await user.save();

      return res.status(401).json({
        success: false,
        message: 'Email ou senha inválidos',
      });
    }

    // Reset das tentativas de login
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLogin = new Date();
    await user.save();

    // Gerar JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        photo: user.photo,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao fazer login',
    });
  }
});

/**
 * SOLICITAR RESET DE SENHA
 */
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email é obrigatório',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado',
      });
    }

    // Gerar token de reset
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetTokenExpires = resetTokenExpires;
    await user.save();

    // Enviar email
    await sendPasswordResetEmail(email, resetToken);

    res.json({
      success: true,
      message: 'Email de reset enviado. Verifique sua caixa de entrada',
    });
  } catch (error) {
    console.error('Erro ao solicitar reset:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao solicitar reset de senha',
    });
  }
});

/**
 * REDEFINIR SENHA
 */
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;

    if (!token || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Todos os campos são obrigatórios',
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'As senhas não conferem',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'A senha deve ter no mínimo 6 caracteres',
      });
    }

    // Buscar usuário com token válido
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token inválido ou expirado',
      });
    }

    // Atualizar senha
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Senha redefinida com sucesso! Faça login novamente',
    });
  } catch (error) {
    console.error('Erro ao resetar senha:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao redefinir senha',
    });
  }
});

// Rota para iniciar autenticação Google
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

// Callback do Google
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  async (req, res) => {
    try {
      // Gerar JWT token
      const token = jwt.sign(
        { id: req.user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Redirecionar para o frontend com o token
      const frontendUrl = process.env.FRONTEND_URL || 
        (process.env.NODE_ENV === 'production' 
          ? 'https://www.flowduo.com.br' 
          : 'http://localhost:5173');
      const userData = JSON.stringify({
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        photo: req.user.photo,
        isEmailVerified: true,
      });
      
      res.redirect(
        `${frontendUrl}/login?token=${encodeURIComponent(token)}&user=${encodeURIComponent(userData)}`
      );
    } catch (error) {
      console.error('Erro no callback do Google:', error);
      const frontendUrl = process.env.FRONTEND_URL || 
        (process.env.NODE_ENV === 'production' 
          ? 'https://www.flowduo.com.br' 
          : 'http://localhost:5173');
      res.redirect(`${frontendUrl}/login?error=auth_failed`);
    }
  }
);

// Rota para logout
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logout realizado com sucesso',
  });
});

// Rota para obter usuário atual
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Nenhum token fornecido',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password -__v');

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token inválido',
    });
  }
});

export default router;
