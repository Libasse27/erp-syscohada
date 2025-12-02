import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Card, Button, Alert, Select } from '../../components/common';
import { DataTable } from '../../components/tables';
import { setBreadcrumb } from '../../store/slices/uiSlice';
import journalService from '../../services/journalService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { exportToPDF } from '../../utils';

const JournalList = () => {
  const dispatch = useDispatch();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('month');
  const [journalType, setJournalType] = useState('all');

  useEffect(() => {
    dispatch(setBreadcrumb([
      { label: 'Comptabilité', path: '/dashboard/accounting' },
      { label: 'Journal' }
    ]));
  }, [dispatch]);

  useEffect(() => {
    loadJournal();
  }, [dateRange, journalType]);

  const loadJournal = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await journalService.getJournal({ dateRange, type: journalType });
      setEntries(response.data);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement du journal');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    if (!entries) return;
    exportToPDF(entries, `journal-${formatDate(new Date())}`);
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
      header: 'Compte',
      accessor: 'account',
      width: '120px',
      render: (row) => <span className="font-mono">{row.accountNumber}</span>,
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
      render: (row) => <span className="font-medium">{row.debit ? formatCurrency(row.debit) : '-'}</span>,
    },
    {
      header: 'Crédit',
      accessor: 'credit',
      width: '140px',
      render: (row) => <span className="font-medium">{row.credit ? formatCurrency(row.credit) : '-'}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Journal</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Livre-journal des opérations comptables</p>
        </div>
        <Button variant="outline" onClick={handleExportPDF} disabled={!entries || entries.length === 0}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          Export PDF
        </Button>
      </div>

      {error && <Alert variant="danger" onClose={() => setError(null)}>{error}</Alert>}

      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Période</label>
            <Select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
              <option value="today">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="year">Cette année</option>
            </Select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Type de journal</label>
            <Select value={journalType} onChange={(e) => setJournalType(e.target.value)}>
              <option value="all">Tous</option>
              <option value="sales">Ventes</option>
              <option value="purchases">Achats</option>
              <option value="bank">Banque</option>
              <option value="operations">Opérations diverses</option>
            </Select>
          </div>
        </div>
      </Card>

      <Card title="Écritures du journal">
        <DataTable columns={columns} data={entries} loading={loading} emptyMessage="Aucune écriture dans le journal" />
      </Card>
    </div>
  );
};

export default JournalList;
