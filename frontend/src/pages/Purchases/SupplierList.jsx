import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Button, Badge, SearchBar, Alert } from '../../components/common';
import { DataTable } from '../../components/tables';
import { ConfirmModal } from '../../components/modals';
import { setBreadcrumb } from '../../store/slices/uiSlice';
import supplierService from '../../services/supplierService';
import { formatPhone } from '../../utils/formatters';

/**
 * Supplier List Page
 * Displays list of all suppliers with search, filter, and actions
 */
const SupplierList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    dispatch(setBreadcrumb([
      { label: 'Achats', path: '/dashboard/purchases' },
      { label: 'Fournisseurs' }
    ]));
  }, [dispatch]);

  useEffect(() => {
    loadSuppliers();
  }, [searchQuery, statusFilter]);

  const loadSuppliers = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page,
        limit: 10,
        search: searchQuery,
        ...(statusFilter !== 'all' && { status: statusFilter }),
      };
      const response = await supplierService.getAll(params);
      setSuppliers(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des fournisseurs');
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

  const handleView = (supplier) => {
    navigate(`/dashboard/purchases/suppliers/${supplier._id}`);
  };

  const handleEdit = (supplier) => {
    navigate(`/dashboard/purchases/suppliers/${supplier._id}/edit`);
  };

  const handleDelete = (supplier) => {
    setSelectedSupplier(supplier);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await supplierService.delete(selectedSupplier._id);
      setDeleteModalOpen(false);
      setSelectedSupplier(null);
      loadSuppliers(pagination?.currentPage || 1);
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression');
    }
  };

  const columns = [
    {
      header: 'Nom',
      accessor: 'name',
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{row.name}</div>
          {row.email && (
            <div className="text-xs text-gray-500 dark:text-gray-400">{row.email}</div>
          )}
        </div>
      ),
    },
    {
      header: 'Téléphone',
      accessor: 'phone',
      width: '140px',
      render: (row) => (
        <a
          href={`tel:${row.phone}`}
          className="text-blue-600 dark:text-blue-400 hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {formatPhone(row.phone)}
        </a>
      ),
    },
    {
      header: 'Ville',
      accessor: 'city',
      width: '130px',
      render: (row) => (
        <div>
          <div className="text-sm">{row.city || '-'}</div>
          {row.country && (
            <div className="text-xs text-gray-500 dark:text-gray-400">{row.country}</div>
          )}
        </div>
      ),
    },
    {
      header: 'Adresse',
      accessor: 'address',
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {row.address || '-'}
        </span>
      ),
    },
    {
      header: 'Statut',
      accessor: 'status',
      width: '100px',
      cellClassName: 'text-center',
      render: (row) => {
        const labels = {
          active: 'Actif',
          inactive: 'Inactif',
        };
        return (
          <Badge variant={row.status === 'active' ? 'success' : 'default'}>
            {labels[row.status] || row.status}
          </Badge>
        );
      },
    },
    {
      header: 'Actions',
      width: '180px',
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
    total: suppliers?.length || 0,
    active: suppliers?.filter(s => s.status === 'active').length || 0,
    inactive: suppliers?.filter(s => s.status === 'inactive').length || 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Fournisseurs
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Gérez vos fournisseurs
          </p>
        </div>
        <Link to="/dashboard/purchases/suppliers/new">
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
            Nouveau fournisseur
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
      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Actifs</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.active}</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Inactifs</p>
          <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">{stats.inactive}</p>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Rechercher par nom, email, téléphone..."
              onSearch={handleSearch}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilter('all')}
            >
              Tous
            </Button>
            <Button
              variant={statusFilter === 'active' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilter('active')}
            >
              Actifs
            </Button>
            <Button
              variant={statusFilter === 'inactive' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilter('inactive')}
            >
              Inactifs
            </Button>
          </div>
        </div>
      </Card>

      {/* Suppliers Table */}
      <Card>
        <DataTable
          columns={columns}
          data={suppliers}
          loading={loading}
          pagination={pagination}
          onPageChange={loadSuppliers}
          emptyMessage="Aucun fournisseur trouvé"
        />
      </Card>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Supprimer le fournisseur"
        message={`Êtes-vous sûr de vouloir supprimer le fournisseur ${selectedSupplier?.name} ? Cette action est irréversible.`}
        variant="danger"
      />
    </div>
  );
};

export default SupplierList;
