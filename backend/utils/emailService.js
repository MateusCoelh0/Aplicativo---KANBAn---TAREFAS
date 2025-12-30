import { Resend } from 'resend';

// Inicializar Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Log de configuração (sem expor a chave)
if (!process.env.RESEND_API_KEY) {
  console.error('❌ RESEND_API_KEY não configurada! Configure no Render Dashboard.');
} else {
  console.log('✅ Resend configurado com sucesso');
  console.log(`📧 Email remetente: ${process.env.EMAIL_FROM || 'noreply@flowduo.com.br'}`);
}

/**
 * Enviar email de verificação
 */
export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const verificationUrl = `${process.env.FRONTEND_URL || 'https://www.flowduo.com.br'}/verify-email?token=${verificationToken}`;

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'FlowDuo <onboarding@resend.dev>',
      to: email,
      subject: '✅ Verifique seu email - FlowDuo',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
          <div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #1e293b 0%, #475569 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">FlowDuo</h1>
              <p style="color: #cbd5e1; margin: 10px 0 0; font-size: 14px;">Organize suas tarefas com eficiência</p>
            </div>
            
            <!-- Body -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #1e293b; margin: 0 0 20px; font-size: 24px; font-weight: 600;">Bem-vindo ao FlowDuo! 🎉</h2>
              
              <p style="color: #475569; line-height: 1.6; margin: 0 0 20px; font-size: 16px;">
                Obrigado por se cadastrar! Para começar a usar o FlowDuo e gerenciar suas tarefas, precisamos confirmar seu email.
              </p>
              
              <p style="color: #475569; line-height: 1.6; margin: 0 0 30px; font-size: 16px;">
                Clique no botão abaixo para verificar seu email:
              </p>
              
              <!-- Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" style="
                  display: inline-block;
                  padding: 16px 40px;
                  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                  color: white;
                  text-decoration: none;
                  border-radius: 8px;
                  font-weight: 600;
                  font-size: 16px;
                  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
                ">Verificar Meu Email</a>
              </div>
              
              <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 30px 0 10px; padding: 15px; background: #f1f5f9; border-radius: 8px;">
                <strong>Ou copie e cole este link no seu navegador:</strong><br>
                <a href="${verificationUrl}" style="color: #3b82f6; word-break: break-all;">${verificationUrl}</a>
              </p>
              
              <p style="color: #94a3b8; font-size: 13px; margin: 20px 0 0;">
                ⏱️ Este link expira em 24 horas.
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; font-size: 13px; margin: 0 0 10px;">
                Se você não criou esta conta, pode ignorar este email com segurança.
              </p>
              <p style="color: #94a3b8; font-size: 12px; margin: 10px 0 0;">
                © ${new Date().getFullYear()} FlowDuo. Todos os direitos reservados.
              </p>
            </div>
            
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('❌ Erro ao enviar email de verificação:', error);
      throw new Error(`Falha ao enviar email: ${error.message}`);
    }

    console.log(`✅ Email de verificação enviado para ${email}`);
    console.log(`📬 ID da mensagem: ${data?.id}`);
    return { success: true, message: 'Email de verificação enviado', messageId: data?.id };
  } catch (error) {
    console.error('❌ Erro crítico no envio de email:', error);
    return { 
      success: false, 
      error: error.message || 'Erro desconhecido ao enviar email' 
    };
  }
};

/**
 * Enviar email de reset de senha
 */
export const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL || 'https://www.flowduo.com.br'}/reset-password?token=${resetToken}`;

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'FlowDuo <onboarding@resend.dev>',
      to: email,
      subject: '🔒 Redefinir sua senha - FlowDuo',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
          <div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">🔐 Redefinir Senha</h1>
              <p style="color: #fecaca; margin: 10px 0 0; font-size: 14px;">FlowDuo - Kanban</p>
            </div>
            
            <!-- Body -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #1e293b; margin: 0 0 20px; font-size: 24px; font-weight: 600;">Solicitação de Reset de Senha</h2>
              
              <p style="color: #475569; line-height: 1.6; margin: 0 0 20px; font-size: 16px;">
                Recebemos uma solicitação para redefinir a senha da sua conta FlowDuo.
              </p>
              
              <p style="color: #475569; line-height: 1.6; margin: 0 0 30px; font-size: 16px;">
                Clique no botão abaixo para criar uma nova senha:
              </p>
              
              <!-- Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="
                  display: inline-block;
                  padding: 16px 40px;
                  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                  color: white;
                  text-decoration: none;
                  border-radius: 8px;
                  font-weight: 600;
                  font-size: 16px;
                  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
                ">Redefinir Minha Senha</a>
              </div>
              
              <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 30px 0 10px; padding: 15px; background: #fef2f2; border-radius: 8px; border-left: 4px solid #ef4444;">
                <strong>⏱️ Este link expira em 1 hora.</strong><br>
                Por segurança, o link só pode ser usado uma vez.
              </p>
              
              <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 30px 0 10px; padding: 15px; background: #f1f5f9; border-radius: 8px;">
                <strong>Ou copie e cole este link:</strong><br>
                <a href="${resetUrl}" style="color: #ef4444; word-break: break-all;">${resetUrl}</a>
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; font-size: 13px; margin: 0 0 10px;">
                ⚠️ Se você não solicitou esta alteração, ignore este email com segurança.<br>
                Sua senha permanecerá inalterada.
              </p>
              <p style="color: #94a3b8; font-size: 12px; margin: 10px 0 0;">
                © ${new Date().getFullYear()} FlowDuo. Todos os direitos reservados.
              </p>
            </div>
            
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('❌ Erro ao enviar email de reset:', error);
      throw new Error(`Falha ao enviar email: ${error.message}`);
    }

    console.log(`✅ Email de reset enviado para ${email}`);
    console.log(`📬 ID da mensagem: ${data?.id}`);
    return { success: true, message: 'Email de reset enviado', messageId: data?.id };
  } catch (error) {
    console.error('❌ Erro crítico ao enviar email de reset:', error);
    return { 
      success: false, 
      error: error.message || 'Erro desconhecido ao enviar email' 
    };
  }
};