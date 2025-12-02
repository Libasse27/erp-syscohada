import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Button, SearchBar, Alert } from '../../components/common';
import { CustomerTable } from '../../components/tables';
import { ConfirmModal, ProductModal } from '../../components/modals';
import { fetchCustomers, deleteCustomer } from '../../store/slices/customerSlice';
import { setBreadcrumb } from '../../store/slices/uiSlice';

/**
 * Customer List Page
 * Displays list of all customers with search, filter, and actions
 */
const CustomerList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { customers, loading, error, pagination } = useSelector((state) => state.customers);

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    dispatch(setBreadcrumb([
      { label: 'Ventes', path: '/dashboard/sales' },
      { label: 'Clients' }
    ]));
  }, [dispatch]);

  useEffect(() => {
    loadCustomers();
  }, [searchQuery, typeFilter]);

  const loadCustomers = (page = 1) => {
    const params = {
      page,
      limit: 10,
      search: searchQuery,
      ...(typeFilter !== 'all' && { type: typeFilter }),
    };
    dispatch(fetchCustomers(params));
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleTypeFilter = (type) => {
    setTypeFilter(type);
  };

  const handleView = (customer) => {
    navigate(`/dashboard/sales/customers/${customer._id}`);
  };

  const handleEdit = (customer) => {
    navigate(`/dashboard/sales/customers/${customer._id}/edit`);
  };

  const handleDelete = (customer) => {
    setSelectedCustomer(customer);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteCustomer(selectedCustomer._id)).unwrap();
      setDeleteModalOpen(false);
      setSelectedCustomer(null);
      loadCustomers(pagination?.currentPage || 1);
    } catch (err) {
      setLocalError(err.message || 'Erreur lors de la suppression');
    }
  };

  const handlePageChange = (page) => {
    loadCustomers(page);
  };

  const stats = {
    total: customers?.length || 0,
    individual: customers?.filter(c => c.type === 'individual').length || 0,
    company: customers?.filter(c => c.type === 'company').length || 0,
    active: customers?.filter(c => c.status === 'active').length || 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Clients
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Gérez vos clients
          </p>
        </div>
        <Link to="/dashboard/sales/customers/new">
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
            Nouveau client
          </Button>
        </Link>
      </div>

      {/* Error Alert */}
      {(error || localError) && (
        <Alert variant="danger" onClose={() => setLocalError(null)}>
          {error || localError}
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Particuliers</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.individual}</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Entreprises</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.company}</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Actifs</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.active}</p>
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
              variant={typeFilter === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleTypeFilter('all')}
            >
              Tous
            </Button>
            <Button
              variant={typeFilter === 'individual' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleTypeFilter('individual')}
            >
              Particuliers
            </Button>
            <Button
              variant={typeFilter === 'company' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleTypeFilter('company')}
            >
              Entreprises
            </Button>
          </div>
        </div>
      </Card>

      {/* Customers Table */}
      <Card>
        <CustomerTable
          customers={customers}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Supprimer le client"
        message={`Êtes-vous sûr de vouloir supprimer le client ${selectedCustomer?.name} ? Cette action est irréversible.`}
        variant="danger"
      />
    </div>
  );
};

export default CustomerList;
