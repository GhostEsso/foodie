import nodemailer from "nodemailer";

// Configuration du transporteur d'email
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true pour 465, false pour les autres ports
  auth: {
    user: "lilipitaham@gmail.com" || process.env.EMAIL_USER,
    pass: "zusomkgcrealovuz" || process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false, // Pour le développement local
  },
});

export async function sendVerificationEmail(
  email: string,
  verificationCode: string
) {
  console.log("Tentative d'envoi d'email à:", email);
  console.log("Configuration email:", {
    user: process.env.EMAIL_USER,
    hasPassword: !!process.env.EMAIL_PASSWORD,
  });

  const mailOptions = {
    from: `"Foody" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Vérification de votre compte foody",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Vérification de votre compte Foody</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f7f7f7; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f7f7f7;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden; margin: 0 20px;">
                  <!-- En-tête avec logo -->
                  <tr>
                    <td align="center" style="padding: 40px 0; background: linear-gradient(135deg, #1b74e4 0%, #0a4b9c 100%);">
                      <h1 style="color: #ffffff; font-size: 32px; margin: 0; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                        Foody
                      </h1>
                    </td>
                  </tr>
                  
                  <!-- Contenu principal -->
                  <tr>
                    <td style="padding: 40px 60px;">
                      <h2 style="color: #1b74e4; font-size: 24px; margin: 0 0 20px; text-align: center;">
                        Bienvenue sur Foody !
                      </h2>
                      <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                        Merci de vous être inscrit. Pour commencer à utiliser votre compte, veuillez entrer le code de vérification suivant :
                      </p>
                      
                      <!-- Code de vérification -->
                      <div style="background: linear-gradient(135deg, #f0f2f5 0%, #e4e6eb 100%); border-radius: 12px; padding: 30px; margin: 30px 0; text-align: center;">
                        <h2 style="color: #1b74e4; font-size: 36px; letter-spacing: 8px; margin: 0; font-family: monospace;">
                          ${verificationCode}
                        </h2>
                      </div>
        <!-- Message d'expiration -->
                      <p style="color: #666666; font-size: 14px; text-align: center; margin: 20px 0;">
                        ⏰ Ce code est valable pendant <strong>1 heure</strong>
                      </p>
                      
                      <!-- Message de sécurité -->
                      <p style="color: #666666; font-size: 14px; text-align: center; margin: 20px 0; padding: 20px; border-top: 1px solid #eee;">
                        Si vous n'avez pas créé de compte sur Foody, vous pouvez ignorer cet email en toute sécurité.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Pied de page -->
                  <tr>
                    <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #eee;">
                      <p style="color: #65676b; font-size: 12px; margin: 0;">
                        © ${new Date().getFullYear()} Foody. Tous droits réservés.
                      </p>
                      <p style="color: #65676b; font-size: 12px; margin: 10px 0 0;">
                        Cet email a été envoyé automatiquement, merci de ne pas y répondre.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  };

  try {
    // Vérifier la connexion SMTP
    await transporter.verify();
    console.log("Connexion SMTP vérifiée avec succès");

    // Envoyer l'email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email envoyé avec succès:", info.response);
    return info;
  } catch (error) {
    console.error("Erreur détaillée lors de l'envoi de l'email:", error);
    throw new Error(
      `Erreur lors de l'envoi de l'email de vérification: ${error.message}`
    );
  }
}
