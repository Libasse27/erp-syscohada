/**
 * Service de gestion de stock
 * Logique métier pour les mouvements de stock et inventaire
 */

import Product from '../models/Product.js';
import StockMovement from '../models/StockMovement.js';
import Warehouse from '../models/Warehouse.js';
import logger from '../utils/logger.js';

/**
 * Enregistrer une entrée de stock
 * @param {object} movementData - Données du mouvement
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<object>} Mouvement créé
 */
export const recordStockIn = async (movementData, userId) => {
  const { productId, quantity, warehouseId, unitCost, reason, reference, referenceType, referenceId } = movementData;

  // Récupérer le produit
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error('Produit non trouvé');
  }

  if (!product.trackStock) {
    throw new Error('Ce produit ne gère pas le stock');
  }

  const stockBefore = product.currentStock;
  const stockAfter = stockBefore + quantity;

  // Créer le mouvement
  const movement = await StockMovement.create({
    type: 'in',
    product: productId,
    quantity,
    unit: product.unit,
    stockBefore,
    stockAfter,
    warehouseTo: warehouseId,
    unitCost: unitCost || product.purchasePrice,
    reason,
    reference,
    referenceType,
    referenceId,
    company: product.company,
    createdBy: userId,
    movementDate: new Date(),
  });

  // Mettre à jour le stock du produit
  product.currentStock = stockAfter;
  await product.save();

  logger.info(`Entrée de stock: ${product.name} +${quantity} ${product.unit}`);

  return movement;
};

/**
 * Enregistrer une sortie de stock
 * @param {object} movementData - Données du mouvement
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<object>} Mouvement créé
 */
export const recordStockOut = async (movementData, userId) => {
  const { productId, quantity, warehouseId, reason, reference, referenceType, referenceId } = movementData;

  // Récupérer le produit
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error('Produit non trouvé');
  }

  if (!product.trackStock) {
    throw new Error('Ce produit ne gère pas le stock');
  }

  // Vérifier la disponibilité
  if (product.currentStock < quantity) {
    throw new Error(`Stock insuffisant. Disponible: ${product.currentStock} ${product.unit}`);
  }

  const stockBefore = product.currentStock;
  const stockAfter = stockBefore - quantity;

  // Créer le mouvement
  const movement = await StockMovement.create({
    type: 'out',
    product: productId,
    quantity,
    unit: product.unit,
    stockBefore,
    stockAfter,
    warehouseFrom: warehouseId,
    unitCost: product.purchasePrice,
    reason,
    reference,
    referenceType,
    referenceId,
    company: product.company,
    createdBy: userId,
    movementDate: new Date(),
  });

  // Mettre à jour le stock du produit
  product.currentStock = stockAfter;
  await product.save();

  logger.info(`Sortie de stock: ${product.name} -${quantity} ${product.unit}`);

  return movement;
};

/**
 * Effectuer un transfert de stock entre entrepôts
 * @param {object} transferData - Données du transfert
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<object>} Mouvement créé
 */
export const transferStock = async (transferData, userId) => {
  const { productId, quantity, warehouseFromId, warehouseToId, reason } = transferData;

  // Vérifier que les entrepôts sont différents
  if (warehouseFromId === warehouseToId) {
    throw new Error('Les entrepôts source et destination doivent être différents');
  }

  // Récupérer le produit
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error('Produit non trouvé');
  }

  // Note: Dans une implémentation complète, il faudrait gérer le stock par entrepôt
  // Pour simplifier, on utilise le stock global du produit

  const stockBefore = product.currentStock;

  // Créer le mouvement de transfert
  const movement = await StockMovement.create({
    type: 'transfer',
    product: productId,
    quantity,
    unit: product.unit,
    stockBefore,
    stockAfter: stockBefore, // Le stock global ne change pas
    warehouseFrom: warehouseFromId,
    warehouseTo: warehouseToId,
    unitCost: product.purchasePrice,
    reason,
    company: product.company,
    createdBy: userId,
    movementDate: new Date(),
  });

  logger.info(`Transfert de stock: ${product.name} ${quantity} ${product.unit} entre entrepôts`);

  return movement;
};

