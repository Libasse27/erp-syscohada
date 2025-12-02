/**
 * Controller Product - Gestion des produits
 */

import Product from '../models/Product.js';
import { AppError } from '../middlewares/errorMiddleware.js';
import { formatPaginatedResponse, getPaginationParams } from '../utils/helpers.js';

export const getProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, category, type, isActive, lowStock } = req.query;
    const { skip, limit: pageLimit } = getPaginationParams(page, limit);

    const filter = { company: req.user.company };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { barcode: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) filter.category = category;
    if (type) filter.type = type;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (lowStock === 'true') filter.$expr = { $lte: ['$currentStock', '$reorderLevel'] };

    const products = await Product.find(filter)
      .populate('category', 'name')
      .populate('defaultSupplier', 'name')
      .skip(skip)
      .limit(pageLimit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(filter);

    res.json(formatPaginatedResponse(products, total, page, limit));
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name')
      .populate('defaultSupplier', 'name');

    if (!product) {
      throw new AppError('Produit non trouvé', 404);
    }

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create({
      ...req.body,
      company: req.user.company,
    });

    res.status(201).json({
      success: true,
      message: 'Produit créé avec succès',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      throw new AppError('Produit non trouvé', 404);
    }

    res.json({
      success: true,
      message: 'Produit mis à jour avec succès',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new AppError('Produit non trouvé', 404);
    }

    product.isActive = false;
    await product.save();

    res.json({
      success: true,
      message: 'Produit supprimé avec succès',
    });
  } catch (error) {
    next(error);
  }
};

export const adjustProductStock = async (req, res, next) => {
  try {
    const { quantity, reason } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new AppError('Produit non trouvé', 404);
    }

    await product.adjustStock(quantity, reason);

    res.json({
      success: true,
      message: 'Stock ajusté avec succès',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  adjustProductStock,
};
