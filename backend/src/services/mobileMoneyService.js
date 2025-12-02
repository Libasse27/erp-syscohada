/**
 * Service Mobile Money
 * Intégration avec les opérateurs Mobile Money (Orange Money, Wave, Free Money)
 */

import axios from 'axios';
import logger from '../utils/logger.js';

/**
 * Configuration des APIs Mobile Money
 */
const MOBILE_MONEY_CONFIG = {
  orange_money: {
    apiUrl: process.env.ORANGE_MONEY_API_URL || 'https://api.orange.com/orange-money-webpay/dev/v1',
    merchantId: process.env.ORANGE_MONEY_MERCHANT_ID,
    apiKey: process.env.ORANGE_MONEY_API_KEY,
    apiSecret: process.env.ORANGE_MONEY_API_SECRET,
  },
  wave: {
    apiUrl: process.env.WAVE_API_URL || 'https://api.wave.com/v1',
    apiKey: process.env.WAVE_API_KEY,
  },
  free_money: {
    apiUrl: process.env.FREE_MONEY_API_URL || 'https://api.freemoney.sn/v1',
    merchantId: process.env.FREE_MONEY_MERCHANT_ID,
    apiKey: process.env.FREE_MONEY_API_KEY,
  },
};

/**
 * Initier un paiement Mobile Money
 * @param {object} paymentData - Données du paiement
 * @returns {Promise<object>} Résultat de l'initiation
 */
export const initiateMobileMoneyPayment = async (paymentData) => {
  const { provider, phoneNumber, amount, currency, reference, description } = paymentData;

  try {
    switch (provider) {
      case 'orange_money':
        return await initiateOrangeMoneyPayment({
          phoneNumber,
          amount,
          currency,
          reference,
          description,
        });

      case 'wave':
        return await initiateWavePayment({
          phoneNumber,
          amount,
          currency,
          reference,
          description,
        });

      case 'free_money':
        return await initiateFreeMoneyPayment({
          phoneNumber,
          amount,
          currency,
          reference,
          description,
        });

      default:
        throw new Error(`Opérateur Mobile Money non supporté: ${provider}`);
    }
  } catch (error) {
    logger.error(`Erreur initiation paiement Mobile Money: ${error.message}`);
    throw error;
  }
};

/**
 * Initier un paiement Orange Money
 * @param {object} data - Données du paiement
 * @returns {Promise<object>} Résultat
 */
