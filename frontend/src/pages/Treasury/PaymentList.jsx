import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Button, Badge, SearchBar, Alert, Select } from '../../components/common';
import { DataTable } from '../../components/tables';
import { ConfirmModal } from '../../components/modals';
import { setBreadcrumb } from '../../store/slices/uiSlice';
import paymentService from '../../services/paymentService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { PAYMENT_METHODS, PAYMENT_TYPES } from '../../utils/constants';

/**
 * Payment List Page
 * Displays and manages payment transactions (receipts and disbursements)
 */
const PaymentList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    dispatch(setBreadcrumb([
      { label: 'Trésorerie', path: '/dashboard/treasury' },
      { label: 'Paiements' }
    ]));
  }, [dispatch]);

  useEffect(() => {
    loadPayments();
  }, [searchQuery, typeFilter, methodFilter, statusFilter]);

  const loadPayments = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page,
        limit: 20,
        search: searchQuery,
        ...(typeFilter !== 'all' && { type: typeFilter }),
        ...(methodFilter !== 'all' && { method: methodFilter }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
      };
      const response = await paymentService.getAll(params);
      setPayments(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des paiements');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (payment) => {
    navigate(`/dashboard/treasury/payments/${payment._id}`);
  };

  const handleDelete = (payment) => {
    setSelectedPayment(payment);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await paymentService.delete(selectedPayment._id);
      setDeleteModalOpen(false);
      setSelectedPayment(null);
      loadPayments(pagination?.currentPage || 1);
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
      header: 'Référence',
      accessor: 'reference',
      width: '140px',
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
      header: 'Type',
      accessor: 'type',
      width: '120px',
      render: (row) => {
        const typeLabels = {
          receipt: 'Encaissement',
          disbursement: 'Décaissement',
        };
        const typeColors = {
          receipt: 'success',
          disbursement: 'warning',
        };
        return (
          <Badge variant={typeColors[row.type] || 'default'}>
            {typeLabels[row.type] || row.type}
          </Badge>
        );
      },
    },
    {
      header: 'Méthode',
      accessor: 'method',
      width: '160px',
      render: (row) => {
        const methodIcons = {
          cash: '=µ',
          check: '>þ',
          bank_transfer: '<æ',
          mobile_money: '=ñ',
          card: '=³',
        };
        return (
          <span className="text-sm flex items-center gap-1">
            <span>{methodIcons[row.method]}</span>
            <span>{PAYMENT_METHODS[row.method] || row.method}</span>
          </span>
        );
      },
    },
    {
      header: 'Tiers',
      accessor: 'party',
      render: (row) => (
        <span className="text-gray-900 dark:text-white">
          {row.customer?.name || row.supplier?.name || row.partyName || '-'}
        </span>
      ),
    },
    {
      header: 'Montant',
      accessor: 'amount',
      width: '140px',
      render: (row) => (
        <span className={`font-semibold ${row.type === 'receipt' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {row.type === 'receipt' ? '+' : '-'} {formatCurrency(row.amount)}
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
          pending: 'warning',
          completed: 'success',
          cancelled: 'danger',
        };
        const labels = {
          pending: 'En attente',
          completed: 'Complété',
          cancelled: 'Annulé',
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
      width: '100px',
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
          {row.status === 'pending' && (
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

  // Calculate statistics
  const stats = {
    total: payments?.length || 0,
    receipts: payments?.filter(p => p.type === 'receipt').reduce((sum, p) => sum + (p.amount || 0), 0) || 0,
    disbursements: payments?.filter(p => p.type === 'disbursement').reduce((sum, p) => sum + (p.amount || 0), 0) || 0,
    pending: payments?.filter(p => p.status === 'pending').length || 0,
    completed: payments?.filter(p => p.status === 'completed').length || 0,
  };

  const netCashFlow = stats.receipts - stats.disbursements;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Paiements
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Gestion des encaissements et décaissements
          </p>
        </div>
        <Link to="/dashboard/treasury/payments/new">
          <Button
            variant="primary"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            Nouveau paiement
          </Button>
        </Link>
      </div>

      {error && <Alert variant="danger" onClose={() => setError(null)}>{error}</Alert>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
        </Card>
        <Card className="text-center bg-green-50 dark:bg-green-900/30">
          <p className="text-sm text-gray-600 dark:text-gray-400">Encaissements</p>
          <p className="text-xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(stats.receipts)}
          </p>
        </Card>
        <Card className="text-center bg-red-50 dark:bg-red-900/30">
          <p className="text-sm text-gray-600 dark:text-gray-400">Décaissements</p>
          <p className="text-xl font-bold text-red-600 dark:text-red-400">
            {formatCurrency(stats.disbursements)}
          </p>
        </Card>
        <Card className={`text-center ${netCashFlow >= 0 ? 'bg-blue-50 dark:bg-blue-900/30' : 'bg-orange-50 dark:bg-orange-900/30'}`}>
          <p className="text-sm text-gray-600 dark:text-gray-400">Flux net</p>
          <p className={`text-xl font-bold ${netCashFlow >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`}>
            {formatCurrency(Math.abs(netCashFlow))}
          </p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">En attente</p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
        </Card>
      </div>

      <Card>
        <div className="space-y-4">
          <SearchBar
            placeholder="Rechercher par référence, tiers..."
            onSearch={setSearchQuery}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                <option value="all">Tous les types</option>
                <option value="receipt">Encaissements</option>
                <option value="disbursement">Décaissements</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Méthode</label>
              <Select value={methodFilter} onChange={(e) => setMethodFilter(e.target.value)}>
                <option value="all">Toutes les méthodes</option>
                {Object.entries(PAYMENT_METHODS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Statut</label>
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="completed">Complétés</option>
                <option value="cancelled">Annulés</option>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <DataTable
          columns={columns}
          data={payments}
          loading={loading}
          pagination={pagination}
          onPageChange={loadPayments}
          emptyMessage="Aucun paiement"
        />
      </Card>

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Supprimer le paiement"
        message={`Êtes-vous sûr de vouloir supprimer le paiement ${selectedPayment?.reference} ?`}
        variant="danger"
      />
    </div>
  );
};

export default PaymentList;
