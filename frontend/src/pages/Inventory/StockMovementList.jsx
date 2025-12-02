import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, Button, Badge, SearchBar, Alert, Select } from '../../components/common';
import { DataTable } from '../../components/tables';
import { setBreadcrumb } from '../../store/slices/uiSlice';
import stockMovementService from '../../services/stockMovementService';
import { formatDate } from '../../utils/formatters';

/**
 * Stock Movement List Page
 * Displays all stock movements with filters
 */
const StockMovementList = () => {
  const dispatch = useDispatch();

  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    dispatch(setBreadcrumb([
      { label: 'Inventaire', path: '/dashboard/inventory' },
      { label: 'Mouvements de stock' }
    ]));
  }, [dispatch]);

  useEffect(() => {
    loadMovements();
  }, [searchQuery, typeFilter, dateRange]);

  const loadMovements = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page,
        limit: 20,
        search: searchQuery,
        ...(typeFilter !== 'all' && { type: typeFilter }),
        ...(dateRange !== 'all' && { dateRange }),
      };
      const response = await stockMovementService.getAll(params);
      setMovements(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des mouvements');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleTypeFilter = (type) => {
    setTypeFilter(type);
  };

  const columns = [
    {
      header: 'Date',
      accessor: 'date',
      width: '140px',
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {formatDate(row.date)}
        </span>
      ),
    },
    {
      header: 'Produit',
      accessor: 'product',
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {row.product?.name}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {row.product?.sku}
          </div>
        </div>
      ),
    },
    {
      header: 'Type',
      accessor: 'type',
      width: '140px',
      render: (row) => {
        const types = {
          purchase: { label: 'Achat', variant: 'info' },
          sale: { label: 'Vente', variant: 'success' },
          adjustment: { label: 'Ajustement', variant: 'warning' },
          return: { label: 'Retour', variant: 'default' },
          transfer: { label: 'Transfert', variant: 'info' },
        };
        const typeInfo = types[row.type] || { label: row.type, variant: 'default' };
        return <Badge variant={typeInfo.variant}>{typeInfo.label}</Badge>;
      },
    },
    {
      header: 'Quantité',
      accessor: 'quantity',
      width: '100px',
      cellClassName: 'text-center',
      render: (row) => (
        <span className={`font-medium ${row.quantity > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {row.quantity > 0 ? '+' : ''}{row.quantity}
        </span>
      ),
    },
    {
      header: 'Stock avant',
      accessor: 'stockBefore',
      width: '120px',
      cellClassName: 'text-center',
      render: (row) => (
        <span className="text-gray-600 dark:text-gray-400">
          {row.stockBefore}
        </span>
      ),
    },
    {
      header: 'Stock après',
      accessor: 'stockAfter',
      width: '120px',
      cellClassName: 'text-center',
      render: (row) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {row.stockAfter}
        </span>
      ),
    },
    {
      header: 'Référence',
      accessor: 'reference',
      width: '140px',
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {row.reference || '-'}
        </span>
      ),
    },
    {
      header: 'Utilisateur',
      accessor: 'user',
      width: '140px',
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {row.user?.name || '-'}
        </span>
      ),
    },
  ];

  const stats = {
    total: movements?.length || 0,
    purchases: movements?.filter(m => m.type === 'purchase').length || 0,
    sales: movements?.filter(m => m.type === 'sale').length || 0,
    adjustments: movements?.filter(m => m.type === 'adjustment').length || 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Mouvements de stock
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Historique des entrées et sorties de stock
          </p>
        </div>
        <Link to="/dashboard/inventory/movements/new">
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
            Nouveau mouvement
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total mouvements</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Achats</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.purchases}</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Ventes</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.sales}</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Ajustements</p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.adjustments}</p>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                placeholder="Rechercher par produit, référence..."
                onSearch={handleSearch}
              />
            </div>
            <Select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full md:w-48"
            >
              <option value="all">Toutes les dates</option>
              <option value="today">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="year">Cette année</option>
            </Select>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={typeFilter === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleTypeFilter('all')}
            >
              Tous
            </Button>
            <Button
              variant={typeFilter === 'purchase' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleTypeFilter('purchase')}
            >
              Achats
            </Button>
            <Button
              variant={typeFilter === 'sale' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleTypeFilter('sale')}
            >
              Ventes
            </Button>
            <Button
              variant={typeFilter === 'adjustment' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleTypeFilter('adjustment')}
            >
              Ajustements
            </Button>
            <Button
              variant={typeFilter === 'return' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleTypeFilter('return')}
            >
              Retours
            </Button>
          </div>
        </div>
      </Card>

      {/* Movements Table */}
      <Card>
        <DataTable
          columns={columns}
          data={movements}
          loading={loading}
          pagination={pagination}
          onPageChange={loadMovements}
          emptyMessage="Aucun mouvement de stock"
        />
      </Card>
    </div>
  );
};

export default StockMovementList;
