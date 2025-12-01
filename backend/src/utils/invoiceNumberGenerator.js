/**
 * Générateur de numéros de factures
 * Génération automatique de numéros de documents (factures, devis, avoirs, etc.)
 */

/**
 * Générer un numéro de facture
 * Format: FAC-YYYY-MM-XXXXX
 * @param {number} counter - Compteur séquentiel
 * @param {Date} date - Date de la facture
 * @param {string} prefix - Préfixe (FAC, DEV, AVO, etc.)
 * @returns {string}
 */
export const generateInvoiceNumber = (counter, date = new Date(), prefix = 'FAC') => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const sequence = String(counter).padStart(5, '0');

  return `${prefix}-${year}-${month}-${sequence}`;
};

/**
 * Générer un numéro de devis/proforma
 * Format: DEV-YYYY-MM-XXXXX
 * @param {number} counter - Compteur séquentiel
 * @param {Date} date - Date du devis
 * @returns {string}
 */
export const generateQuoteNumber = (counter, date = new Date()) => {
  return generateInvoiceNumber(counter, date, 'DEV');
};

/**
 * Générer un numéro d'avoir (credit note)
 * Format: AVO-YYYY-MM-XXXXX
 * @param {number} counter - Compteur séquentiel
 * @param {Date} date - Date de l'avoir
 * @returns {string}
 */
export const generateCreditNoteNumber = (counter, date = new Date()) => {
  return generateInvoiceNumber(counter, date, 'AVO');
};

/**
 * Générer un numéro de facture d'achat
 * Format: ACH-YYYY-MM-XXXXX
 * @param {number} counter - Compteur séquentiel
 * @param {Date} date - Date de la facture d'achat
 * @returns {string}
 */
export const generatePurchaseNumber = (counter, date = new Date()) => {
  return generateInvoiceNumber(counter, date, 'ACH');
};

/**
 * Générer un numéro de bon de commande
 * Format: CMD-YYYY-MM-XXXXX
 * @param {number} counter - Compteur séquentiel
 * @param {Date} date - Date du bon de commande
 * @returns {string}
 */
export const generateOrderNumber = (counter, date = new Date()) => {
  return generateInvoiceNumber(counter, date, 'CMD');
};

/**
 * Générer un numéro de bon de livraison
 * Format: BL-YYYY-MM-XXXXX
 * @param {number} counter - Compteur séquentiel
 * @param {Date} date - Date du bon de livraison
 * @returns {string}
 */
export const generateDeliveryNumber = (counter, date = new Date()) => {
  return generateInvoiceNumber(counter, date, 'BL');
};

/**
 * Générer un numéro de reçu de paiement
 * Format: REC-YYYY-MM-XXXXX
 * @param {number} counter - Compteur séquentiel
 * @param {Date} date - Date du reçu
 * @returns {string}
 */
export const generateReceiptNumber = (counter, date = new Date()) => {
  return generateInvoiceNumber(counter, date, 'REC');
};

/**
 * Générer un numéro d'écriture comptable
 * Format: ECR-YYYY-MM-XXXXX
 * @param {number} counter - Compteur séquentiel
 * @param {Date} date - Date de l'écriture
 * @returns {string}
 */
export const generateEntryNumber = (counter, date = new Date()) => {
  return generateInvoiceNumber(counter, date, 'ECR');
};

/**
 * Générer un numéro de client
 * Format: CLI-XXXXXX
 * @param {number} counter - Compteur séquentiel
 * @returns {string}
 */
export const generateCustomerNumber = (counter) => {
  const sequence = String(counter).padStart(6, '0');
  return `CLI-${sequence}`;
};

/**
 * Générer un numéro de fournisseur
 * Format: FOU-XXXXXX
 * @param {number} counter - Compteur séquentiel
 * @returns {string}
 */
export const generateSupplierNumber = (counter) => {
  const sequence = String(counter).padStart(6, '0');
  return `FOU-${sequence}`;
};

/**
 * Générer un code produit automatique
 * Format: PRD-XXXXXX
 * @param {number} counter - Compteur séquentiel
 * @returns {string}
 */
export const generateProductCode = (counter) => {
  const sequence = String(counter).padStart(6, '0');
  return `PRD-${sequence}`;
};

