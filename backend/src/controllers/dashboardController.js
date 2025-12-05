/**
 * Controller Dashboard - Données du tableau de bord
 */

import { AppError } from '../middlewares/errorMiddleware.js';
import { generateDashboard } from '../services/reportService.js';
import Invoice from '../models/Invoice.js';
import Payment from '../models/Payment.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import { startOfMonth, endOfMonth, startOfYear, endOfYear } from '../utils/dateFormatter.js';

export const getDashboard = async (req, res, next) => {
  try {
    const dashboard = await generateDashboard(req.user.company);

    res.json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    next(error);
  }
};

export const getSalesOverview = async (req, res, next) => {
  try {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    // Ventes du mois
    const monthlySales = await Invoice.calculateRevenue(
      req.user.company,
      monthStart,
      monthEnd
    );

    // Ventes du mois précédent pour comparaison
    const lastMonthStart = startOfMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1));
    const lastMonthEnd = endOfMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1));
    const lastMonthSales = await Invoice.calculateRevenue(
      req.user.company,
      lastMonthStart,
      lastMonthEnd
    );

    // Calculer la variation
    const variation = lastMonthSales.totalRevenue > 0
      ? ((monthlySales.totalRevenue - lastMonthSales.totalRevenue) / lastMonthSales.totalRevenue) * 100
      : 0;

    res.json({
      success: true,
      data: {
        current: monthlySales,
        previous: lastMonthSales,
        variation,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCashFlowOverview = async (req, res, next) => {
  try {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const cashFlow = await Payment.calculateTotals(
      req.user.company,
      monthStart,
      monthEnd
    );

    res.json({
      success: true,
      data: cashFlow,
    });
  } catch (error) {
    next(error);
  }
};

export const getTopProducts = async (req, res, next) => {
  try {
    const { limit = 5 } = req.query;

    // Top produits les plus vendus
    const topProducts = await Invoice.aggregate([
      {
        $match: {
          company: req.user.company,
          type: 'sale',
          status: { $ne: 'cancelled' },
        },
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.unitPrice'] } },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      {
        $project: {
          name: '$product.name',
          code: '$product.code',
          totalQuantity: 1,
          totalRevenue: 1,
        },
      },
    ]);

    res.json({
      success: true,
      data: topProducts,
    });
  } catch (error) {
    next(error);
  }
};

export const getTopCustomers = async (req, res, next) => {
  try {
    const { limit = 5 } = req.query;

    // Utiliser une agrégation pour calculer le total des ventes par client
    const topCustomers = await Invoice.aggregate([
      {
        $match: {
          company: req.user.company,
          type: 'sale',
          status: { $ne: 'cancelled' },
        },
      },
      {
        $group: {
          _id: '$customer',
          totalRevenue: { $sum: '$total' },
          invoiceCount: { $sum: 1 },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'customers',
          localField: '_id',
          foreignField: '_id',
          as: 'customer',
        },
      },
      { $unwind: '$customer' },
      {
        $project: {
          _id: '$customer._id',
          firstName: '$customer.firstName',
          lastName: '$customer.lastName',
          companyName: '$customer.companyName',
          email: '$customer.email',
          totalRevenue: 1,
          invoiceCount: 1,
        },
      },
    ]);

    res.json({
      success: true,
      data: topCustomers,
    });
  } catch (error) {
    next(error);
  }
};

export const getRecentActivity = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    // Récentes factures
    const recentInvoices = await Invoice.find({
      company: req.user.company,
      status: { $ne: 'cancelled' },
    })
      .populate('customer', 'firstName lastName companyName')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    // Récents paiements
    const recentPayments = await Payment.find({
      company: req.user.company,
      status: 'completed',
    })
      .populate('customer', 'firstName lastName companyName')
      .populate('invoice', 'number')
      .sort({ date: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: {
        invoices: recentInvoices,
        payments: recentPayments,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAlerts = async (req, res, next) => {
  try {
    // Factures en retard
    const overdueInvoices = await Invoice.findOverdue(req.user.company);

    // Produits en rupture de stock
    const outOfStock = await Product.findOutOfStock(req.user.company);

    // Produits en stock bas
    const lowStock = await Product.find({
      company: req.user.company,
      trackStock: true,
      isActive: true,
      $expr: { $lte: ['$currentStock', '$reorderLevel'] },
    }).limit(10);

    res.json({
      success: true,
      data: {
        overdueInvoices: {
          count: overdueInvoices.length,
          total: overdueInvoices.reduce((sum, inv) => sum + inv.amountDue, 0),
          invoices: overdueInvoices.slice(0, 5),
        },
        outOfStock: {
          count: outOfStock.length,
          products: outOfStock.slice(0, 5),
        },
        lowStock: {
          count: lowStock.length,
          products: lowStock.slice(0, 5),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getSalesChart = async (req, res, next) => {
  try {
    const { period = 'month' } = req.query;
    const now = new Date();

    let startDate, groupBy;

    if (period === 'year') {
      startDate = startOfYear(now);
      groupBy = { year: { $year: '$date' }, month: { $month: '$date' } };
    } else {
      startDate = startOfMonth(now);
      groupBy = { year: { $year: '$date' }, month: { $month: '$date' }, day: { $dayOfMonth: '$date' } };
    }

    const salesData = await Invoice.aggregate([
      {
        $match: {
          company: req.user.company,
          type: 'sale',
          status: { $ne: 'cancelled' },
          date: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: groupBy,
          total: { $sum: '$total' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ]);

    res.json({
      success: true,
      data: salesData,
    });
  } catch (error) {
    next(error);
  }
};

export const getStats = async (req, res, next) => {
  try {
    const now = new Date();
    const yearStart = startOfYear(now);

    // Statistiques rapides
    const [totalCustomers, totalProducts, yearRevenue, pendingInvoices] = await Promise.all([
      Customer.countDocuments({ company: req.user.company, isActive: true }),
      Product.countDocuments({ company: req.user.company, isActive: true }),
      Invoice.calculateRevenue(req.user.company, yearStart, now),
      Invoice.countDocuments({
        company: req.user.company,
        status: 'pending',
      }),
    ]);

    res.json({
      success: true,
      data: {
        totalCustomers,
        totalProducts,
        yearRevenue: yearRevenue.totalRevenue,
        pendingInvoices,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getDashboard,
  getSalesOverview,
  getCashFlowOverview,
  getTopProducts,
  getTopCustomers,
  getRecentActivity,
  getAlerts,
  getSalesChart,
  getStats,
};
