/**
 * Générateur de PDF
 * Génération de factures, devis, reçus et rapports en PDF
 */

import PDFDocument from 'pdfkit';
import { formatCurrency, formatPercentage } from './numberFormatter.js';
import { formatDate, formatDateLong } from './dateFormatter.js';

/**
 * Générer une facture PDF
 * @param {object} invoice - Données de la facture
 * @param {object} company - Informations de l'entreprise
 * @returns {PDFDocument}
 */
export const generateInvoicePDF = (invoice, company) => {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });

  // En-tête
  addInvoiceHeader(doc, company, invoice);

  // Informations client
  addCustomerInfo(doc, invoice.customer);

  // Lignes de facture
  addInvoiceItems(doc, invoice.items);

  // Totaux
  addInvoiceTotals(doc, invoice);

  // Conditions de paiement et notes
  addInvoiceFooter(doc, invoice, company);

  // Finaliser le document
  doc.end();

  return doc;
};

/**
 * Ajouter l'en-tête de facture
 * @param {PDFDocument} doc - Document PDF
 * @param {object} company - Informations entreprise
 * @param {object} invoice - Facture
 */
const addInvoiceHeader = (doc, company, invoice) => {
  // Logo entreprise (si disponible)
  if (company.logo) {
    try {
      doc.image(company.logo, 50, 45, { width: 80 });
    } catch (error) {
      console.error('Erreur chargement logo:', error);
    }
  }

  // Informations entreprise (à droite)
  doc
    .fontSize(10)
    .text(company.name, 300, 50, { width: 250, align: 'right' })
    .fontSize(8)
    .text(company.address, 300, 65, { width: 250, align: 'right' })
    .text(`${company.city}, ${company.country}`, 300, 78, { width: 250, align: 'right' })
    .text(`Tél: ${company.phone}`, 300, 91, { width: 250, align: 'right' })
    .text(`Email: ${company.email}`, 300, 104, { width: 250, align: 'right' });

  if (company.ninea) {
    doc.text(`NINEA: ${company.ninea}`, 300, 117, { width: 250, align: 'right' });
  }

  // Titre de la facture
  const docType = invoice.type === 'proforma' ? 'DEVIS' :
    invoice.type === 'credit_note' ? 'AVOIR' : 'FACTURE';

  doc
    .fontSize(20)
    .fillColor('#333')
    .text(docType, 50, 150, { align: 'center' });

  // Numéro et date
  doc
    .fontSize(10)
    .fillColor('#666')
    .text(`N° ${invoice.number}`, 50, 180)
    .text(`Date: ${formatDate(invoice.date)}`, 50, 195);

  if (invoice.dueDate) {
    doc.text(`Échéance: ${formatDate(invoice.dueDate)}`, 50, 210);
  }

  doc.moveDown(2);
};

/**
 * Ajouter les informations client
 * @param {PDFDocument} doc - Document PDF
 * @param {object} customer - Informations client
 */
const addCustomerInfo = (doc, customer) => {
  const startY = 240;

  doc
    .fontSize(12)
    .fillColor('#333')
    .text('FACTURER À', 50, startY);

  doc
    .fontSize(10)
    .fillColor('#000')
    .text(customer.name, 50, startY + 20)
    .fontSize(9)
    .fillColor('#666')
    .text(customer.address || '', 50, startY + 35)
    .text(`${customer.city || ''}, ${customer.country || ''}`, 50, startY + 48);

  if (customer.phone) {
    doc.text(`Tél: ${customer.phone}`, 50, startY + 61);
  }

  if (customer.email) {
    doc.text(`Email: ${customer.email}`, 50, startY + 74);
  }

  doc.moveDown(3);
};

/**
 * Ajouter les lignes de facture
 * @param {PDFDocument} doc - Document PDF
 * @param {Array} items - Articles de la facture
 */