/**
 * Générer un numéro de transaction
 * Format: TRX-YYYYMMDD-HHMMSS-XXXXX
 * @param {number} counter - Compteur séquentiel
 * @param {Date} date - Date de la transaction
 * @returns {string}
 */
export const generateTransactionNumber = (counter, date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const sequence = String(counter).padStart(5, '0');

  return `TRX-${year}${month}${day}-${hours}${minutes}${seconds}-${sequence}`;
};

/**
 * Générer une référence unique courte
 * Format: XXXXX (5 caractères alphanumériques)
 * @returns {string}
 */
export const generateShortReference = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Générer une référence unique longue
 * Format: XXXXXXXXXXXX (12 caractères alphanumériques)
 * @returns {string}
 */
export const generateLongReference = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Parser un numéro de document pour extraire les informations
 * @param {string} documentNumber - Numéro de document
 * @returns {object|null}
 */
export const parseDocumentNumber = (documentNumber) => {
  const regex = /^([A-Z]+)-(\d{4})-(\d{2})-(\d{5})$/;
  const match = documentNumber.match(regex);

  if (!match) return null;

  return {
    prefix: match[1],
    year: parseInt(match[2]),
    month: parseInt(match[3]),
    sequence: parseInt(match[4]),
  };
};

/**
 * Obtenir le type de document depuis le préfixe
 * @param {string} prefix - Préfixe du document
 * @returns {string}
 */
export const getDocumentType = (prefix) => {
  const types = {
    FAC: 'Facture',
    DEV: 'Devis',
    AVO: 'Avoir',
    ACH: 'Facture d\'achat',
    CMD: 'Bon de commande',
    BL: 'Bon de livraison',
    REC: 'Reçu',
    ECR: 'Écriture comptable',
    CLI: 'Client',
    FOU: 'Fournisseur',
    PRD: 'Produit',
    TRX: 'Transaction',
  };

  return types[prefix] || 'Document inconnu';
};

/**
 * Valider le format d'un numéro de document
 * @param {string} documentNumber - Numéro de document
 * @returns {boolean}
 */
export const isValidDocumentNumber = (documentNumber) => {
  const regex = /^[A-Z]+-\d{4}-\d{2}-\d{5}$/;
  return regex.test(documentNumber);
};

/**
 * Générer le prochain numéro basé sur le dernier numéro
 * @param {string} lastNumber - Dernier numéro généré
 * @param {Date} date - Date du nouveau document
 * @returns {string}
 */
export const generateNextNumber = (lastNumber, date = new Date()) => {
  if (!lastNumber) {
    return generateInvoiceNumber(1, date);
  }

  const parsed = parseDocumentNumber(lastNumber);
  if (!parsed) {
    return generateInvoiceNumber(1, date);
  }

  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth() + 1;

  // Réinitialiser le compteur si nouvelle année ou nouveau mois
  if (parsed.year !== currentYear || parsed.month !== currentMonth) {
    return generateInvoiceNumber(1, date, parsed.prefix);
  }

  // Incrémenter le compteur
  return generateInvoiceNumber(parsed.sequence + 1, date, parsed.prefix);
};

/**
 * Obtenir un compteur basé sur le type de document et la période
 * Utilisé pour synchroniser avec la base de données
 * @param {string} documentType - Type de document
 * @param {Date} date - Date
 * @returns {string} - Clé du compteur
 */
export const getCounterKey = (documentType, date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${documentType}_${year}_${month}`;
};

/**
 * Formater un numéro de document pour l'affichage
 * @param {string} documentNumber - Numéro de document
 * @returns {string}
 */
export const formatDocumentNumber = (documentNumber) => {
  const parsed = parseDocumentNumber(documentNumber);
  if (!parsed) return documentNumber;

  const type = getDocumentType(parsed.prefix);
  return `${type} N° ${documentNumber}`;
};

export default {
  generateInvoiceNumber,
  generateQuoteNumber,
  generateCreditNoteNumber,
  generatePurchaseNumber,
  generateOrderNumber,
  generateDeliveryNumber,
  generateReceiptNumber,
  generateEntryNumber,
  generateCustomerNumber,
  generateSupplierNumber,
  generateProductCode,
  generateTransactionNumber,
  generateShortReference,
  generateLongReference,
  parseDocumentNumber,
  getDocumentType,
  isValidDocumentNumber,
  generateNextNumber,
  getCounterKey,
  formatDocumentNumber,
};
