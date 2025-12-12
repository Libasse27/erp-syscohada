import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, Badge } from '../../components/common';
import { SalesChart, RevenueChart, StockChart } from '../../components/charts';
import { DataTable } from '../../components/tables';
import { formatCurrency, formatDate } from '../../utils/formatters';
import dashboardService from '../../services/dashboardService';
import { setBreadcrumb } from '../../store/slices/uiSlice';

/**
 * Overview page - Main dashboard view
 * Displays key metrics, charts, and recent activity
 */
const Overview = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    sales: { today: 0, week: 0, month: 0, year: 0 },
    invoices: { total: 0, paid: 0, pending: 0, overdue: 0 },
    customers: { total: 0, active: 0, new: 0 },
    products: { total: 0, lowStock: 0, outOfStock: 0 },
  });
  const [salesData, setSalesData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [recentInvoices, setRecentInvoices] = useState([]);

  useEffect(() => {
    dispatch(setBreadcrumb([
      { label: 'Tableau de bord', path: '/dashboard' },
      { label: 'Vue d\'ensemble' }
    ]));
  }, [dispatch]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getOverview();

      setStats(data.stats);
      setSalesData(data.charts.sales);
      setRevenueData(data.charts.revenue);
      setStockData(data.charts.stock);
      setRecentInvoices(data.recentInvoices);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Ventes du jour',
      value: formatCurrency(stats.sales.today),
      icon: 'cart-check',
      bgColor: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgLightColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Factures en attente',
      value: stats.invoices.pending,
      icon: 'file-earmark-text',
      bgColor: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgLightColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      subtitle: `${stats.invoices.overdue} en retard`,
    },
    {
      title: 'Clients actifs',
      value: stats.customers.active,
      icon: 'people',
      bgColor: 'bg-green-500',
      textColor: 'text-green-600',
      bgLightColor: 'bg-green-50 dark:bg-green-900/20',
      subtitle: `${stats.customers.new} nouveaux ce mois`,
    },
    {
      title: 'Produits en stock',
      value: stats.products.total,
      icon: 'box-seam',
      bgColor: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgLightColor: 'bg-purple-50 dark:bg-purple-900/20',
      subtitle: `${stats.products.lowStock} en alerte`,
    },
  ];

  const invoiceColumns = [
    {
      header: 'N° Facture',
      accessor: 'invoiceNumber',
      width: '120px',
      render: (row) => (
        <Link
          to={`/dashboard/invoices/${row._id}`}
          className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          {row.invoiceNumber}
        </Link>
      ),
    },
    {
      header: 'Client',
      accessor: 'customer',
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {row.customer?.name || 'N/A'}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {row.customer?.email}
          </div>
        </div>
      ),
    },
    {
      header: 'Date',
      accessor: 'invoiceDate',
      width: '120px',
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {formatDate(row.invoiceDate)}
        </span>
      ),
    },
    {
      header: 'Montant',
      accessor: 'totalAmount',
      width: '140px',
      render: (row) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          {formatCurrency(row.totalAmount)}
        </span>
      ),
    },
    {
      header: 'Statut',
      accessor: 'status',
      width: '120px',
      cellClassName: 'text-center',
      render: (row) => {
        const variants = {
          draft: 'default',
          sent: 'info',
          paid: 'success',
          overdue: 'danger',
          cancelled: 'default',
        };
        const labels = {
          draft: 'Brouillon',
          sent: 'Envoyée',
          paid: 'Payée',
          overdue: 'En retard',
          cancelled: 'Annulée',
        };
        return (
          <Badge variant={variants[row.status] || 'default'}>
            {labels[row.status] || row.status}
          </Badge>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Bienvenue, {user?.firstName || user?.fullName} !
        </h1>
        <p className="text-blue-100">
          Voici un aperçu de votre activité commerciale
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {stat.title}
                </p>
                <h3 className={`text-2xl font-bold ${stat.textColor} dark:${stat.textColor}`}>
                  {stat.value}
                </h3>
                {stat.subtitle && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {stat.subtitle}
                  </p>
                )}
              </div>
              <div className={`${stat.bgLightColor} ${stat.textColor} p-3 rounded-lg`}>
                <i className={`bi bi-${stat.icon}`} style={{ fontSize: '2rem' }}></i>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart data={salesData} loading={loading} period="month" />
        <RevenueChart data={revenueData} loading={loading} />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card title="Factures récentes">
            <DataTable
              columns={invoiceColumns}
              data={recentInvoices}
              loading={loading}
              emptyMessage="Aucune facture récente"
            />
            {recentInvoices.length > 0 && (
              <div className="mt-4 text-center">
                <Link
                  to="/dashboard/invoices"
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                >
                  Voir toutes les factures →
                </Link>
              </div>
            )}
          </Card>
        </div>
        <div>
          <StockChart data={stockData} loading={loading} />
        </div>
      </div>

      {/* Quick Actions */}
      <Card title="Actions rapides">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/dashboard/invoices/new"
            className="flex flex-col items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
          >
            <i
              className="bi bi-file-earmark-plus text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform"
              style={{ fontSize: '2rem' }}
            ></i>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Nouvelle facture
            </span>
          </Link>

          <Link
            to="/dashboard/products/new"
            className="flex flex-col items-center justify-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors group"
          >
            <i
              className="bi bi-plus-circle text-green-600 dark:text-green-400 mb-2 group-hover:scale-110 transition-transform"
              style={{ fontSize: '2rem' }}
            ></i>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Nouveau produit
            </span>
          </Link>

          <Link
            to="/dashboard/customers/new"
            className="flex flex-col items-center justify-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors group"
          >
            <i
              className="bi bi-person-plus text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-110 transition-transform"
              style={{ fontSize: '2rem' }}
            ></i>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Nouveau client
            </span>
          </Link>

          <Link
            to="/dashboard/reports"
            className="flex flex-col items-center justify-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors group"
          >
            <i
              className="bi bi-graph-up text-yellow-600 dark:text-yellow-400 mb-2 group-hover:scale-110 transition-transform"
              style={{ fontSize: '2rem' }}
            ></i>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Rapports
            </span>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Overview;