const addInvoiceItems = (doc, items) => {
  const tableTop = 350;
  const tableHeaders = ['Description', 'Qté', 'P.U.', 'Remise', 'Total HT'];
  const columnWidths = [250, 50, 80, 70, 100];
  let currentY = tableTop;

  // En-tête du tableau
  doc
    .fillColor('#333')
    .fontSize(10)
    .font('Helvetica-Bold');

  let currentX = 50;
  tableHeaders.forEach((header, i) => {
    doc.text(header, currentX, currentY, {
      width: columnWidths[i],
      align: i === 0 ? 'left' : 'right',
    });
    currentX += columnWidths[i];
  });

  // Ligne de séparation
  doc
    .moveTo(50, currentY + 15)
    .lineTo(545, currentY + 15)
    .stroke();

  currentY += 25;

  // Lignes du tableau
  doc.font('Helvetica').fontSize(9);

  items.forEach((item) => {
    const lineHeight = 20;
    const subtotal = item.quantity * item.unitPrice;
    const discountAmount = item.discountType === 'percentage'
      ? (subtotal * item.discount) / 100
      : item.discount || 0;
    const total = subtotal - discountAmount;

    currentX = 50;

    // Vérifier si on doit changer de page
    if (currentY > 700) {
      doc.addPage();
      currentY = 50;
    }

    // Description
    doc.text(item.description || item.productName, currentX, currentY, {
      width: columnWidths[0],
    });
    currentX += columnWidths[0];

    // Quantité
    doc.text(item.quantity.toString(), currentX, currentY, {
      width: columnWidths[1],
      align: 'right',
    });
    currentX += columnWidths[1];

    // Prix unitaire
    doc.text(formatCurrency(item.unitPrice, 'XOF', { showCurrency: false }), currentX, currentY, {
      width: columnWidths[2],
      align: 'right',
    });
    currentX += columnWidths[2];

    // Remise
    const discountText = item.discount
      ? item.discountType === 'percentage'
        ? `${item.discount}%`
        : formatCurrency(item.discount, 'XOF', { showCurrency: false })
      : '-';
    doc.text(discountText, currentX, currentY, {
      width: columnWidths[3],
      align: 'right',
    });
    currentX += columnWidths[3];

    // Total
    doc.text(formatCurrency(total, 'XOF', { showCurrency: false }), currentX, currentY, {
      width: columnWidths[4],
      align: 'right',
    });

    currentY += lineHeight;
  });

  return currentY;
};

/**
 * Ajouter les totaux de la facture
 * @param {PDFDocument} doc - Document PDF
 * @param {object} invoice - Facture
 */
const addInvoiceTotals = (doc, invoice) => {
  const totalsX = 400;
  let totalsY = doc.y + 30;

  doc.fontSize(10);

  // Sous-total
  doc
    .text('Sous-total HT:', totalsX, totalsY)
    .text(formatCurrency(invoice.subtotal, 'XOF'), totalsX + 100, totalsY, { width: 100, align: 'right' });
  totalsY += 20;

  // Remise globale
  if (invoice.globalDiscount > 0) {
    const discountLabel = invoice.globalDiscountType === 'percentage'
      ? `Remise (${invoice.globalDiscount}%):`
      : 'Remise:';

    doc
      .text(discountLabel, totalsX, totalsY)
      .text(`-${formatCurrency(invoice.discountAmount, 'XOF')}`, totalsX + 100, totalsY, {
        width: 100,
        align: 'right',
      });
    totalsY += 20;
  }

  // Frais de livraison
  if (invoice.shippingCost > 0) {
    doc
      .text('Frais de livraison:', totalsX, totalsY)
      .text(formatCurrency(invoice.shippingCost, 'XOF'), totalsX + 100, totalsY, {
        width: 100,
        align: 'right',
      });
    totalsY += 20;
  }

  // TVA
  doc
    .text(`TVA (${invoice.vatRate || 18}%):`, totalsX, totalsY)
    .text(formatCurrency(invoice.vatAmount, 'XOF'), totalsX + 100, totalsY, { width: 100, align: 'right' });
  totalsY += 25;

  // Total TTC
  doc
    .fontSize(12)
    .font('Helvetica-Bold')
    .text('Total TTC:', totalsX, totalsY)
    .text(formatCurrency(invoice.total, 'XOF'), totalsX + 100, totalsY, { width: 100, align: 'right' });
};

/**
 * Ajouter le pied de page
 * @param {PDFDocument} doc - Document PDF
 * @param {object} invoice - Facture
 * @param {object} company - Informations entreprise
 */
