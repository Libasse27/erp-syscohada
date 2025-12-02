/**
 * Controller Customer - Gestion des clients
 */

import Customer from '../models/Customer.js';
import { generateCustomerNumber } from '../utils/invoiceNumberGenerator.js';
import { AppError } from '../middlewares/errorMiddleware.js';
import { formatPaginatedResponse, getPaginationParams } from '../utils/helpers.js';

export const getCustomers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, type, category } = req.query;
    const { skip, limit: pageLimit } = getPaginationParams(page, limit);

    const filter = { company: req.user.company, isActive: true };

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { customerNumber: { $regex: search, $options: 'i' } },
      ];
    }

    if (type) filter.type = type;
    if (category) filter.category = category;

    const customers = await Customer.find(filter)
      .skip(skip)
      .limit(pageLimit)
      .sort({ createdAt: -1 });

    const total = await Customer.countDocuments(filter);

    res.json(formatPaginatedResponse(customers, total, page, limit));
  } catch (error) {
    next(error);
  }
};

export const getCustomerById = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      throw new AppError('Client non trouvé', 404);
    }

    res.json({ success: true, data: customer });
  } catch (error) {
    next(error);
  }
};

export const createCustomer = async (req, res, next) => {
  try {
    // Générer le numéro client
    const count = await Customer.countDocuments({ company: req.user.company });
    const customerNumber = generateCustomerNumber(count + 1);

    const customer = await Customer.create({
      ...req.body,
      customerNumber,
      company: req.user.company,
    });

    res.status(201).json({
      success: true,
      message: 'Client créé avec succès',
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!customer) {
      throw new AppError('Client non trouvé', 404);
    }

    res.json({
      success: true,
      message: 'Client mis à jour avec succès',
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      throw new AppError('Client non trouvé', 404);
    }

    customer.isActive = false;
    await customer.save();

    res.json({
      success: true,
      message: 'Client supprimé avec succès',
    });
  } catch (error) {
    next(error);
  }
};

export const getTopCustomers = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const customers = await Customer.findTopCustomers(req.user.company, parseInt(limit));

    res.json({
      success: true,
      data: customers,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getTopCustomers,
};
