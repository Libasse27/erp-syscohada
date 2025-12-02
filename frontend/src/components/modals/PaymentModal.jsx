import { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from '../common';
import { PaymentForm } from '../forms';

const PaymentModal = ({ isOpen, onClose, payment, invoice, onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      await onSubmit(values);
      onClose();
    } catch (error) {
      console.error('Error submitting payment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={payment ? 'Modifier le paiement' : 'Nouveau paiement'}
      size="lg"
      closeOnOverlayClick={!isLoading}
    >
      <PaymentForm
        payment={payment}
        invoice={invoice}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </Modal>
  );
};

PaymentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  payment: PropTypes.object,
  invoice: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
};

export default PaymentModal;
