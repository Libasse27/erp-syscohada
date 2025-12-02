/**
 * Controller PurchaseOrder - Gestion des bons de commande
 */

import PurchaseOrder from '../models/PurchaseOrder.js';
import { AppError } from '../middlewares/errorMiddleware.js';
import { formatPaginatedResponse, getPaginationParams } from '../utils/helpers.js';
import { generateOrderNumber } from '../utils/invoiceNumberGenerator.js';
import { recordStockIn } from '../services/stockService.js';

export const getPurchaseOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, status, supplierId, dateFrom, dateTo } = req.query;
    const { skip, limit: pageLimit } = getPaginationParams(page, limit);

    const filter = { company: req.user.company };

    if (search) {
      filter.$or = [
        { number: { $regex: search, $options: 'i' } },
        { reference: { $regex: search, $options: 'i' } },
      ];
    }

    if (status) filter.status = status;
    if (supplierId) filter.supplier = supplierId;

    if (dateFrom || dateTo) {
      filter.orderDate = {};
      if (dateFrom) filter.orderDate.$gte = new Date(dateFrom);
      if (dateTo) filter.orderDate.$lte = new Date(dateTo);
    }

    const orders = await PurchaseOrder.find(filter)
      .populate('supplier', 'name email phone')
      .populate('items.product', 'name code')
      .skip(skip)
      .limit(pageLimit)
      .sort({ orderDate: -1 });

    const total = await PurchaseOrder.countDocuments(filter);

    res.json(formatPaginatedResponse(orders, total, page, limit));
  } catch (error) {
    next(error);
  }
};

export const getPurchaseOrderById = async (req, res, next) => {
  try {
    const order = await PurchaseOrder.findById(req.params.id)
      .populate('supplier', 'name email phone address')
      .populate('items.product', 'name code unit');

    if (!order) {
      throw new AppError('Bon de commande non trouvé', 404);
    }

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

export const createPurchaseOrder = async (req, res, next) => {
  try {
    // Générer le numéro de bon de commande
    const count = await PurchaseOrder.countDocuments({ company: req.user.company });
    const number = generateOrderNumber(count + 1);

    const order = await PurchaseOrder.create({
      ...req.body,
      number,
      company: req.user.company,
      createdBy: req.user.id,
    });

    const populatedOrder = await PurchaseOrder.findById(order._id)
      .populate('supplier', 'name email phone')
      .populate('items.product', 'name code');

    res.status(201).json({
      success: true,
      message: 'Bon de commande créé avec succès',
      data: populatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePurchaseOrder = async (req, res, next) => {
  try {
    const order = await PurchaseOrder.findById(req.params.id);

    if (!order) {
      throw new AppError('Bon de commande non trouvé', 404);
    }

    // Empêcher la modification si le bon est reçu
    if (order.status === 'received' && req.body.status !== 'received') {
      throw new AppError('Impossible de modifier un bon de commande reçu', 400);
    }

    const updatedOrder = await PurchaseOrder.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('supplier', 'name email phone')
      .populate('items.product', 'name code');

    res.json({
      success: true,
      message: 'Bon de commande mis à jour avec succès',
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePurchaseOrder = async (req, res, next) => {
  try {
    const order = await PurchaseOrder.findById(req.params.id);

    if (!order) {
      throw new AppError('Bon de commande non trouvé', 404);
    }

    // Empêcher la suppression si le bon est reçu
    if (order.status === 'received') {
      throw new AppError('Impossible de supprimer un bon de commande reçu', 400);
    }

    order.status = 'cancelled';
    await order.save();

    res.json({
      success: true,
      message: 'Bon de commande annulé avec succès',
    });
  } catch (error) {
    next(error);
  }
};

export const receivePurchaseOrder = async (req, res, next) => {
  try {
    const order = await PurchaseOrder.findById(req.params.id).populate('items.product');

    if (!order) {
      throw new AppError('Bon de commande non trouvé', 404);
    }

    if (order.status === 'received') {
      throw new AppError('Ce bon de commande a déjà été reçu', 400);
    }

    // Enregistrer les entrées de stock
    for (const item of order.items) {
      await recordStockIn({
        productId: item.product._id,
        quantity: item.quantity,
        unitCost: item.unitPrice,
        reason: `Réception - BC ${order.number}`,
        referenceType: 'purchase_order',
        referenceId: order._id,
      }, req.user.id);
    }

    order.status = 'received';
    order.receivedDate = new Date();
    await order.save();

    res.json({
      success: true,
      message: 'Bon de commande réceptionné avec succès',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const validatePurchaseOrder = async (req, res, next) => {
  try {
    const order = await PurchaseOrder.findById(req.params.id);

    if (!order) {
      throw new AppError('Bon de commande non trouvé', 404);
    }

    if (order.status !== 'draft') {
      throw new AppError('Seuls les bons brouillon peuvent être validés', 400);
    }

    order.status = 'approved';
    await order.save();

    res.json({
      success: true,
      message: 'Bon de commande validé avec succès',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getPurchaseOrders,
  getPurchaseOrderById,
  createPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
  receivePurchaseOrder,
  validatePurchaseOrder,
};
