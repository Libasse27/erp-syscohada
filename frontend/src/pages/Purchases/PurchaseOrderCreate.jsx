import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Alert } from '../../components/common';
import { InvoiceForm } from '../../components/forms';
import { setBreadcrumb } from '../../store/slices/uiSlice';
import purchaseOrderService from '../../services/purchaseOrderService';

/**
 * Purchase Order Create Page
 * Form to create a new purchase order
 * Reuses InvoiceForm component as structure is similar
 */
const PurchaseOrderCreate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(setBreadcrumb([
      { label: 'Achats', path: '/dashboard/purchases' },
      { label: 'Commandes d\'achat', path: '/dashboard/purchases/orders' },
      { label: 'Nouvelle commande' }
    ]));
  }, [dispatch]);

  const handleSubmit = async (orderData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await purchaseOrderService.create(orderData);
      navigate('/dashboard/purchases/orders');
    } catch (err) {
      setError(err.message || 'Erreur lors de la création de la commande');
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/purchases/orders');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Nouvelle commande d'achat
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Créer une nouvelle commande fournisseur
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

      {/* Purchase Order Form */}
      <Card>
        <InvoiceForm
          type="purchase"
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </Card>
    </div>
  );
};

export default PurchaseOrderCreate;
