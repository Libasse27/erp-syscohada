/**
 * Service d'envoi d'emails
 * Gestion de l'envoi d'emails transactionnels
 */

import nodemailer from 'nodemailer';
import logger from '../utils/logger.js';

/**
 * Créer un transporteur d'email
 */
const createTransporter = () => {
  // Configuration selon l'environnement
  if (process.env.NODE_ENV === 'production') {
    // Production: utiliser un service SMTP réel (ex: SendGrid, Mailgun)
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Développement: utiliser Ethereal (emails de test)
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: process.env.ETHEREAL_USER || 'test@ethereal.email',
        pass: process.env.ETHEREAL_PASS || 'test',
      },
    });
  }
};

/**
 * Envoyer un email
 * @param {object} options - Options d'envoi
 * @returns {object} Résultat de l'envoi
 */
export const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: options.from || `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      attachments: options.attachments,
    };

    const info = await transporter.sendMail(mailOptions);

    logger.info(`Email envoyé: ${info.messageId}`);

    // En développement, afficher le lien de prévisualisation
    if (process.env.NODE_ENV !== 'production') {
      logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }

    return {
      success: true,
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info),
    };
  } catch (error) {
    logger.error(`Erreur envoi email: ${error.message}`);
    throw new Error(`Échec de l'envoi de l'email: ${error.message}`);
  }
};

/**
 * Envoyer un email de bienvenue
 * @param {object} user - Utilisateur
 * @param {string} companyName - Nom de l'entreprise
 */
export const sendWelcomeEmail = async (user, companyName) => {
  const subject = `Bienvenue sur ${companyName || 'ERP SYSCOHADA'}`;

  const html = `
    <h1>Bienvenue ${user.firstName} !</h1>
    <p>Votre compte a été créé avec succès sur ${companyName || 'ERP SYSCOHADA'}.</p>
    <p>Vous pouvez maintenant vous connecter avec votre email: <strong>${user.email}</strong></p>
    <p>Cordialement,<br>L'équipe ${companyName || 'ERP SYSCOHADA'}</p>
  `;

  const text = `Bienvenue ${user.firstName} ! Votre compte a été créé avec succès.`;

  return sendEmail({
    to: user.email,
    subject,
    text,
    html,
  });
};

/**
 * Envoyer un email de réinitialisation de mot de passe
 * @param {object} user - Utilisateur
 * @param {string} resetToken - Token de réinitialisation
 * @param {string} resetUrl - URL de réinitialisation
 */
export const sendPasswordResetEmail = async (user, resetToken, resetUrl) => {
  const subject = 'Réinitialisation de votre mot de passe';

  const html = `
    <h1>Réinitialisation de mot de passe</h1>
    <p>Bonjour ${user.firstName},</p>
    <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
    <p>Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe :</p>
    <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 5px;">
      Réinitialiser mon mot de passe
    </a>
    <p>Ce lien est valide pendant 1 heure.</p>
    <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
    <p>Cordialement,<br>L'équipe ERP SYSCOHADA</p>
  `;

  const text = `Réinitialisation de mot de passe. Utilisez ce lien: ${resetUrl}`;

  return sendEmail({
    to: user.email,
    subject,
    text,
    html,
  });
};

/**
 * Envoyer un email de confirmation de changement de mot de passe
 * @param {object} user - Utilisateur
 */
export const sendPasswordChangedEmail = async (user) => {
  const subject = 'Votre mot de passe a été modifié';

  const html = `
    <h1>Mot de passe modifié</h1>
    <p>Bonjour ${user.firstName},</p>
    <p>Votre mot de passe a été modifié avec succès.</p>
    <p>Si vous n'êtes pas à l'origine de ce changement, contactez-nous immédiatement.</p>
    <p>Cordialement,<br>L'équipe ERP SYSCOHADA</p>
  `;

  const text = 'Votre mot de passe a été modifié avec succès.';

  return sendEmail({
    to: user.email,
    subject,
    text,
    html,
  });
};

/**
 * Envoyer une facture par email
 * @param {string} email - Email du destinataire
 * @param {object} invoice - Facture
 * @param {Buffer} pdfBuffer - PDF de la facture
 */
export const sendInvoiceEmail = async (email, invoice, pdfBuffer) => {
  const subject = `Facture ${invoice.number}`;

  const html = `
    <h1>Nouvelle facture</h1>
    <p>Veuillez trouver ci-joint la facture ${invoice.number}.</p>
    <p>Montant: ${invoice.total} ${invoice.currency}</p>
    <p>Date d'échéance: ${new Date(invoice.dueDate).toLocaleDateString('fr-FR')}</p>
    <p>Cordialement</p>
  `;

  const text = `Facture ${invoice.number} - Montant: ${invoice.total} ${invoice.currency}`;

  return sendEmail({
    to: email,
    subject,
    text,
    html,
    attachments: [
      {
        filename: `facture-${invoice.number}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  });
};

