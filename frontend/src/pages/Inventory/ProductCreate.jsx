import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Alert } from '../../components/common';
import { ProductForm } from '../../components/forms';
import { createProduct } from '../../store/slices/productSlice';
import { setBreadcrumb } from '../../store/slices/uiSlice';

/**
 * Product Create Page
 * Form to create a new product
 */
const ProductCreate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(setBreadcrumb([
      { label: 'Inventaire', path: '/dashboard/inventory' },
      { label: 'Produits', path: '/dashboard/inventory/products' },
      { label: 'Nouveau produit' }
    ]));
  }, [dispatch]);

  const handleSubmit = async (productData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await dispatch(createProduct(productData)).unwrap();
      navigate('/dashboard/inventory/products');
    } catch (err) {
      setError(err.message || 'Erreur lors de la création du produit');
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/inventory/products');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Nouveau produit
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Ajouter un nouveau produit au catalogue
          </p>
        </div>
        <Button variant="ghost" onClick={handleCancel}>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Annuler
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Product Form */}
      <Card>
        <ProductForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </Card>
    </div>
  );
};

export default ProductCreate;
