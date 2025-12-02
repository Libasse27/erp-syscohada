import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Card, Button, Alert, Select } from '../../components/common';
import { DataTable } from '../../components/tables';
import { setBreadcrumb } from '../../store/slices/uiSlice';
import accountService from '../../services/accountService';
import ledgerService from '../../services/ledgerService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { exportToPDF, exportToExcel } from '../../utils';

/**
 * General Ledger Page (Grand Livre)
 * Displays detailed movements for a specific account
 */
const GeneralLedger = () => {
  const dispatch = useDispatch();
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('month');
  const [summary, setSummary] = useState({
    openingBalance: 0,
    totalDebit: 0,
    totalCredit: 0,
    closingBalance: 0,
  });

  useEffect(() => {
    dispatch(setBreadcrumb([
      { label: 'Comptabilité', path: '/dashboard/accounting' },
      { label: 'Grand Livre' }
    ]));
    loadAccounts();
  }, [dispatch]);

  useEffect(() => {
    if (selectedAccount) {
      loadLedger();
    }
  }, [selectedAccount, dateRange]);

  const loadAccounts = async () => {
    try {
      const response = await accountService.getAll();
      setAccounts(response.data);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des comptes');
    }
  };

  const loadLedger = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ledgerService.getLedger({
        account: selectedAccount,
        dateRange,
      });
      setEntries(response.data.entries || []);
      setSummary(response.data.summary || {
        openingBalance: 0,
        totalDebit: 0,
        totalCredit: 0,
        closingBalance: 0,
      });
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement du grand livre');
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    if (!entries || entries.length === 0) return;
    const account = accounts.find(a => a._id === selectedAccount);
    exportToPDF(
      entries,
      `grand-livre-${account?.accountNumber}-${formatDate(new Date())}`,
      `Grand Livre - ${account?.accountNumber} ${account?.name}`
    );
  };

  const handleExportExcel = () => {
    if (!entries || entries.length === 0) return;
    const account = accounts.find(a => a._id === selectedAccount);
    exportToExcel(
      entries,
      `grand-livre-${account?.accountNumber}-${formatDate(new Date())}`
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
      header: 'Pièce',
      accessor: 'reference',
      width: '120px',
      render: (row) => <span className="font-mono text-sm">{row.reference}</span>,
    },
    {
      header: 'Libellé',
      accessor: 'description',
      render: (row) => <span>{row.description}</span>,
    },
    {
      header: 'Débit',
      accessor: 'debit',
      width: '140px',
      render: (row) => (
        <span className="font-medium">
          {row.debit ? formatCurrency(row.debit) : '-'}
        </span>
      ),
    },
    {
      header: 'Crédit',
      accessor: 'credit',
      width: '140px',
      render: (row) => (
        <span className="font-medium">
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
          {formatCurrency(row.balance)}
        </span>
      ),
    },
  ];

  const selectedAccountData = accounts.find(a => a._id === selectedAccount);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Grand Livre</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Détail des mouvements par compte
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleExportExcel}
            disabled={!entries || entries.length === 0}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Excel
          </Button>
          <Button
            variant="outline"
            onClick={handleExportPDF}
            disabled={!entries || entries.length === 0}
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
            <label className="block text-sm font-medium mb-2">Compte</label>
            <Select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
            >
              <option value="">Sélectionner un compte</option>
              {accounts.map((account) => (
                <option key={account._id} value={account._id}>
                  {account.accountNumber} - {account.name}
                </option>
              ))}
            </Select>
          </div>
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
        </div>
      </Card>

      {selectedAccount && selectedAccountData && (
        <>
          <Card>
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {selectedAccountData.accountNumber} - {selectedAccountData.name}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Classe {selectedAccountData.class}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Solde d&apos;ouverture</p>
                <p className={`text-lg font-bold ${summary.openingBalance >= 0 ? 'text-gray-900 dark:text-white' : 'text-red-600 dark:text-red-400'}`}>
                  {formatCurrency(summary.openingBalance)}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Débit</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatCurrency(summary.totalDebit)}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Crédit</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatCurrency(summary.totalCredit)}
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Solde de clôture</p>
                <p className={`text-lg font-bold ${summary.closingBalance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {formatCurrency(summary.closingBalance)}
                </p>
              </div>
            </div>
          </Card>

          <Card title="Mouvements du compte">
            <DataTable
              columns={columns}
              data={entries}
              loading={loading}
              emptyMessage="Aucun mouvement pour ce compte"
            />
          </Card>
        </>
      )}

      {!selectedAccount && (
        <Card>
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Sélectionnez un compte pour afficher le grand livre
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default GeneralLedger;
