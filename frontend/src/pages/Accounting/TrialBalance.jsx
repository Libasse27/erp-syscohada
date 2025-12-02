import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Card, Button, Alert, Select } from '../../components/common';
import { DataTable } from '../../components/tables';
import { setBreadcrumb } from '../../store/slices/uiSlice';
import trialBalanceService from '../../services/trialBalanceService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { exportToPDF, exportToExcel } from '../../utils';

/**
 * Trial Balance Page (Balance de Vérification)
 * Displays trial balance report with all accounts
 */
const TrialBalance = () => {
  const dispatch = useDispatch();
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('month');
  const [classFilter, setClassFilter] = useState('all');
  const [totals, setTotals] = useState({
    totalDebit: 0,
    totalCredit: 0,
    difference: 0,
  });

  useEffect(() => {
    dispatch(setBreadcrumb([
      { label: 'Comptabilité', path: '/dashboard/accounting' },
      { label: 'Balance de Vérification' }
    ]));
  }, [dispatch]);

  useEffect(() => {
    loadTrialBalance();
  }, [dateRange, classFilter]);

  const loadTrialBalance = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        dateRange,
        ...(classFilter !== 'all' && { class: classFilter }),
      };
      const response = await trialBalanceService.getTrialBalance(params);
      setBalances(response.data.balances || []);
      setTotals(response.data.totals || {
        totalDebit: 0,
        totalCredit: 0,
        difference: 0,
      });
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement de la balance');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    if (!balances || balances.length === 0) return;
    exportToPDF(
      balances,
      `balance-verification-${formatDate(new Date())}`,
      'Balance de Vérification'
    );
  };

  const handleExportExcel = () => {
    if (!balances || balances.length === 0) return;
    exportToExcel(
      balances,
      `balance-verification-${formatDate(new Date())}`
    );
  };

  const columns = [
    {
      header: 'N° Compte',
      accessor: 'accountNumber',
      width: '120px',
      render: (row) => (
        <span className="font-mono font-medium text-gray-900 dark:text-white">
          {row.accountNumber}
        </span>
      ),
    },
    {
      header: 'Nom du compte',
      accessor: 'accountName',
      render: (row) => (
        <span className="text-gray-900 dark:text-white">{row.accountName}</span>
      ),
    },
    {
      header: 'Classe',
      accessor: 'class',
      width: '80px',
      cellClassName: 'text-center',
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">{row.class}</span>
      ),
    },
    {
      header: 'Débit',
      accessor: 'debit',
      width: '140px',
      render: (row) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {row.debit ? formatCurrency(row.debit) : '-'}
        </span>
      ),
    },
    {
      header: 'Crédit',
      accessor: 'credit',
      width: '140px',
      render: (row) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {row.credit ? formatCurrency(row.credit) : '-'}
        </span>
      ),
    },
    {
      header: 'Solde',
      accessor: 'balance',
      width: '140px',
      render: (row) => (
        <span className={`font-semibold ${row.balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {formatCurrency(Math.abs(row.balance))} {row.balance >= 0 ? 'D' : 'C'}
        </span>
      ),
    },
  ];

  const isBalanced = Math.abs(totals.difference) < 0.01;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Balance de Vérification
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Synthèse des soldes des comptes
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleExportExcel}
            disabled={!balances || balances.length === 0}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Excel
          </Button>
          <Button
            variant="outline"
            onClick={handleExportPDF}
            disabled={!balances || balances.length === 0}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            PDF
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger" onClose={() => setError(null)}>{error}</Alert>}

      {!isBalanced && totals.difference !== 0 && (
        <Alert variant="warning">
          Attention : La balance n&apos;est pas équilibrée. Différence : {formatCurrency(Math.abs(totals.difference))}
        </Alert>
      )}

      {isBalanced && totals.totalDebit > 0 && (
        <Alert variant="success">
          Balance équilibrée. Débit = Crédit
        </Alert>
      )}

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
            <label className="block text-sm font-medium mb-2">Classe SYSCOHADA</label>
            <Select value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
              <option value="all">Toutes les classes</option>
              <option value="1">Classe 1 - Comptes de ressources durables</option>
              <option value="2">Classe 2 - Comptes d&apos;actif immobilisé</option>
              <option value="3">Classe 3 - Comptes de stocks</option>
              <option value="4">Classe 4 - Comptes de tiers</option>
              <option value="5">Classe 5 - Comptes de trésorerie</option>
              <option value="6">Classe 6 - Comptes de charges</option>
              <option value="7">Classe 7 - Comptes de produits</option>
              <option value="8">Classe 8 - Comptes des autres charges et produits</option>
            </Select>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 dark:bg-blue-900/30">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Débit</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(totals.totalDebit)}
          </p>
        </Card>
        <Card className="bg-purple-50 dark:bg-purple-900/30">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Crédit</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(totals.totalCredit)}
          </p>
        </Card>
        <Card className={isBalanced ? 'bg-green-50 dark:bg-green-900/30' : 'bg-red-50 dark:bg-red-900/30'}>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Différence</p>
          <p className={`text-2xl font-bold ${isBalanced ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {formatCurrency(Math.abs(totals.difference))}
          </p>
          {isBalanced && (
            <div className="flex items-center mt-2">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-green-600 dark:text-green-400">Équilibrée</span>
            </div>
          )}
        </Card>
      </div>

      <Card title="Soldes des comptes">
        <DataTable
          columns={columns}
          data={balances}
          loading={loading}
          emptyMessage="Aucun solde à afficher"
        />
      </Card>

      {balances && balances.length > 0 && (
        <Card>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Nombre de comptes</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{balances.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Comptes débiteurs</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {balances.filter(b => b.balance > 0).length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Comptes créditeurs</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {balances.filter(b => b.balance < 0).length}
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default TrialBalance;
