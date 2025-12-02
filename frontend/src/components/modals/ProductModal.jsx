import { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from '../common';
import { ProductForm } from '../forms';

const ProductModal = ({ isOpen, onClose, product, onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      await onSubmit(values);
      onClose();
    } catch (error) {
      console.error('Error submitting product:', error);
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
      title={product ? 'Modifier le produit' : 'Nouveau produit'}
      size="xl"
      closeOnOverlayClick={!isLoading}
    >
      <ProductForm
        product={product}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </Modal>
  );
};

ProductModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
};

export default ProductModal;
