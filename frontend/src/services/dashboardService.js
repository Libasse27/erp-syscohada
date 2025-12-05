/**
 * Service Dashboard - Gestion du tableau de bord et statistiques
 */

import api from './api';

const DASHBOARD_API = '/dashboard';

const dashboardService = {
  // Obtenir les statistiques globales
  getStats: async () => {
    const response = await api.get(`${DASHBOARD_API}/stats`);
    return response.data.data || response.data;
  },

  // Obtenir l'aperçu des ventes
  getSalesOverview: async (params = {}) => {
    const response = await api.get(`${DASHBOARD_API}/sales-overview`, { params });
    return response.data.data || response.data;
  },

  // Obtenir les alertes
  getAlerts: async () => {
    const response = await api.get(`${DASHBOARD_API}/alerts`);
    const data = response.data.data || response.data;

    // Transformer les alertes en format attendu par le frontend
    const alerts = [];

    if (data.overdueInvoices && data.overdueInvoices.count > 0) {
      alerts.push({
        type: 'danger',
        title: 'Factures en retard',
        message: `${data.overdueInvoices.count} facture(s) en retard pour un total de ${data.overdueInvoices.total} FCFA`,
        link: '/dashboard/sales/invoices',
      });
    }

    if (data.outOfStock && data.outOfStock.count > 0) {
      alerts.push({
        type: 'danger',
        title: 'Produits en rupture de stock',
        message: `${data.outOfStock.count} produit(s) en rupture de stock`,
        link: '/dashboard/inventory/products',
      });
    }

    if (data.lowStock && data.lowStock.count > 0) {
      alerts.push({
        type: 'warning',
        title: 'Stock bas',
        message: `${data.lowStock.count} produit(s) avec un stock bas`,
        link: '/dashboard/inventory/products',
      });
    }

    return alerts;
  },

  // Obtenir le graphique des ventes
  getSalesChart: async (params = {}) => {
    const response = await api.get(`${DASHBOARD_API}/sales-chart`, { params });
    const data = response.data.data || response.data;

    // Transformer les données en format attendu par le frontend
    const labels = [];
    const values = [];

    if (Array.isArray(data)) {
      data.forEach((item) => {
        if (item._id.day) {
          labels.push(`${item._id.day}/${item._id.month}`);
        } else {
          labels.push(`Mois ${item._id.month}`);
        }
        values.push(item.total || 0);
      });
    }

    return {
      labels,
      data: values,
    };
  },

  // Obtenir les activités récentes
  getRecentActivities: async (limit = 10) => {
    const response = await api.get(`${DASHBOARD_API}/recent-activity`, { params: { limit } });
    const data = response.data.data || response.data;

    // Combiner et formater les activités
    const activities = [];

    if (data.invoices && Array.isArray(data.invoices)) {
      data.invoices.forEach((invoice) => {
        activities.push({
          title: `Facture ${invoice.number}`,
          description: `Client: ${invoice.customer?.firstName} ${invoice.customer?.lastName || invoice.customer?.companyName || ''}`,
          date: invoice.createdAt,
          type: 'invoice',
        });
      });
    }

    if (data.payments && Array.isArray(data.payments)) {
      data.payments.forEach((payment) => {
        activities.push({
          title: `Paiement reçu`,
          description: `${payment.amount} FCFA - Facture ${payment.invoice?.number || ''}`,
          date: payment.date,
          type: 'payment',
        });
      });
    }

    // Trier par date décroissante
    activities.sort((a, b) => new Date(b.date) - new Date(a.date));

    return activities.slice(0, limit);
  },

  // Obtenir les KPIs (Indicateurs clés de performance)
  getKPIs: async (params = {}) => {
    const response = await api.get(`${DASHBOARD_API}/kpis`, { params });
    return response.data.data || response.data;
  },

  // Obtenir les produits les plus vendus
  getTopProducts: async (limit = 10) => {
    const response = await api.get(`${DASHBOARD_API}/top-products`, { params: { limit } });
    const data = response.data.data || response.data;

    // Transformer les données en format attendu
    if (Array.isArray(data)) {
      return data.map((item) => ({
        name: item.name,
        reference: item.code,
        quantity: item.totalQuantity || 0,
        amount: item.totalRevenue || 0,
      }));
    }

    return [];
  },

  // Obtenir les meilleurs clients
  getTopCustomers: async (limit = 10) => {
    const response = await api.get(`${DASHBOARD_API}/top-customers`, { params: { limit } });
    const data = response.data.data || response.data;

    // Transformer les données en format attendu
    if (Array.isArray(data)) {
      return data.map((customer) => ({
        name: customer.companyName || `${customer.firstName} ${customer.lastName}`,
        email: customer.email || '',
        ordersCount: customer.invoiceCount || 0,
        totalAmount: customer.totalRevenue || 0,
      }));
    }

    return [];
  },
};

export default dashboardService;
