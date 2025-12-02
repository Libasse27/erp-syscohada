import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Button, Badge, SearchBar, Alert } from '../../components/common';
import { DataTable } from '../../components/tables';
import { ConfirmModal } from '../../components/modals';
import { setBreadcrumb } from '../../store/slices/uiSlice';
import accountingEntryService from '../../services/accountingEntryService';
import { formatCurrency, formatDate } from '../../utils/formatters';

const AccountingEntryList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    dispatch(setBreadcrumb([
      { label: 'Comptabilité', path: '/dashboard/accounting' },
      { label: 'Écritures comptables' }
    ]));
  }, [dispatch]);

  useEffect(() => {
    loadEntries();
  }, [searchQuery, statusFilter]);

  const loadEntries = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page,
        limit: 20,
        search: searchQuery,
        ...(statusFilter !== 'all' && { status: statusFilter }),
      };
      const response = await accountingEntryService.getAll(params);
      setEntries(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des écritures');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (entry) => {
    navigate(`/dashboard/accounting/entries/${entry._id}`);
  };

  const handleDelete = (entry) => {
    setSelectedEntry(entry);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await accountingEntryService.delete(selectedEntry._id);
      setDeleteModalOpen(false);
      setSelectedEntry(null);
      loadEntries(pagination?.currentPage || 1);
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression');
    }
  };

  const columns = [
    {
      header: 'Date',
      accessor: 'date',
      width: '120px',
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {formatDate(row.date)}
        </span>
      ),
    },
    {
      header: 'Pièce',
      accessor: 'reference',
      width: '120px',
      render: (row) => (
        <button
          onClick={() => handleView(row)}
          className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          {row.reference}
        </button>
      ),
    },
    {
      header: 'Libellé',
      accessor: 'description',
      render: (row) => (
        <span className="text-gray-900 dark:text-white">{row.description}</span>
      ),
    },
    {
      header: 'Débit',
      accessor: 'debit',
      width: '140px',
      render: (row) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {formatCurrency(row.totalDebit)}
        </span>
      ),
    },
    {
      header: 'Crédit',
      accessor: 'credit',
      width: '140px',
      render: (row) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {formatCurrency(row.totalCredit)}
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
          posted: 'success',
          cancelled: 'danger',
        };
        const labels = {
          draft: 'Brouillon',
          posted: 'Validée',
          cancelled: 'Annulée',
        };
        return (
          <Badge variant={variants[row.status] || 'default'}>
            {labels[row.status] || row.status}
          </Badge>
        );
      },
    },
    {
      header: 'Actions',
      width: '120px',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex justify-end space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleView(row);
            }}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            }
          />
          {row.status === 'draft' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(row);
              }}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              }
            />
          )}
        </div>
      ),
    },
  ];

  const stats = {
    total: entries?.length || 0,
    draft: entries?.filter(e => e.status === 'draft').length || 0,
    posted: entries?.filter(e => e.status === 'posted').length || 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Écritures comptables
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Journal des écritures comptables
          </p>
        </div>
        <Link to="/dashboard/accounting/entries/new">
          <Button variant="primary" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>}>
            Nouvelle écriture
          </Button>
        </Link>
      </div>

      {error && <Alert variant="danger" onClose={() => setError(null)}>{error}</Alert>}

      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Brouillon</p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.draft}</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Validées</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.posted}</p>
        </Card>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <SearchBar placeholder="Rechercher par pièce, libellé..." onSearch={setSearchQuery} />
          </div>
          <div className="flex gap-2">
            <Button variant={statusFilter === 'all' ? 'primary' : 'outline'} size="sm" onClick={() => setStatusFilter('all')}>Tous</Button>
            <Button variant={statusFilter === 'draft' ? 'primary' : 'outline'} size="sm" onClick={() => setStatusFilter('draft')}>Brouillon</Button>
            <Button variant={statusFilter === 'posted' ? 'primary' : 'outline'} size="sm" onClick={() => setStatusFilter('posted')}>Validées</Button>
          </div>
        </div>
      </Card>

      <Card>
        <DataTable columns={columns} data={entries} loading={loading} pagination={pagination} onPageChange={loadEntries} emptyMessage="Aucune écriture comptable" />
      </Card>

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Supprimer l'écriture"
        message={`Êtes-vous sûr de vouloir supprimer l'écriture ${selectedEntry?.reference} ?`}
        variant="danger"
      />
    </div>
  );
};

export default AccountingEntryList;
