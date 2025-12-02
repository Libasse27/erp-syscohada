import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Card, Button, Select, Alert, Badge } from '../../components/common';
import { DataTable } from '../../components/tables';
import { StockChart } from '../../components/charts';
import { setBreadcrumb } from '../../store/slices/uiSlice';
import stockReportService from '../../services/stockReportService';
import { formatCurrency } from '../../utils/formatters';
import { exportToPDF, exportToExcel } from '../../utils';

/**
 * Stock Reports Page
 * Displays stock valuation and movement analysis
 */
const StockReports = () => {
  const dispatch = useDispatch();
  const [reportData, setReportData] = useState(null);
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportType, setReportType] = useState('valuation');

  useEffect(() => {
    dispatch(setBreadcrumb([
      { label: 'Rapports', path: '/dashboard/reports' },
      { label: 'Rapports de stock' }
    ]));
  }, [dispatch]);

  useEffect(() => {
    loadStockReport();
  }, [reportType]);

  const loadStockReport = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = { reportType };
      const response = await stockReportService.getStockReport(params);
      setReportData(response.data.summary);
      setStockData(response.data.items || []);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement du rapport');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    if (!stockData || stockData.length === 0) return;
    exportToPDF(
      stockData,
      `rapport-stock-${reportType}`,
      'Rapport de Stock'
    );
  };

  const handleExportExcel = () => {
    if (!stockData || stockData.length === 0) return;
    exportToExcel(
      stockData,
      `rapport-stock-${reportType}`
    );
  };

  const valuationColumns = [
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
      header: 'Catégorie',
      accessor: 'category',
      width: '140px',
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {row.category}
        </span>
      ),
    },
    {
      header: 'Stock',
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
      header: 'Prix d\'achat',
      accessor: 'purchasePrice',
      width: '120px',
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-400">
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
          {formatCurrency(row.stockValue)}
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
          in_stock: 'success',
          low_stock: 'warning',
          out_of_stock: 'danger',
        };
        const labels = {
          in_stock: 'En stock',
          low_stock: 'Stock bas',
          out_of_stock: 'Rupture',
        };
        return (
          <Badge variant={variants[row.status] || 'default'}>
            {labels[row.status] || row.status}
          </Badge>
        );
      },
    },
  ];

  const movementColumns = [
    {
      header: 'Produit',
      accessor: 'productName',
      render: (row) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {row.productName}
        </span>
      ),
    },
    {
      header: 'Entrées',
      accessor: 'inbound',
      width: '100px',
      cellClassName: 'text-center',
      render: (row) => (
        <span className="font-medium text-green-600 dark:text-green-400">
          {row.inbound || 0}
        </span>
      ),
    },
    {
      header: 'Sorties',
      accessor: 'outbound',
      width: '100px',
      cellClassName: 'text-center',
      render: (row) => (
        <span className="font-medium text-red-600 dark:text-red-400">
          {row.outbound || 0}
        </span>
      ),
    },
    {
      header: 'Rotation',
      accessor: 'turnoverRate',
      width: '100px',
      cellClassName: 'text-center',
      render: (row) => (
        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
          {row.turnoverRate?.toFixed(1) || '0.0'}
        </span>
      ),
    },
    {
      header: 'Stock actuel',
      accessor: 'currentStock',
      width: '120px',
      cellClassName: 'text-center',
      render: (row) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          {row.currentStock || 0}
        </span>
      ),
    },
  ];

  const lowStockColumns = [
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
      header: 'Stock actuel',
      accessor: 'quantity',
      width: '120px',
      cellClassName: 'text-center',
      render: (row) => (
        <span className="font-bold text-orange-600 dark:text-orange-400">
          {row.quantity}
        </span>
      ),
    },
    {
      header: 'Seuil minimum',
      accessor: 'minStock',
      width: '140px',
      cellClassName: 'text-center',
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-400">
          {row.minStock}
        </span>
      ),
    },
    {
      header: 'À commander',
      accessor: 'toOrder',
      width: '120px',
      cellClassName: 'text-center',
      render: (row) => (
        <span className="font-bold text-red-600 dark:text-red-400">
          {row.toOrder || (row.minStock - row.quantity)}
        </span>
      ),
    },
    {
      header: 'Valeur manquante',
      accessor: 'missingValue',
      width: '140px',
      render: (row) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          {formatCurrency(row.missingValue || 0)}
        </span>
      ),
    },
  ];

  const getColumns = () => {
    switch (reportType) {
      case 'valuation':
        return valuationColumns;
      case 'movements':
        return movementColumns;
      case 'low-stock':
        return lowStockColumns;
      default:
        return valuationColumns;
    }
  };

  const chartData = reportData?.chartData || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Rapports de stock
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Valorisation et analyse des mouvements de stock
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
        <div>
          <label className="block text-sm font-medium mb-2">Type de rapport</label>
          <Select value={reportType} onChange={(e) => setReportType(e.target.value)}>
            <option value="valuation">Valorisation du stock</option>
            <option value="movements">Mouvements de stock</option>
            <option value="low-stock">Stock bas / Ruptures</option>
          </Select>
        </div>
      </Card>

      {reportData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-blue-50 dark:bg-blue-900/30">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Valeur totale du stock</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(reportData.totalValue || 0)}
              </p>
            </Card>
            <Card className="bg-green-50 dark:bg-green-900/30">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Produits en stock</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {reportData.inStockCount || 0}
              </p>
            </Card>
            <Card className="bg-orange-50 dark:bg-orange-900/30">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Stock bas</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {reportData.lowStockCount || 0}
              </p>
            </Card>
            <Card className="bg-red-50 dark:bg-red-900/30">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ruptures</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {reportData.outOfStockCount || 0}
              </p>
            </Card>
          </div>

          {chartData.length > 0 && (
            <Card title="Répartition de la valeur du stock">
              <StockChart data={chartData} />
            </Card>
          )}
        </>
      )}

      <Card title={
        reportType === 'valuation' ? 'Valorisation du stock' :
        reportType === 'movements' ? 'Mouvements de stock' :
        'Produits en stock bas'
      }>
        <DataTable
          columns={getColumns()}
          data={stockData}
          loading={loading}
          emptyMessage="Aucune donnée"
        />
      </Card>

      {reportType === 'low-stock' && reportData && (
        <Card className="border-l-4 border-orange-500">
          <div className="pl-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Recommandations
            </h3>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <p>
                <strong>{reportData.lowStockCount || 0}</strong> produit(s) nécessitent une attention immédiate.
              </p>
              <p>
                Valeur totale des stocks à reconstituer : <strong>{formatCurrency(reportData.totalMissingValue || 0)}</strong>
              </p>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-3">
                  Il est recommandé de passer des commandes pour éviter les ruptures de stock.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default StockReports;
