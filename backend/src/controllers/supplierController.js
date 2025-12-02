/**
 * Controller Supplier - Gestion des fournisseurs
 */

import Supplier from '../models/Supplier.js';
import { AppError } from '../middlewares/errorMiddleware.js';
import { formatPaginatedResponse, getPaginationParams } from '../utils/helpers.js';

export const getSuppliers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, category } = req.query;
    const { skip, limit: pageLimit } = getPaginationParams(page, limit);

    const filter = { company: req.user.company, isActive: true };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { supplierNumber: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) filter.category = category;

    const suppliers = await Supplier.find(filter)
      .skip(skip)
      .limit(pageLimit)
      .sort({ createdAt: -1 });

    const total = await Supplier.countDocuments(filter);

    res.json(formatPaginatedResponse(suppliers, total, page, limit));
  } catch (error) {
    next(error);
  }
};

export const getSupplierById = async (req, res, next) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      throw new AppError('Fournisseur non trouvé', 404);
    }

    res.json({ success: true, data: supplier });
  } catch (error) {
    next(error);
  }
};

export const createSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.create({
      ...req.body,
      company: req.user.company,
    });

    res.status(201).json({
      success: true,
      message: 'Fournisseur créé avec succès',
      data: supplier,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!supplier) {
      throw new AppError('Fournisseur non trouvé', 404);
    }

    res.json({
      success: true,
      message: 'Fournisseur mis à jour avec succès',
      data: supplier,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      throw new AppError('Fournisseur non trouvé', 404);
    }

    supplier.isActive = false;
    await supplier.save();

    res.json({
      success: true,
      message: 'Fournisseur supprimé avec succès',
    });
  } catch (error) {
    next(error);
  }
};

export const getTopSuppliers = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const suppliers = await Supplier.findTopSuppliers(req.user.company, parseInt(limit));

    res.json({
      success: true,
      data: suppliers,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getTopSuppliers,
};