/**
 * Envoyer une notification de facture impayée
 * @param {string} email - Email du client
 * @param {object} invoice - Facture
 */
export const sendOverdueInvoiceEmail = async (email, invoice) => {
  const subject = `Rappel: Facture ${invoice.number} impayée`;

  const html = `
    <h1>Rappel de paiement</h1>
    <p>Votre facture ${invoice.number} est en retard.</p>
    <p>Montant dû: ${invoice.amountDue} ${invoice.currency}</p>
    <p>Date d'échéance: ${new Date(invoice.dueDate).toLocaleDateString('fr-FR')}</p>
    <p>Merci de régulariser votre situation dans les plus brefs délais.</p>
  `;

  const text = `Rappel: Facture ${invoice.number} impayée. Montant: ${invoice.amountDue} ${invoice.currency}`;

  return sendEmail({
    to: email,
    subject,
    text,
    html,
  });
};

/**
 * Envoyer une notification de stock bas
 * @param {string} email - Email du responsable
 * @param {array} products - Produits en stock bas
 */
export const sendLowStockAlert = async (email, products) => {
  const subject = 'Alerte: Stock bas';

  const productsList = products
    .map((p) => `- ${p.name}: ${p.currentStock} ${p.unit} restant(s)`)
    .join('<br>');

  const html = `
    <h1>Alerte de stock bas</h1>
    <p>Les produits suivants ont atteint le niveau de réapprovisionnement :</p>
    <p>${productsList}</p>
    <p>Merci de passer commande.</p>
  `;

  const text = `Alerte stock bas: ${products.length} produit(s) à réapprovisionner`;

  return sendEmail({
    to: email,
    subject,
    text,
    html,
  });
};

/**
 * Envoyer un rapport par email
 * @param {string} email - Email du destinataire
 * @param {string} reportName - Nom du rapport
 * @param {Buffer} reportBuffer - Fichier du rapport
 * @param {string} format - Format (pdf ou xlsx)
 */
export const sendReportEmail = async (email, reportName, reportBuffer, format = 'pdf') => {
  const subject = `Rapport: ${reportName}`;

  const html = `
    <h1>Votre rapport est prêt</h1>
    <p>Veuillez trouver ci-joint le rapport <strong>${reportName}</strong>.</p>
    <p>Cordialement,<br>L'équipe ERP SYSCOHADA</p>
  `;

  const text = `Rapport ${reportName} disponible en pièce jointe`;

  const contentType = format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  const extension = format === 'pdf' ? 'pdf' : 'xlsx';

  return sendEmail({
    to: email,
    subject,
    text,
    html,
    attachments: [
      {
        filename: `${reportName}.${extension}`,
        content: reportBuffer,
        contentType,
      },
    ],
  });
};

export default {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
  sendInvoiceEmail,
  sendOverdueInvoiceEmail,
  sendLowStockAlert,
  sendReportEmail,
};
