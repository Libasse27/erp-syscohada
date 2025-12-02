import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Button, Badge, SearchBar, Alert } from '../../components/common';
import { DataTable } from '../../components/tables';
import { ConfirmModal } from '../../components/modals';
import { setBreadcrumb } from '../../store/slices/uiSlice';
import quoteService from '../../services/quoteService';
import { formatCurrency, formatDate } from '../../utils/formatters';

/**
 * Quote List Page
 * Displays list of all quotes/devis with search, filter, and actions
 */
const QuoteList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    dispatch(setBreadcrumb([
      { label: 'Ventes', path: '/dashboard/sales' },
      { label: 'Devis' }
    ]));
  }, [dispatch]);

  useEffect(() => {
    loadQuotes();
  }, [searchQuery, statusFilter]);

  const loadQuotes = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page,
        limit: 10,
        search: searchQuery,
        ...(statusFilter !== 'all' && { status: statusFilter }),
      };
      const response = await quoteService.getAll(params);
      setQuotes(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des devis');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

  const handleView = (quote) => {
    navigate(`/dashboard/sales/quotes/${quote._id}`);
  };

  const handleEdit = (quote) => {
    navigate(`/dashboard/sales/quotes/${quote._id}/edit`);
  };

  const handleDelete = (quote) => {
    setSelectedQuote(quote);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await quoteService.delete(selectedQuote._id);
      setDeleteModalOpen(false);
      setSelectedQuote(null);
      loadQuotes(pagination?.currentPage || 1);
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression');
    }
  };

  const handleConvertToInvoice = async (quote) => {
    try {
      const response = await quoteService.convertToInvoice(quote._id);
      navigate(`/dashboard/sales/invoices/${response.data._id}`);
    } catch (err) {
      setError(err.message || 'Erreur lors de la conversion');
    }
  };

  const handleDownloadPDF = async (quote) => {
    try {
      const blob = await quoteService.downloadPDF(quote._id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `devis-${quote.quoteNumber}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || 'Erreur lors du téléchargement du PDF');
    }
  };

  const columns = [
    {
      header: 'N° Devis',
      accessor: 'quoteNumber',
      width: '120px',
      render: (row) => (
        <button
          onClick={() => handleView(row)}
          className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          {row.quoteNumber}
        </button>
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
      accessor: 'quoteDate',
      width: '120px',
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {formatDate(row.quoteDate)}
        </span>
      ),
    },
    {
      header: 'Validité',
      accessor: 'validUntil',
      width: '120px',
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {formatDate(row.validUntil)}
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
          accepted: 'success',
          rejected: 'danger',
          expired: 'default',
        };
        const labels = {
          draft: 'Brouillon',
          sent: 'Envoyé',
          accepted: 'Accepté',
          rejected: 'Refusé',
          expired: 'Expiré',
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
      width: '200px',
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
          {row.status === 'accepted' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleConvertToInvoice(row);
              }}
              title="Convertir en facture"
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              }
            />
          )}
          {row.status === 'draft' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(row);
              }}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              }
            />
          )}
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
        </div>
      ),
    },
  ];

  const stats = {
    total: quotes?.length || 0,
    draft: quotes?.filter(q => q.status === 'draft').length || 0,
    sent: quotes?.filter(q => q.status === 'sent').length || 0,
    accepted: quotes?.filter(q => q.status === 'accepted').length || 0,
    rejected: quotes?.filter(q => q.status === 'rejected').length || 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Devis
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Gérez vos devis de vente
          </p>
        </div>
        <Link to="/dashboard/sales/quotes/new">
          <Button
            variant="primary"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            }
          >
            Nouveau devis
          </Button>
        </Link>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Brouillon</p>
          <p className="text-2xl font-bold text-gray-600 dark:text-gray-300">{stats.draft}</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Envoyés</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.sent}</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Acceptés</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.accepted}</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Refusés</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.rejected}</p>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Rechercher par numéro, client..."
              onSearch={handleSearch}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            <Button
              variant={statusFilter === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilter('all')}
            >
              Tous
            </Button>
            {['draft', 'sent', 'accepted', 'rejected', 'expired'].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleStatusFilter(status)}
              >
                {status === 'draft' && 'Brouillon'}
                {status === 'sent' && 'Envoyé'}
                {status === 'accepted' && 'Accepté'}
                {status === 'rejected' && 'Refusé'}
                {status === 'expired' && 'Expiré'}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Quotes Table */}
      <Card>
        <DataTable
          columns={columns}
          data={quotes}
          loading={loading}
          pagination={pagination}
          onPageChange={loadQuotes}
          emptyMessage="Aucun devis trouvé"
        />
      </Card>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Supprimer le devis"
        message={`Êtes-vous sûr de vouloir supprimer le devis ${selectedQuote?.quoteNumber} ? Cette action est irréversible.`}
        variant="danger"
      />
    </div>
  );
};

export default QuoteList;
