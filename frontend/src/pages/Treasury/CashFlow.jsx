import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Card, Button, Alert, Select } from '../../components/common';
import { DataTable } from '../../components/tables';
import { RevenueChart } from '../../components/charts';
import { setBreadcrumb } from '../../store/slices/uiSlice';
import cashFlowService from '../../services/cashFlowService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { exportToPDF, exportToExcel } from '../../utils';

/**
 * Cash Flow Page
 * Displays cash flow statement and analysis
 */
const CashFlow = () => {
  const dispatch = useDispatch();
  const [cashFlowData, setCashFlowData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('month');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    dispatch(setBreadcrumb([
      { label: 'Trésorerie', path: '/dashboard/treasury' },
      { label: 'Tableau de flux de trésorerie' }
    ]));
  }, [dispatch]);

  useEffect(() => {
    loadCashFlow();
  }, [dateRange, categoryFilter]);

  const loadCashFlow = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        dateRange,
        ...(categoryFilter !== 'all' && { category: categoryFilter }),
      };
      const response = await cashFlowService.getCashFlow(params);
      setCashFlowData(response.data.summary);
      setTransactions(response.data.transactions || []);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des flux de trésorerie');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    if (!transactions || transactions.length === 0) return;
    exportToPDF(
      transactions,
      `flux-tresorerie-${formatDate(new Date())}`,
      'Tableau de Flux de Trésorerie'
    );
  };

  const handleExportExcel = () => {
    if (!transactions || transactions.length === 0) return;
    exportToExcel(
      transactions,
      `flux-tresorerie-${formatDate(new Date())}`
    );
  };

  const columns = [
    {
      header: 'Date',
      accessor: 'date',
      width: '120px',
      render: (row) => <span className="text-sm">{formatDate(row.date)}</span>,
    },
    {
      header: 'Référence',
      accessor: 'reference',
      width: '140px',
      render: (row) => <span className="font-mono text-sm">{row.reference}</span>,
    },
    {
      header: 'Catégorie',
      accessor: 'category',
      width: '160px',
      render: (row) => {
        const categoryLabels = {
          operating: 'Activités opérationnelles',
          investing: 'Activités d\'investissement',
          financing: 'Activités de financement',
        };
        return (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {categoryLabels[row.category] || row.category}
          </span>
        );
      },
    },
    {
      header: 'Description',
      accessor: 'description',
      render: (row) => <span>{row.description}</span>,
    },
    {
      header: 'Encaissement',
      accessor: 'inflow',
      width: '140px',
      render: (row) => (
        <span className="font-medium text-green-600 dark:text-green-400">
          {row.inflow ? formatCurrency(row.inflow) : '-'}
        </span>
      ),
    },
    {
      header: 'Décaissement',
      accessor: 'outflow',
      width: '140px',
      render: (row) => (
        <span className="font-medium text-red-600 dark:text-red-400">
          {row.outflow ? formatCurrency(row.outflow) : '-'}
        </span>
      ),
    },
    {
      header: 'Solde',
      accessor: 'balance',
      width: '140px',
      render: (row) => (
        <span className={`font-semibold ${row.balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {formatCurrency(row.balance)}
        </span>
      ),
    },
  ];

  // Prepare chart data
  const chartData = transactions
    .reduce((acc, t) => {
      const dateKey = formatDate(t.date);
      const existing = acc.find(item => item.date === dateKey);
      if (existing) {
        existing.inflow += t.inflow || 0;
        existing.outflow += t.outflow || 0;
      } else {
        acc.push({
          date: dateKey,
          inflow: t.inflow || 0,
          outflow: t.outflow || 0,
        });
      }
      return acc;
    }, [])
    .slice(-30); // Last 30 data points

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Tableau de flux de trésorerie
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Analyse des entrées et sorties de trésorerie
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleExportExcel}
            disabled={!transactions || transactions.length === 0}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Excel
          </Button>
          <Button
            variant="outline"
            onClick={handleExportPDF}
            disabled={!transactions || transactions.length === 0}
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
            <label className="block text-sm font-medium mb-2">Catégorie</label>
            <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="all">Toutes les catégories</option>
              <option value="operating">Activités opérationnelles</option>
              <option value="investing">Activités d&apos;investissement</option>
              <option value="financing">Activités de financement</option>
            </Select>
          </div>
        </div>
      </Card>

      {cashFlowData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-blue-50 dark:bg-blue-900/30">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Solde initial</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(cashFlowData.openingBalance || 0)}
              </p>
            </Card>
            <Card className="bg-green-50 dark:bg-green-900/30">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total encaissements</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(cashFlowData.totalInflow || 0)}
              </p>
            </Card>
            <Card className="bg-red-50 dark:bg-red-900/30">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total décaissements</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {formatCurrency(cashFlowData.totalOutflow || 0)}
              </p>
            </Card>
            <Card className={`${(cashFlowData.closingBalance || 0) >= 0 ? 'bg-purple-50 dark:bg-purple-900/30' : 'bg-orange-50 dark:bg-orange-900/30'}`}>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Solde final</p>
              <p className={`text-2xl font-bold ${(cashFlowData.closingBalance || 0) >= 0 ? 'text-purple-600 dark:text-purple-400' : 'text-orange-600 dark:text-orange-400'}`}>
                {formatCurrency(cashFlowData.closingBalance || 0)}
              </p>
            </Card>
          </div>

          <Card title="Flux de trésorerie par catégorie">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Activités opérationnelles
                </p>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-500">Entrées</span>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    {formatCurrency(cashFlowData.operating?.inflow || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-500">Sorties</span>
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">
                    {formatCurrency(cashFlowData.operating?.outflow || 0)}
                  </span>
                </div>
                <div className="border-t border-gray-300 dark:border-gray-600 mt-2 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Net</span>
                    <span className={`text-lg font-bold ${(cashFlowData.operating?.net || 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {formatCurrency(cashFlowData.operating?.net || 0)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Activités d&apos;investissement
                </p>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-500">Entrées</span>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    {formatCurrency(cashFlowData.investing?.inflow || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-500">Sorties</span>
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">
                    {formatCurrency(cashFlowData.investing?.outflow || 0)}
                  </span>
                </div>
                <div className="border-t border-gray-300 dark:border-gray-600 mt-2 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Net</span>
                    <span className={`text-lg font-bold ${(cashFlowData.investing?.net || 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {formatCurrency(cashFlowData.investing?.net || 0)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Activités de financement
                </p>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-500">Entrées</span>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    {formatCurrency(cashFlowData.financing?.inflow || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-500">Sorties</span>
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">
                    {formatCurrency(cashFlowData.financing?.outflow || 0)}
                  </span>
                </div>
                <div className="border-t border-gray-300 dark:border-gray-600 mt-2 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Net</span>
                    <span className={`text-lg font-bold ${(cashFlowData.financing?.net || 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {formatCurrency(cashFlowData.financing?.net || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </>
      )}

      {chartData && chartData.length > 0 && (
        <Card title="Évolution des flux">
          <RevenueChart data={chartData} />
        </Card>
      )}

      <Card title="Détail des transactions">
        <DataTable
          columns={columns}
          data={transactions}
          loading={loading}
          emptyMessage="Aucune transaction"
        />
      </Card>
    </div>
  );
};

export default CashFlow;
