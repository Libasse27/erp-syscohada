import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Alert } from '../../components/common';
import { PaymentForm } from '../../components/forms';
import { setBreadcrumb } from '../../store/slices/uiSlice';
import paymentService from '../../services/paymentService';

/**
 * Payment Create Page
 * Page for creating new payment transactions
 */
const PaymentCreate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(setBreadcrumb([
      { label: 'Trésorerie', path: '/dashboard/treasury' },
      { label: 'Paiements', path: '/dashboard/treasury/payments' },
      { label: 'Nouveau paiement' }
    ]));
  }, [dispatch]);

  const handleSubmit = async (paymentData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await paymentService.create(paymentData);
      navigate('/dashboard/treasury/payments');
    } catch (err) {
      setError(err.message || 'Erreur lors de la création du paiement');
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/treasury/payments');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Nouveau paiement
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Enregistrer un encaissement ou décaissement
          </p>
        </div>
        <Button variant="ghost" onClick={handleCancel}>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Annuler
        </Button>
      </div>

      {error && <Alert variant="danger" onClose={() => setError(null)}>{error}</Alert>}

      <Card>
        <PaymentForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </Card>
    </div>
  );
};

export default PaymentCreate;
