/**
 * Service de génération de rapports
 * Rapports statistiques et analytiques
 */

import Invoice from '../models/Invoice.js';
import Payment from '../models/Payment.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import Supplier from '../models/Supplier.js';
import { startOfMonth, endOfMonth, startOfYear, endOfYear } from '../utils/dateFormatter.js';

/**
 * Générer le rapport de ventes
 * @param {string} companyId - ID de l'entreprise
 * @param {Date} startDate - Date de début
 * @param {Date} endDate - Date de fin
 * @returns {Promise<object>} Rapport de ventes
 */
export const generateSalesReport = async (companyId, startDate, endDate) => {
  const invoices = await Invoice.find({
    company: companyId,
    type: 'sale',
    status: { $ne: 'cancelled' },
    date: { $gte: startDate, $lte: endDate },
  })
    .populate('customer', 'name')
    .sort({ date: -1 });

  const totalSales = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalPaid = invoices.reduce((sum, inv) => sum + inv.amountPaid, 0);
  const totalDue = invoices.reduce((sum, inv) => sum + inv.amountDue, 0);

  // Ventes par statut
  const salesByStatus = invoices.reduce((acc, inv) => {
    acc[inv.status] = (acc[inv.status] || 0) + inv.total;
    return acc;
  }, {});

  // Meilleurs clients
  const customerSales = invoices.reduce((acc, inv) => {
    const customerId = inv.customer?._id?.toString() || 'unknown';
    if (!acc[customerId]) {
      acc[customerId] = {
        customer: inv.customer?.name || 'Inconnu',
        total: 0,
        count: 0,
      };
    }
    acc[customerId].total += inv.total;
    acc[customerId].count += 1;
    return acc;
  }, {});

  const topCustomers = Object.values(customerSales)
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  return {
    period: { startDate, endDate },
    summary: {
      totalSales,
      totalPaid,
      totalDue,
      invoiceCount: invoices.length,
      averageInvoice: invoices.length > 0 ? totalSales / invoices.length : 0,
    },
    salesByStatus,
    topCustomers,
    invoices,
  };
};

/**
 * Générer le rapport de trésorerie
 * @param {string} companyId - ID de l'entreprise
 * @param {Date} startDate - Date de début
 * @param {Date} endDate - Date de fin
 * @returns {Promise<object>} Rapport de trésorerie
 */
export const generateCashFlowReport = async (companyId, startDate, endDate) => {
  const payments = await Payment.find({
    company: companyId,
    status: 'completed',
    date: { $gte: startDate, $lte: endDate },
  }).sort({ date: -1 });

  let totalIncome = 0;
  let totalExpense = 0;

  const incomeByMethod = {};
  const expenseByMethod = {};

  payments.forEach((payment) => {
    if (payment.type === 'customer_payment' || payment.type === 'income') {
      totalIncome += payment.amount;
      incomeByMethod[payment.method] = (incomeByMethod[payment.method] || 0) + payment.amount;
    } else {
      totalExpense += payment.amount;
      expenseByMethod[payment.method] = (expenseByMethod[payment.method] || 0) + payment.amount;
    }
  });

  const netCashFlow = totalIncome - totalExpense;

  return {
    period: { startDate, endDate },
    summary: {
      totalIncome,
      totalExpense,
      netCashFlow,
      paymentCount: payments.length,
    },
    incomeByMethod,
    expenseByMethod,
    payments,
  };
};

/**
 * Générer le rapport de stock
 * @param {string} companyId - ID de l'entreprise
 * @returns {Promise<object>} Rapport de stock
 */
