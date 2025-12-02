/**
 * Controller User - Gestion des utilisateurs
 */

import User from '../models/User.js';
import { AppError } from '../middlewares/errorMiddleware.js';
import { formatPaginatedResponse, getPaginationParams } from '../utils/helpers.js';

/**
 * Obtenir tous les utilisateurs
 */
export const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, role, isActive } = req.query;
    const { skip, limit: pageLimit } = getPaginationParams(page, limit);

    // Construire le filtre
    const filter = { company: req.user.company };

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    // Récupérer les utilisateurs
    const users = await User.find(filter)
      .skip(skip)
      .limit(pageLimit)
      .sort({ createdAt: -1 })
      .select('-password -refreshToken');

    const total = await User.countDocuments(filter);

    res.json(formatPaginatedResponse(users, total, page, limit));
  } catch (error) {
    next(error);
  }
};

/**
 * Obtenir un utilisateur par ID
 */
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('company', 'name')
      .select('-password -refreshToken');

    if (!user) {
      throw new AppError('Utilisateur non trouvé', 404);
    }

    // Vérifier que l'utilisateur appartient à la même entreprise
    if (user.company._id.toString() !== req.user.company.toString() && req.user.role !== 'admin') {
      throw new AppError('Accès non autorisé', 403);
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Créer un utilisateur
 */
export const createUser = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, role, permissions, phone } = req.body;

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new AppError('Un utilisateur avec cet email existe déjà', 400);
    }

    // Créer l'utilisateur
    const user = await User.create({
      email: email.toLowerCase(),
      password,
      firstName,
      lastName,
      role: role || 'user',
      permissions: permissions || [],
      phone,
      company: req.user.company,
    });

    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      data: user.toPublicJSON(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mettre à jour un utilisateur
 */
export const updateUser = async (req, res, next) => {
  try {
    const { firstName, lastName, role, permissions, phone, isActive } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      throw new AppError('Utilisateur non trouvé', 404);
    }

    // Vérifier que l'utilisateur appartient à la même entreprise
    if (user.company.toString() !== req.user.company.toString() && req.user.role !== 'admin') {
      throw new AppError('Accès non autorisé', 403);
    }

    // Mettre à jour les champs
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (role) user.role = role;
    if (permissions) user.permissions = permissions;
    if (phone) user.phone = phone;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();

    res.json({
      success: true,
      message: 'Utilisateur mis à jour avec succès',
      data: user.toPublicJSON(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Supprimer un utilisateur (soft delete)
 */
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new AppError('Utilisateur non trouvé', 404);
    }

    // Vérifier que l'utilisateur appartient à la même entreprise
    if (user.company.toString() !== req.user.company.toString() && req.user.role !== 'admin') {
      throw new AppError('Accès non autorisé', 403);
    }

    // Soft delete
    user.isActive = false;
    await user.save();

    res.json({
      success: true,
      message: 'Utilisateur désactivé avec succès',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtenir le profil de l'utilisateur connecté
 */
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('company', 'name logo')
      .select('-password -refreshToken');

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mettre à jour le profil de l'utilisateur connecté
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, phone, avatar } = req.body;

    const user = await User.findById(req.user.id);

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.json({
      success: true,
      message: 'Profil mis à jour avec succès',
      data: user.toPublicJSON(),
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
};