/**
 * Ajuster le stock (inventaire)
 * @param {object} adjustmentData - Données de l'ajustement
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<object>} Mouvement créé
 */
export const adjustStock = async (adjustmentData, userId) => {
  const { productId, newStock, reason } = adjustmentData;

  // Récupérer le produit
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error('Produit non trouvé');
  }

  if (!product.trackStock) {
    throw new Error('Ce produit ne gère pas le stock');
  }

  const stockBefore = product.currentStock;
  const difference = newStock - stockBefore;

  if (difference === 0) {
    throw new Error('Aucune différence de stock à ajuster');
  }

  // Créer le mouvement
  const movement = await StockMovement.create({
    type: 'adjustment',
    product: productId,
    quantity: Math.abs(difference),
    unit: product.unit,
    stockBefore,
    stockAfter: newStock,
    unitCost: product.purchasePrice,
    reason: reason || 'Ajustement inventaire',
    company: product.company,
    createdBy: userId,
    movementDate: new Date(),
  });

  // Mettre à jour le stock du produit
  product.currentStock = newStock;
  await product.save();

  logger.info(`Ajustement de stock: ${product.name} ${stockBefore} → ${newStock} ${product.unit}`);

  return movement;
};

/**
 * Obtenir l'historique des mouvements d'un produit
 * @param {string} productId - ID du produit
 * @param {number} limit - Nombre de mouvements
 * @returns {Promise<array>} Historique des mouvements
 */
export const getProductMovementHistory = async (productId, limit = 50) => {
  return StockMovement.getProductHistory(productId, limit);
};

/**
 * Obtenir la liste des produits en stock bas
 * @param {string} companyId - ID de l'entreprise
 * @returns {Promise<array>} Produits en stock bas
 */
export const getLowStockProducts = async (companyId) => {
  return Product.find({
    company: companyId,
    trackStock: true,
    isActive: true,
    $expr: { $lte: ['$currentStock', '$reorderLevel'] },
  }).sort({ currentStock: 1 });
};

/**
 * Obtenir la liste des produits en rupture
 * @param {string} companyId - ID de l'entreprise
 * @returns {Promise<array>} Produits en rupture
 */
export const getOutOfStockProducts = async (companyId) => {
  return Product.findOutOfStock(companyId);
};

/**
 * Calculer la valeur totale du stock
 * @param {string} companyId - ID de l'entreprise
 * @returns {Promise<object>} Valeur du stock
 */
export const calculateStockValue = async (companyId) => {
  const products = await Product.find({
    company: companyId,
    trackStock: true,
    isActive: true,
  });

  let totalValue = 0;
  let totalItems = 0;

  for (const product of products) {
    const value = product.currentStock * product.purchasePrice;
    totalValue += value;
    totalItems += product.currentStock;
  }

  return {
    totalValue,
    totalItems,
    productCount: products.length,
  };
};

/**
 * Générer un rapport d'inventaire
 * @param {string} companyId - ID de l'entreprise
 * @returns {Promise<array>} Rapport d'inventaire
 */
export const generateInventoryReport = async (companyId) => {
  const products = await Product.find({
    company: companyId,
    trackStock: true,
    isActive: true,
  })
    .populate('category', 'name')
    .sort({ name: 1 });

  return products.map((product) => ({
    code: product.code,
    name: product.name,
    category: product.category?.name || 'Non catégorisé',
    currentStock: product.currentStock,
    unit: product.unit,
    reorderLevel: product.reorderLevel,
    purchasePrice: product.purchasePrice,
    stockValue: product.currentStock * product.purchasePrice,
    status: product.currentStock === 0 ? 'rupture' : product.currentStock <= product.reorderLevel ? 'bas' : 'ok',
  }));
};

export default {
  recordStockIn,
  recordStockOut,
  transferStock,
  adjustStock,
  getProductMovementHistory,
  getLowStockProducts,
  getOutOfStockProducts,
  calculateStockValue,
  generateInventoryReport,
};
