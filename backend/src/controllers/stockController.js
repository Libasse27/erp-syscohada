/**
 * Controller Stock - Gestion des mouvements de stock
 */

import StockMovement from '../models/StockMovement.js';
import { AppError } from '../middlewares/errorMiddleware.js';
import { formatPaginatedResponse, getPaginationParams } from '../utils/helpers.js';
import {
  recordStockIn,
  recordStockOut,
  transferStock,
  adjustStock,
  getLowStockProducts,
  getOutOfStockProducts,
  calculateStockValue,
  generateInventoryReport,
} from '../services/stockService.js';

export const getStockMovements = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, productId, type, dateFrom, dateTo } = req.query;
    const { skip, limit: pageLimit } = getPaginationParams(page, limit);

    const filter = { company: req.user.company };

    if (productId) filter.product = productId;
    if (type) filter.type = type;

    if (dateFrom || dateTo) {
      filter.movementDate = {};
      if (dateFrom) filter.movementDate.$gte = new Date(dateFrom);
      if (dateTo) filter.movementDate.$lte = new Date(dateTo);
    }

    const movements = await StockMovement.find(filter)
      .populate('product', 'name code unit')
      .populate('createdBy', 'firstName lastName')
      .skip(skip)
      .limit(pageLimit)
      .sort({ movementDate: -1 });

    const total = await StockMovement.countDocuments(filter);

    res.json(formatPaginatedResponse(movements, total, page, limit));
  } catch (error) {
    next(error);
  }
};

export const createStockIn = async (req, res, next) => {
  try {
    const movement = await recordStockIn(req.body, req.user.id);

    res.status(201).json({
      success: true,
      message: 'Entrée de stock enregistrée avec succès',
      data: movement,
    });
  } catch (error) {
    next(error);
  }
};

export const createStockOut = async (req, res, next) => {
  try {
    const movement = await recordStockOut(req.body, req.user.id);

    res.status(201).json({
      success: true,
      message: 'Sortie de stock enregistrée avec succès',
      data: movement,
    });
  } catch (error) {
    next(error);
  }
};

export const createTransfer = async (req, res, next) => {
  try {
    const movement = await transferStock(req.body, req.user.id);

    res.status(201).json({
      success: true,
      message: 'Transfert de stock effectué avec succès',
      data: movement,
    });
  } catch (error) {
    next(error);
  }
};

export const createAdjustment = async (req, res, next) => {
  try {
    const movement = await adjustStock(req.body, req.user.id);

    res.status(201).json({
      success: true,
      message: 'Ajustement de stock effectué avec succès',
      data: movement,
    });
  } catch (error) {
    next(error);
  }
};

export const getLowStock = async (req, res, next) => {
  try {
    const products = await getLowStockProducts(req.user.company);

    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

export const getOutOfStock = async (req, res, next) => {
  try {
    const products = await getOutOfStockProducts(req.user.company);

    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

export const getStockValue = async (req, res, next) => {
  try {
    const value = await calculateStockValue(req.user.company);

    res.json({
      success: true,
      data: value,
    });
  } catch (error) {
    next(error);
  }
};

export const getInventoryReport = async (req, res, next) => {
  try {
    const report = await generateInventoryReport(req.user.company);

    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getStockMovements,
  createStockIn,
  createStockOut,
  createTransfer,
  createAdjustment,
  getLowStock,
  getOutOfStock,
  getStockValue,
  getInventoryReport,
};