const initiateOrangeMoneyPayment = async (data) => {
  const config = MOBILE_MONEY_CONFIG.orange_money;

  if (!config.apiKey || !config.merchantId) {
    throw new Error('Configuration Orange Money manquante');
  }

  try {
    const response = await axios.post(
      `${config.apiUrl}/webpayment`,
      {
        merchant_key: config.merchantId,
        currency: data.currency || 'XOF',
        order_id: data.reference,
        amount: data.amount,
        return_url: `${process.env.APP_URL}/payments/callback`,
        cancel_url: `${process.env.APP_URL}/payments/cancel`,
        notif_url: `${process.env.APP_URL}/api/payments/webhook/orange-money`,
        lang: 'fr',
        reference: data.reference,
      },
      {
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    logger.info(`Paiement Orange Money initié: ${data.reference}`);

    return {
      success: true,
      provider: 'orange_money',
      transactionId: response.data.payment_token,
      paymentUrl: response.data.payment_url,
      reference: data.reference,
    };
  } catch (error) {
    logger.error(`Erreur Orange Money: ${error.message}`);
    throw new Error(`Échec initiation Orange Money: ${error.response?.data?.message || error.message}`);
  }
};

/**
 * Initier un paiement Wave
 * @param {object} data - Données du paiement
 * @returns {Promise<object>} Résultat
 */
const initiateWavePayment = async (data) => {
  const config = MOBILE_MONEY_CONFIG.wave;

  if (!config.apiKey) {
    throw new Error('Configuration Wave manquante');
  }

  try {
    const response = await axios.post(
      `${config.apiUrl}/checkout/sessions`,
      {
        amount: data.amount,
        currency: data.currency || 'XOF',
        error_url: `${process.env.APP_URL}/payments/error`,
        success_url: `${process.env.APP_URL}/payments/success`,
        client_reference: data.reference,
      },
      {
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    logger.info(`Paiement Wave initié: ${data.reference}`);

    return {
      success: true,
      provider: 'wave',
      transactionId: response.data.id,
      paymentUrl: response.data.wave_launch_url,
      reference: data.reference,
    };
  } catch (error) {
    logger.error(`Erreur Wave: ${error.message}`);
    throw new Error(`Échec initiation Wave: ${error.response?.data?.message || error.message}`);
  }
};

/**
 * Initier un paiement Free Money
 * @param {object} data - Données du paiement
 * @returns {Promise<object>} Résultat
 */
const initiateFreeMoneyPayment = async (data) => {
  const config = MOBILE_MONEY_CONFIG.free_money;

  if (!config.apiKey || !config.merchantId) {
    throw new Error('Configuration Free Money manquante');
  }

  try {
    const response = await axios.post(
      `${config.apiUrl}/payments`,
      {
        merchant_id: config.merchantId,
        amount: data.amount,
        currency: data.currency || 'XOF',
        phone: data.phoneNumber,
        reference: data.reference,
        description: data.description,
        callback_url: `${process.env.APP_URL}/api/payments/webhook/free-money`,
      },
      {
        headers: {
          'X-API-Key': config.apiKey,
          'Content-Type': 'application/json',
        },
      }
    );

    logger.info(`Paiement Free Money initié: ${data.reference}`);

    return {
      success: true,
      provider: 'free_money',
      transactionId: response.data.transaction_id,
      status: response.data.status,
      reference: data.reference,
    };
  } catch (error) {
    logger.error(`Erreur Free Money: ${error.message}`);
    throw new Error(`Échec initiation Free Money: ${error.response?.data?.message || error.message}`);
  }
};

/**
 * Vérifier le statut d'un paiement Mobile Money
 * @param {string} provider - Opérateur
 * @param {string} transactionId - ID de la transaction
 * @returns {Promise<object>} Statut du paiement
 */
export const checkMobileMoneyPaymentStatus = async (provider, transactionId) => {
  try {
    switch (provider) {
      case 'orange_money':
        return await checkOrangeMoneyStatus(transactionId);

      case 'wave':
        return await checkWaveStatus(transactionId);

      case 'free_money':
        return await checkFreeMoneyStatus(transactionId);

      default:
        throw new Error(`Opérateur non supporté: ${provider}`);
    }
  } catch (error) {
    logger.error(`Erreur vérification statut Mobile Money: ${error.message}`);
    throw error;
  }
};

/**
 * Vérifier le statut Orange Money
 */
const checkOrangeMoneyStatus = async (transactionId) => {
  const config = MOBILE_MONEY_CONFIG.orange_money;

  const response = await axios.get(
    `${config.apiUrl}/webpayment/${transactionId}`,
    {
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
      },
    }
  );

  return {
    provider: 'orange_money',
    transactionId,
    status: response.data.status,
    amount: response.data.amount,
    paid: response.data.status === 'SUCCESS',
  };
};

/**
 * Vérifier le statut Wave
 */
const checkWaveStatus = async (transactionId) => {
  const config = MOBILE_MONEY_CONFIG.wave;

  const response = await axios.get(
    `${config.apiUrl}/checkout/sessions/${transactionId}`,
    {
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
      },
    }
  );

  return {
    provider: 'wave',
    transactionId,
    status: response.data.status,
    amount: response.data.amount,
    paid: response.data.status === 'complete',
  };
};

/**
 * Vérifier le statut Free Money
 */
const checkFreeMoneyStatus = async (transactionId) => {
  const config = MOBILE_MONEY_CONFIG.free_money;

  const response = await axios.get(
    `${config.apiUrl}/payments/${transactionId}`,
    {
      headers: {
        'X-API-Key': config.apiKey,
      },
    }
  );

  return {
    provider: 'free_money',
    transactionId,
    status: response.data.status,
    amount: response.data.amount,
    paid: response.data.status === 'completed',
  };
};

/**
 * Effectuer un remboursement Mobile Money
 * @param {string} provider - Opérateur
 * @param {string} transactionId - ID de la transaction originale
 * @param {number} amount - Montant à rembourser
 * @returns {Promise<object>} Résultat du remboursement
 */
export const refundMobileMoneyPayment = async (provider, transactionId, amount) => {
  try {
    // Note: L'implémentation dépend des APIs des opérateurs
    logger.info(`Remboursement ${provider}: ${transactionId} - ${amount}`);

    // Chaque opérateur a ses propres endpoints de remboursement
    // Ceci est un exemple générique

    return {
      success: true,
      provider,
      originalTransactionId: transactionId,
      refundAmount: amount,
      status: 'pending',
    };
  } catch (error) {
    logger.error(`Erreur remboursement Mobile Money: ${error.message}`);
    throw error;
  }
};

export default {
  initiateMobileMoneyPayment,
  checkMobileMoneyPaymentStatus,
  refundMobileMoneyPayment,
};
