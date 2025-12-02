import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Alert } from '../../components/common';
import { InvoiceForm } from '../../components/forms';
import { setBreadcrumb } from '../../store/slices/uiSlice';
import quoteService from '../../services/quoteService';

/**
 * Quote Create Page
 * Form to create a new quote/devis
 * Reuses InvoiceForm component as structure is similar
 */
const QuoteCreate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(setBreadcrumb([
      { label: 'Ventes', path: '/dashboard/sales' },
      { label: 'Devis', path: '/dashboard/sales/quotes' },
      { label: 'Nouveau devis' }
    ]));
  }, [dispatch]);

  const handleSubmit = async (quoteData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await quoteService.create(quoteData);
      navigate('/dashboard/sales/quotes');
    } catch (err) {
      setError(err.message || 'Erreur lors de la création du devis');
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/sales/quotes');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Nouveau devis
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Créer un nouveau devis de vente
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

      {/* Quote Form */}
      <Card>
        <InvoiceForm
          type="quote"
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </Card>
    </div>
  );
};

export default QuoteCreate;
