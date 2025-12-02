/**
 * Controller Category - Gestion des catégories de produits
 */

import Category from '../models/Category.js';
import { AppError } from '../middlewares/errorMiddleware.js';
import { formatPaginatedResponse, getPaginationParams } from '../utils/helpers.js';

export const getCategories = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, search, parentId } = req.query;
    const { skip, limit: pageLimit } = getPaginationParams(page, limit);

    const filter = { company: req.user.company, isActive: true };

    if (search) filter.name = { $regex: search, $options: 'i' };
    if (parentId) filter.parent = parentId === 'null' ? null : parentId;

    const categories = await Category.find(filter)
      .populate('parent', 'name')
      .skip(skip)
      .limit(pageLimit)
      .sort({ order: 1, name: 1 });

    const total = await Category.countDocuments(filter);

    res.json(formatPaginatedResponse(categories, total, page, limit));
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id).populate('parent', 'name');

    if (!category) {
      throw new AppError('Catégorie non trouvée', 404);
    }

    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const category = await Category.create({
      ...req.body,
      company: req.user.company,
    });

    res.status(201).json({
      success: true,
      message: 'Catégorie créée avec succès',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) {
      throw new AppError('Catégorie non trouvée', 404);
    }

    res.json({
      success: true,
      message: 'Catégorie mise à jour avec succès',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      throw new AppError('Catégorie non trouvée', 404);
    }

    category.isActive = false;
    await category.save();

    res.json({
      success: true,
      message: 'Catégorie supprimée avec succès',
    });
  } catch (error) {
    next(error);
  }
};

export const getRootCategories = async (req, res, next) => {
  try {
    const categories = await Category.findRoots(req.user.company);

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getRootCategories,
};
