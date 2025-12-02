import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Button, Badge, SearchBar, Alert } from '../../components/common';
import { ProductTable } from '../../components/tables';
import { ConfirmModal } from '../../components/modals';
import { fetchProducts, deleteProduct } from '../../store/slices/productSlice';
import { setBreadcrumb } from '../../store/slices/uiSlice';
import { formatCurrency } from '../../utils/formatters';

/**
 * Product List Page
 * Displays list of all products with search, filter, and actions
 */
const ProductList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, error, pagination } = useSelector((state) => state.products);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    dispatch(setBreadcrumb([
      { label: 'Inventaire', path: '/dashboard/inventory' },
      { label: 'Produits' }
    ]));
  }, [dispatch]);

  useEffect(() => {
    loadProducts();
  }, [searchQuery, categoryFilter, stockFilter]);

  const loadProducts = (page = 1) => {
    const params = {
      page,
      limit: 10,
      search: searchQuery,
      ...(categoryFilter !== 'all' && { category: categoryFilter }),
      ...(stockFilter !== 'all' && { stockStatus: stockFilter }),
    };
    dispatch(fetchProducts(params));
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCategoryFilter = (category) => {
    setCategoryFilter(category);
  };

  const handleStockFilter = (status) => {
    setStockFilter(status);
  };

  const handleView = (product) => {
    navigate(`/dashboard/inventory/products/${product._id}`);
  };

  const handleEdit = (product) => {
    navigate(`/dashboard/inventory/products/${product._id}/edit`);
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteProduct(selectedProduct._id)).unwrap();
      setDeleteModalOpen(false);
      setSelectedProduct(null);
      loadProducts(pagination?.currentPage || 1);
    } catch (err) {
      setLocalError(err.message || 'Erreur lors de la suppression');
    }
  };

  const handlePageChange = (page) => {
    loadProducts(page);
  };

  // Calculate stats
  const stats = {
    total: products?.length || 0,
    inStock: products?.filter(p => p.stockQuantity > p.minStockLevel).length || 0,
    lowStock: products?.filter(p => p.stockQuantity > 0 && p.stockQuantity <= p.minStockLevel).length || 0,
    outOfStock: products?.filter(p => p.stockQuantity === 0).length || 0,
    totalValue: products?.reduce((sum, p) => sum + (p.stockQuantity * p.sellingPrice), 0) || 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Produits
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Gérez votre catalogue de produits
          </p>
        </div>
        <Link to="/dashboard/inventory/products/new">
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
            Nouveau produit
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
          <p className="text-sm text-gray-600 dark:text-gray-400">Total produits</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">En stock</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.inStock}</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Stock faible</p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.lowStock}</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Rupture</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.outOfStock}</p>
        </Card>
      </div>

      {/* Value Card */}
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-100">Valeur totale du stock</p>
            <p className="text-3xl font-bold mt-1">{formatCurrency(stats.totalValue)}</p>
          </div>
          <svg className="w-16 h-16 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
      </Card>

      {/* Search and Filters */}
      <Card>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                placeholder="Rechercher par nom, référence, code-barres..."
                onSearch={handleSearch}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Stock:</span>
              <Button
                variant={stockFilter === 'all' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleStockFilter('all')}
              >
                Tous
              </Button>
              <Button
                variant={stockFilter === 'inStock' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleStockFilter('inStock')}
              >
                En stock
              </Button>
              <Button
                variant={stockFilter === 'lowStock' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleStockFilter('lowStock')}
              >
                Stock faible
              </Button>
              <Button
                variant={stockFilter === 'outOfStock' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleStockFilter('outOfStock')}
              >
                Rupture
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Products Table */}
      <Card>
        <ProductTable
          products={products}
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
        title="Supprimer le produit"
        message={`Êtes-vous sûr de vouloir supprimer le produit "${selectedProduct?.name}" ? Cette action est irréversible.`}
        variant="danger"
      />
    </div>
  );
};

export default ProductList;
