import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Card, Button, Alert, Select, Loader } from '../../components/common';
import { DataTable } from '../../components/tables';
import { StockChart } from '../../components/charts';
import { setBreadcrumb } from '../../store/slices/uiSlice';
import reportService from '../../services/reportService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { exportToExcel, exportToPDF } from '../../utils';

/**
 * Inventory Report Page
 * Displays comprehensive inventory reports and analytics
 */
const InventoryReport = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportType, setReportType] = useState('stock');
  const [dateRange, setDateRange] = useState('month');
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    dispatch(setBreadcrumb([
      { label: 'Inventaire', path: '/dashboard/inventory' },
      { label: 'Rapports' }
    ]));
  }, [dispatch]);

  useEffect(() => {
    loadReport();
  }, [reportType, dateRange]);

  const loadReport = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await reportService.getInventoryReport({
        type: reportType,
        dateRange,
      });
      setReportData(response.data);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement du rapport');
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = () => {
    if (!reportData) return;
    exportToExcel(reportData.items, `rapport-inventaire-${formatDate(new Date())}`);
  };

  const handleExportPDF = () => {
    if (!reportData) return;
    exportToPDF(reportData.items, `rapport-inventaire-${formatDate(new Date())}`);
  };

  const stockColumns = [
    {
      header: 'Produit',
      accessor: 'name',
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{row.name}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{row.sku}</div>
        </div>
      ),
    },
    {
      header: 'Catégorie',
      accessor: 'category',
      width: '140px',
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {row.category?.name || '-'}
        </span>
      ),
    },
    {
      header: 'Stock',
      accessor: 'stockQuantity',
      width: '100px',
      cellClassName: 'text-center',
      render: (row) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {row.stockQuantity}
        </span>
      ),
    },
    {
      header: 'Min/Max',
      accessor: 'stockLevels',
      width: '100px',
      cellClassName: 'text-center',
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {row.minStockLevel} / {row.maxStockLevel || '-'}
        </span>
      ),
    },
    {
      header: 'Valeur',
      accessor: 'value',
      width: '140px',
      render: (row) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          {formatCurrency(row.stockQuantity * row.purchasePrice)}
        </span>
      ),
    },
    {
      header: 'Statut',
      accessor: 'status',
      width: '120px',
      cellClassName: 'text-center',
      render: (row) => {
        if (row.stockQuantity === 0) {
          return <span className="text-red-600 dark:text-red-400 font-medium">Rupture</span>;
        } else if (row.stockQuantity <= row.minStockLevel) {
          return <span className="text-yellow-600 dark:text-yellow-400 font-medium">Faible</span>;
        } else {
          return <span className="text-green-600 dark:text-green-400 font-medium">Normal</span>;
        }
      },
    },
  ];

  const valuationColumns = [
    {
      header: 'Produit',
      accessor: 'name',
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{row.name}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{row.sku}</div>
        </div>
      ),
    },
    {
      header: 'Quantité',
      accessor: 'stockQuantity',
      width: '100px',
      cellClassName: 'text-center',
      render: (row) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {row.stockQuantity}
        </span>
      ),
    },
    {
      header: 'Prix d\'achat',
      accessor: 'purchasePrice',
      width: '140px',
      render: (row) => (
        <span className="text-gray-900 dark:text-white">
          {formatCurrency(row.purchasePrice)}
        </span>
      ),
    },
    {
      header: 'Valeur stock',
      accessor: 'stockValue',
      width: '140px',
      render: (row) => (
        <span className="font-semibold text-blue-600 dark:text-blue-400">
          {formatCurrency(row.stockQuantity * row.purchasePrice)}
        </span>
      ),
    },
    {
      header: 'Prix vente',
      accessor: 'sellingPrice',
      width: '140px',
      render: (row) => (
        <span className="text-gray-900 dark:text-white">
          {formatCurrency(row.sellingPrice)}
        </span>
      ),
    },
    {
      header: 'Valeur potentielle',
      accessor: 'potentialValue',
      width: '140px',
      render: (row) => (
        <span className="font-semibold text-green-600 dark:text-green-400">
          {formatCurrency(row.stockQuantity * row.sellingPrice)}
        </span>
      ),
    },
  ];

  if (loading && !reportData) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Rapports d'inventaire
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Analyses et statistiques de votre inventaire
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleExportExcel}
            disabled={!reportData}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            }
          >
            Excel
          </Button>
          <Button
            variant="outline"
            onClick={handleExportPDF}
            disabled={!reportData}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            }
          >
            PDF
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type de rapport
            </label>
            <Select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="stock">État des stocks</option>
              <option value="valuation">Valorisation</option>
              <option value="lowStock">Stocks faibles</option>
              <option value="outOfStock">Ruptures de stock</option>
            </Select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Période
            </label>
            <Select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="today">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="year">Cette année</option>
              <option value="all">Toutes les périodes</option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Summary Stats */}
      {reportData?.summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total produits</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {reportData.summary.totalProducts}
            </p>
          </Card>
          <Card className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Valeur stock</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(reportData.summary.totalValue)}
            </p>
          </Card>
          <Card className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Alertes stock</p>
            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
              {reportData.summary.lowStockCount}
            </p>
          </Card>
          <Card className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Ruptures</p>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">
              {reportData.summary.outOfStockCount}
            </p>
          </Card>
        </div>
      )}

      {/* Charts */}
      {reportData?.chartData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StockChart data={reportData.chartData} loading={loading} />
          <Card title="Top 10 produits par valeur">
            <div className="space-y-3">
              {reportData.topProducts?.slice(0, 10).map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {product.stockQuantity} unités
                    </p>
                  </div>
                  <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                    {formatCurrency(product.value)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Report Table */}
      {reportData?.items && (
        <Card title={`Rapport détaillé (${reportData.items.length} produits)`}>
          <DataTable
            columns={reportType === 'valuation' ? valuationColumns : stockColumns}
            data={reportData.items}
            loading={loading}
            emptyMessage="Aucune donnée disponible"
          />
        </Card>
      )}
    </div>
  );
};

export default InventoryReport;
