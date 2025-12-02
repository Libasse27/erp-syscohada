import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Button, Badge, SearchBar, Alert } from '../../components/common';
import { DataTable } from '../../components/tables';
import { ConfirmModal } from '../../components/modals';
import { setBreadcrumb } from '../../store/slices/uiSlice';
import purchaseOrderService from '../../services/purchaseOrderService';
import { formatCurrency, formatDate } from '../../utils/formatters';

/**
 * Purchase Order List Page
 * Displays list of all purchase orders with search, filter, and actions
 */
const PurchaseOrderList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    dispatch(setBreadcrumb([
      { label: 'Achats', path: '/dashboard/purchases' },
      { label: 'Commandes d\'achat' }
    ]));
  }, [dispatch]);

  useEffect(() => {
    loadOrders();
  }, [searchQuery, statusFilter]);

  const loadOrders = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page,
        limit: 10,
        search: searchQuery,
        ...(statusFilter !== 'all' && { status: statusFilter }),
      };
      const response = await purchaseOrderService.getAll(params);
      setOrders(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des commandes');
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

  const handleView = (order) => {
    navigate(`/dashboard/purchases/orders/${order._id}`);
  };

  const handleEdit = (order) => {
    navigate(`/dashboard/purchases/orders/${order._id}/edit`);
  };

  const handleDelete = (order) => {
    setSelectedOrder(order);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await purchaseOrderService.delete(selectedOrder._id);
      setDeleteModalOpen(false);
      setSelectedOrder(null);
      loadOrders(pagination?.currentPage || 1);
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression');
    }
  };

  const handleReceive = async (order) => {
    try {
      await purchaseOrderService.updateStatus(order._id, 'received');
      loadOrders(pagination?.currentPage || 1);
    } catch (err) {
      setError(err.message || 'Erreur lors de la réception');
    }
  };

  const handleDownloadPDF = async (order) => {
    try {
      const blob = await purchaseOrderService.downloadPDF(order._id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `commande-${order.orderNumber}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || 'Erreur lors du téléchargement du PDF');
    }
  };

  const columns = [
    {
      header: 'N° Commande',
      accessor: 'orderNumber',
      width: '140px',
      render: (row) => (
        <button
          onClick={() => handleView(row)}
          className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          {row.orderNumber}
        </button>
      ),
    },
    {
      header: 'Fournisseur',
      accessor: 'supplier',
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {row.supplier?.name || 'N/A'}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {row.supplier?.email}
          </div>
        </div>
      ),
    },
    {
      header: 'Date commande',
      accessor: 'orderDate',
      width: '130px',
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {formatDate(row.orderDate)}
        </span>
      ),
    },
    {
      header: 'Livraison prévue',
      accessor: 'expectedDate',
      width: '130px',
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {row.expectedDate ? formatDate(row.expectedDate) : '-'}
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
          confirmed: 'warning',
          received: 'success',
          cancelled: 'danger',
        };
        const labels = {
          draft: 'Brouillon',
          sent: 'Envoyée',
          confirmed: 'Confirmée',
          received: 'Reçue',
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
          {row.status === 'confirmed' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleReceive(row);
              }}
              title="Marquer comme reçue"
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
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
    total: orders?.length || 0,
    draft: orders?.filter(o => o.status === 'draft').length || 0,
    sent: orders?.filter(o => o.status === 'sent').length || 0,
    confirmed: orders?.filter(o => o.status === 'confirmed').length || 0,
    received: orders?.filter(o => o.status === 'received').length || 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Commandes d'achat
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Gérez vos commandes fournisseurs
          </p>
        </div>
        <Link to="/dashboard/purchases/orders/new">
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
            Nouvelle commande
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
          <p className="text-sm text-gray-600 dark:text-gray-400">Envoyées</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.sent}</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Confirmées</p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.confirmed}</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Reçues</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.received}</p>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Rechercher par numéro, fournisseur..."
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
            {['draft', 'sent', 'confirmed', 'received', 'cancelled'].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleStatusFilter(status)}
              >
                {status === 'draft' && 'Brouillon'}
                {status === 'sent' && 'Envoyée'}
                {status === 'confirmed' && 'Confirmée'}
                {status === 'received' && 'Reçue'}
                {status === 'cancelled' && 'Annulée'}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Orders Table */}
      <Card>
        <DataTable
          columns={columns}
          data={orders}
          loading={loading}
          pagination={pagination}
          onPageChange={loadOrders}
          emptyMessage="Aucune commande d'achat trouvée"
        />
      </Card>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Supprimer la commande"
        message={`Êtes-vous sûr de vouloir supprimer la commande ${selectedOrder?.orderNumber} ? Cette action est irréversible.`}
        variant="danger"
      />
    </div>
  );
};

export default PurchaseOrderList;