const addInvoiceFooter = (doc, invoice, company) => {
  const footerY = 700;

  doc.fontSize(9).font('Helvetica');

  // Notes
  if (invoice.notes) {
    doc
      .fillColor('#666')
      .text('Notes:', 50, footerY)
      .fillColor('#000')
      .text(invoice.notes, 50, footerY + 15, { width: 495 });
  }

  // Conditions de paiement
  const paymentTermsY = footerY + 60;
  doc
    .fillColor('#666')
    .text('Conditions de paiement:', 50, paymentTermsY)
    .fillColor('#000')
    .text(getPaymentTermsText(invoice.paymentTerms), 50, paymentTermsY + 15);

  // Coordonnées bancaires
  if (company.bankAccount) {
    doc
      .fillColor('#666')
      .text('Coordonnées bancaires:', 50, paymentTermsY + 40)
      .fillColor('#000')
      .text(company.bankAccount, 50, paymentTermsY + 55);
  }
};

/**
 * Obtenir le texte des conditions de paiement
 * @param {string} terms - Conditions de paiement
 * @returns {string}
 */
const getPaymentTermsText = (terms) => {
  const termsMap = {
    immediate: 'Paiement immédiat',
    net_15: 'Paiement à 15 jours',
    net_30: 'Paiement à 30 jours',
    net_45: 'Paiement à 45 jours',
    net_60: 'Paiement à 60 jours',
  };

  return termsMap[terms] || terms;
};

/**
 * Générer un reçu de paiement PDF
 * @param {object} payment - Données du paiement
 * @param {object} company - Informations de l'entreprise
 * @returns {PDFDocument}
 */
export const generateReceiptPDF = (payment, company) => {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });

  // En-tête
  doc
    .fontSize(18)
    .text('REÇU DE PAIEMENT', 50, 50, { align: 'center' })
    .fontSize(12)
    .moveDown(2);

  // Informations du reçu
  doc
    .fontSize(10)
    .text(`N° ${payment.number}`, 50, 120)
    .text(`Date: ${formatDate(payment.date)}`, 50, 135)
    .moveDown(2);

  // Montant
  doc
    .fontSize(14)
    .font('Helvetica-Bold')
    .text(`Montant: ${formatCurrency(payment.amount, payment.currency)}`, 50, 170)
    .font('Helvetica')
    .fontSize(10)
    .moveDown(2);

  // Méthode de paiement
  doc.text(`Méthode: ${getPaymentMethodLabel(payment.method)}`, 50, 200);

  // Notes
  if (payment.notes) {
    doc
      .moveDown(2)
      .text('Notes:', 50, 230)
      .text(payment.notes, 50, 245, { width: 495 });
  }

  // Signature
  doc
    .moveDown(4)
    .text('Signature:', 50, 350)
    .moveTo(50, 400)
    .lineTo(250, 400)
    .stroke();

  doc.end();

  return doc;
};

/**
 * Obtenir le libellé d'une méthode de paiement
 * @param {string} method - Méthode de paiement
 * @returns {string}
 */
const getPaymentMethodLabel = (method) => {
  const methods = {
    cash: 'Espèces',
    check: 'Chèque',
    bank_transfer: 'Virement bancaire',
    mobile_money: 'Mobile Money',
    card: 'Carte bancaire',
    other: 'Autre',
  };

  return methods[method] || method;
};

/**
 * Générer un rapport PDF
 * @param {object} reportData - Données du rapport
 * @returns {PDFDocument}
 */
export const generateReportPDF = (reportData) => {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });

  // Titre du rapport
  doc
    .fontSize(16)
    .text(reportData.title, 50, 50, { align: 'center' })
    .fontSize(10)
    .text(reportData.subtitle || '', 50, 75, { align: 'center' })
    .moveDown(2);

  // Contenu du rapport (à personnaliser selon le type)
  doc.fontSize(10).text(JSON.stringify(reportData, null, 2), 50, 120);

  doc.end();

  return doc;
};

export default {
  generateInvoicePDF,
  generateReceiptPDF,
  generateReportPDF,
};
