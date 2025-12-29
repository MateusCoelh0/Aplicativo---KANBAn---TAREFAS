import nodemailer from 'nodemailer';

// Configurar o transporter de email
// Para desenvolvimento, usamos Ethereal Email (fake SMTP)
// Para produção, use um serviço real como Gmail, SendGrid, etc.

let transporter;

if (process.env.NODE_ENV === 'production') {
  // Configurar para serviço de email real em produção
  transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
} else {
  // Para desenvolvimento, usar Ethereal Email
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
    port: process.env.EMAIL_PORT || 2525,
    auth: {
      user: process.env.EMAIL_USER || 'seu_usuario_mailtrap',
      pass: process.env.EMAIL_PASSWORD || 'sua_senha_mailtrap',
    },
  });
}

/**
 * Enviar email de verificação
 */
export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@kambam.com',
      to: email,
      subject: 'Verifique seu email - KAMBAM',
      html: `
        <h2>Bem-vindo ao KAMBAM!</h2>
        <p>Para completar seu registro, clique no link abaixo para verificar seu email:</p>
        <a href="${verificationUrl}" style="
          display: inline-block;
          padding: 10px 20px;
          background-color: #4CAF50;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        ">Verificar Email</a>
        <p>Ou copie e cole este link no seu navegador:</p>
        <p>${verificationUrl}</p>
        <p>Este link expira em 24 horas.</p>
        <hr>
        <p>Se você não criou esta conta, ignore este email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Email de verificação enviado' };
  } catch (error) {
    console.error('Erro ao enviar email de verificação:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Enviar email de reset de senha
 */
export const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@kambam.com',
      to: email,
      subject: 'Redefinir sua senha - KAMBAM',
      html: `
        <h2>Solicitação de Reset de Senha</h2>
        <p>Você solicitou um reset de senha. Clique no link abaixo:</p>
        <a href="${resetUrl}" style="
          display: inline-block;
          padding: 10px 20px;
          background-color: #4CAF50;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        ">Redefinir Senha</a>
        <p>Este link expira em 1 hora.</p>
        <hr>
        <p>Se você não solicitou isto, ignore este email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Email de reset enviado' };
  } catch (error) {
    console.error('Erro ao enviar email de reset:', error);
    return { success: false, error: error.message };
  }
};