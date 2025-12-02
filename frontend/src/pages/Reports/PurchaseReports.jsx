import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Card, Button, Select, Alert } from '../../components/common';
import { DataTable } from '../../components/tables';
import { RevenueChart } from '../../components/charts';
import { setBreadcrumb } from '../../store/slices/uiSlice';
import purchaseReportService from '../../services/purchaseReportService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { exportToPDF, exportToExcel } from '../../utils';

/**
 * Purchase Reports Page
 * Displays purchase statistics and analysis
 */
const PurchaseReports = () => {
  const dispatch = useDispatch();
  const [reportData, setReportData] = useState(null);
  const [purchasesBySupplier, setPurchasesBySupplier] = useState([]);
  const [purchasesByProduct, setPurchasesByProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('month');
  const [reportType, setReportType] = useState('summary');

  useEffect(() => {
    dispatch(setBreadcrumb([
      { label: 'Rapports', path: '/dashboard/reports' },
      { label: 'Rapports d\'achats' }
    ]));
  }, [dispatch]);

  useEffect(() => {
    loadPurchaseReport();
  }, [dateRange, reportType]);

  const loadPurchaseReport = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = { dateRange, reportType };
      const response = await purchaseReportService.getPurchaseReport(params);
      setReportData(response.data.summary);
      setPurchasesBySupplier(response.data.bySupplier || []);
      setPurchasesByProduct(response.data.byProduct || []);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement du rapport');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    const dataToExport = reportType === 'by-supplier' ? purchasesBySupplier : purchasesByProduct;
    if (!dataToExport || dataToExport.length === 0) return;
    exportToPDF(
      dataToExport,
      `rapport-achats-${formatDate(new Date())}`,
      'Rapport d\'Achats'
    );
  };

  const handleExportExcel = () => {
    const dataToExport = reportType === 'by-supplier' ? purchasesBySupplier : purchasesByProduct;
    if (!dataToExport || dataToExport.length === 0) return;
    exportToExcel(
      dataToExport,
      `rapport-achats-${formatDate(new Date())}`
    );
  };

  const supplierColumns = [
    {
      header: 'Fournisseur',
      accessor: 'supplierName',
      render: (row) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {row.supplierName}
        </span>
      ),
    },
    {
      header: 'Nombre de commandes',
      accessor: 'orderCount',
      width: '160px',
      cellClassName: 'text-center',
      render: (row) => (
        <span className="text-gray-900 dark:text-white">{row.orderCount}</span>
      ),
    },
    {
      header: 'Montant HT',
      accessor: 'totalHT',
      width: '140px',
      render: (row) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {formatCurrency(row.totalHT)}
        </span>
      ),
    },
    {
      header: 'TVA',
      accessor: 'totalTVA',
      width: '120px',
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-400">
          {formatCurrency(row.totalTVA)}
        </span>
      ),
    },
    {
      header: 'Montant TTC',
      accessor: 'totalTTC',
      width: '140px',
      render: (row) => (
        <span className="font-semibold text-red-600 dark:text-red-400">
          {formatCurrency(row.totalTTC)}
        </span>
      ),
    },
    {
      header: '% du total',
      accessor: 'percentage',
      width: '100px',
      cellClassName: 'text-center',
      render: (row) => (
        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
          {row.percentage?.toFixed(1)}%
        </span>
      ),
    },
  ];

  const productColumns = [
    {
      header: 'Produit',
      accessor: 'productName',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">
            {row.productName}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {row.productCode}
          </p>
        </div>
      ),
    },
    {
      header: 'Quantité',
      accessor: 'quantity',
      width: '100px',
      cellClassName: 'text-center',
      render: (row) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {row.quantity}
        </span>
      ),
    },
    {
      header: 'Prix moyen',
      accessor: 'averagePrice',
      width: '120px',
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-400">
          {formatCurrency(row.averagePrice)}
        </span>
      ),
    },
    {
      header: 'Montant HT',
      accessor: 'totalHT',
      width: '140px',
      render: (row) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {formatCurrency(row.totalHT)}
        </span>
      ),
    },
    {
      header: 'Montant TTC',
      accessor: 'totalTTC',
      width: '140px',
      render: (row) => (
        <span className="font-semibold text-red-600 dark:text-red-400">
          {formatCurrency(row.totalTTC)}
        </span>
      ),
    },
    {
      header: '% du total',
      accessor: 'percentage',
      width: '100px',
      cellClassName: 'text-center',
      render: (row) => (
        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
          {row.percentage?.toFixed(1)}%
        </span>
      ),
    },
  ];

  const chartData = reportData?.chartData || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Rapports d&apos;achats
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Statistiques et analyses des achats
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleExportExcel}
            disabled={loading}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Excel
          </Button>
          <Button
            variant="outline"
            onClick={handleExportPDF}
            disabled={loading}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            PDF
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger" onClose={() => setError(null)}>{error}</Alert>}

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Période</label>
            <Select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
              <option value="today">Aujourd&apos;hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="quarter">Ce trimestre</option>
              <option value="year">Cette année</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Type de rapport</label>
            <Select value={reportType} onChange={(e) => setReportType(e.target.value)}>
              <option value="summary">Synthèse</option>
              <option value="by-supplier">Par fournisseur</option>
              <option value="by-product">Par produit</option>
            </Select>
          </div>
        </div>
      </Card>

      {reportData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-red-50 dark:bg-red-900/30">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total achats HT</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {formatCurrency(reportData.totalHT || 0)}
              </p>
            </Card>
            <Card className="bg-orange-50 dark:bg-orange-900/30">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total achats TTC</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {formatCurrency(reportData.totalTTC || 0)}
              </p>
            </Card>
            <Card className="bg-purple-50 dark:bg-purple-900/30">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Nombre de commandes</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {reportData.orderCount || 0}
              </p>
            </Card>
            <Card className="bg-blue-50 dark:bg-blue-900/30">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Panier moyen</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(reportData.averageBasket || 0)}
              </p>
            </Card>
          </div>

          {chartData.length > 0 && (
            <Card title="Évolution des achats">
              <RevenueChart data={chartData} />
            </Card>
          )}
        </>
      )}

      {reportType === 'by-supplier' && (
        <Card title="Achats par fournisseur">
          <DataTable
            columns={supplierColumns}
            data={purchasesBySupplier}
            loading={loading}
            emptyMessage="Aucune donnée"
          />
        </Card>
      )}

      {reportType === 'by-product' && (
        <Card title="Achats par produit">
          <DataTable
            columns={productColumns}
            data={purchasesByProduct}
            loading={loading}
            emptyMessage="Aucune donnée"
          />
        </Card>
      )}
    </div>
  );
};

export default PurchaseReports;