export const generateStockReport = async (companyId) => {
  const products = await Product.find({
    company: companyId,
    trackStock: true,
    isActive: true,
  }).populate('category', 'name');

  let totalStockValue = 0;
  let totalProducts = products.length;
  let lowStockCount = 0;
  let outOfStockCount = 0;

  const stockByCategory = {};

  products.forEach((product) => {
    const stockValue = product.currentStock * product.purchasePrice;
    totalStockValue += stockValue;

    if (product.currentStock === 0) {
      outOfStockCount++;
    } else if (product.currentStock <= product.reorderLevel) {
      lowStockCount++;
    }

    const categoryName = product.category?.name || 'Non catégorisé';
    if (!stockByCategory[categoryName]) {
      stockByCategory[categoryName] = {
        count: 0,
        value: 0,
      };
    }
    stockByCategory[categoryName].count += 1;
    stockByCategory[categoryName].value += stockValue;
  });

  return {
    summary: {
      totalProducts,
      totalStockValue,
      lowStockCount,
      outOfStockCount,
      okStockCount: totalProducts - lowStockCount - outOfStockCount,
    },
    stockByCategory,
    products: products.map((p) => ({
      code: p.code,
      name: p.name,
      category: p.category?.name,
      currentStock: p.currentStock,
      unit: p.unit,
      purchasePrice: p.purchasePrice,
      stockValue: p.currentStock * p.purchasePrice,
      status: p.isOutOfStock ? 'rupture' : p.isLowStock ? 'bas' : 'ok',
    })),
  };
};

/**
 * Générer le tableau de bord
 * @param {string} companyId - ID de l'entreprise
 * @returns {Promise<object>} Données du tableau de bord
 */
export const generateDashboard = async (companyId) => {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const yearStart = startOfYear(now);
  const yearEnd = endOfYear(now);

  // Ventes du mois
  const monthlySales = await Invoice.calculateRevenue(companyId, monthStart, monthEnd);

  // Ventes de l'année
  const yearlySales = await Invoice.calculateRevenue(companyId, yearStart, yearEnd);

  // Trésorerie du mois
  const monthlyCashFlow = await Payment.calculateTotals(companyId, monthStart, monthEnd);

  // Factures en retard
  const overdueInvoices = await Invoice.findOverdue(companyId);

  // Produits en stock bas
  const lowStockProducts = await Product.find({
    company: companyId,
    trackStock: true,
    isActive: true,
    $expr: { $lte: ['$currentStock', '$reorderLevel'] },
  }).limit(10);

  // Statistiques clients
  const totalCustomers = await Customer.countDocuments({ company: companyId, isActive: true });
  const customersWithBalance = await Customer.countDocuments({
    company: companyId,
    isActive: true,
    balance: { $gt: 0 },
  });

  return {
    sales: {
      monthly: {
        total: monthlySales.totalRevenue,
        paid: monthlySales.totalPaid,
        count: monthlySales.count,
      },
      yearly: {
        total: yearlySales.totalRevenue,
        paid: yearlySales.totalPaid,
        count: yearlySales.count,
      },
    },
    cashFlow: {
      monthly: monthlyCashFlow,
    },
    invoices: {
      overdueCount: overdueInvoices.length,
      overdueAmount: overdueInvoices.reduce((sum, inv) => sum + inv.amountDue, 0),
    },
    stock: {
      lowStockCount: lowStockProducts.length,
    },
    customers: {
      total: totalCustomers,
      withBalance: customersWithBalance,
    },
    alerts: {
      overdueInvoices: overdueInvoices.slice(0, 5),
      lowStockProducts: lowStockProducts.slice(0, 5),
    },
  };
};

/**
 * Générer le rapport de rentabilité
 * @param {string} companyId - ID de l'entreprise
 * @param {Date} startDate - Date de début
 * @param {Date} endDate - Date de fin
 * @returns {Promise<object>} Rapport de rentabilité
 */
export const generateProfitabilityReport = async (companyId, startDate, endDate) => {
  // Factures de vente
  const sales = await Invoice.find({
    company: companyId,
    type: 'sale',
    status: { $ne: 'cancelled' },
    date: { $gte: startDate, $lte: endDate },
  }).populate('items.product');

  let totalRevenue = 0;
  let totalCost = 0;

  sales.forEach((invoice) => {
    totalRevenue += invoice.total;

    invoice.items.forEach((item) => {
      const purchasePrice = item.product?.purchasePrice || 0;
      totalCost += item.quantity * purchasePrice;
    });
  });

  const grossProfit = totalRevenue - totalCost;
  const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

  return {
    period: { startDate, endDate },
    summary: {
      totalRevenue,
      totalCost,
      grossProfit,
      profitMargin,
    },
  };
};

export default {
  generateSalesReport,
  generateCashFlowReport,
  generateStockReport,
  generateDashboard,
  generateProfitabilityReport,
};
