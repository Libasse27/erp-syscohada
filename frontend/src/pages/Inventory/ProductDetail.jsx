import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, Button, Badge, Alert, Loader } from '../../components/common';
import { DataTable } from '../../components/tables';
import { fetchProductById } from '../../store/slices/productSlice';
import { setBreadcrumb } from '../../store/slices/uiSlice';
import productService from '../../services/productService';
import { formatCurrency, formatDate } from '../../utils/formatters';

/**
 * Product Detail Page
 * Displays full product details with stock movements
 */
const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentProduct: product, loading } = useSelector((state) => state.products);

  const [error, setError] = useState(null);
  const [movements, setMovements] = useState([]);
  const [movementsLoading, setMovementsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
      loadStockMovements();
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (product) {
      dispatch(setBreadcrumb([
        { label: 'Inventaire', path: '/dashboard/inventory' },
        { label: 'Produits', path: '/dashboard/inventory/products' },
        { label: product.name }
      ]));
    }
  }, [dispatch, product]);

  const loadStockMovements = async () => {
    try {
      setMovementsLoading(true);
      const response = await productService.getStockMovements(id);
      setMovements(response.data);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des mouvements');
    } finally {
      setMovementsLoading(false);
    }
  };

  const getStockStatusBadge = () => {
    if (!product) return null;

    if (product.stockQuantity === 0) {
      return <Badge variant="danger">Rupture de stock</Badge>;
    } else if (product.stockQuantity <= product.minStockLevel) {
      return <Badge variant="warning">Stock faible</Badge>;
    } else {
      return <Badge variant="success">En stock</Badge>;
    }
  };

  const movementColumns = [
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
      header: 'Type',
      accessor: 'type',
      width: '140px',
      render: (row) => {
        const types = {
          purchase: { label: 'Achat', variant: 'info' },
          sale: { label: 'Vente', variant: 'success' },
          adjustment: { label: 'Ajustement', variant: 'warning' },
          return: { label: 'Retour', variant: 'default' },
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
      header: 'Notes',
      accessor: 'notes',
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {row.notes || '-'}
        </span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <Alert variant="warning">
        Produit introuvable
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {product.name}
            </h1>
            {getStockStatusBadge()}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Référence: {product.reference || product.sku}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Link to={`/dashboard/inventory/products/${id}/edit`}>
            <Button variant="primary">Modifier</Button>
          </Link>
          <Link to={`/dashboard/inventory/movements/new?product=${id}`}>
            <Button variant="outline">Mouvement de stock</Button>
          </Link>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Product Image & Basic Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Image */}
        <Card>
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
          )}
        </Card>

        {/* Stock Info */}
        <Card title="Stock">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Quantité en stock</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {product.stockQuantity}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Stock minimum</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {product.minStockLevel}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Stock maximum</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {product.maxStockLevel || '-'}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Valeur du stock</p>
              <p className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                {formatCurrency(product.stockQuantity * product.purchasePrice)}
              </p>
            </div>
          </div>
        </Card>

        {/* Pricing */}
        <Card title="Prix">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Prix d'achat</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {formatCurrency(product.purchasePrice)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Prix de vente</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(product.sellingPrice)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Marge</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {formatCurrency(product.sellingPrice - product.purchasePrice)}
                <span className="text-sm ml-2">
                  ({((product.sellingPrice - product.purchasePrice) / product.purchasePrice * 100).toFixed(1)}%)
                </span>
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Informations générales">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Catégorie</p>
              <p className="text-gray-900 dark:text-white">{product.category?.name || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Référence</p>
              <p className="text-gray-900 dark:text-white">{product.reference || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">SKU</p>
              <p className="text-gray-900 dark:text-white">{product.sku}</p>
            </div>
            {product.barcode && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Code-barres</p>
                <p className="text-gray-900 dark:text-white font-mono">{product.barcode}</p>
              </div>
            )}
            {product.unit && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Unité</p>
                <p className="text-gray-900 dark:text-white">{product.unit}</p>
              </div>
            )}
          </div>
        </Card>

        <Card title="Description">
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {product.description || 'Aucune description'}
          </p>
        </Card>
      </div>

      {/* Stock Movements */}
      <Card title="Historique des mouvements de stock">
        <DataTable
          columns={movementColumns}
          data={movements}
          loading={movementsLoading}
          emptyMessage="Aucun mouvement de stock"
        />
      </Card>
    </div>
  );
};

export default ProductDetail;
