import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from '../../hooks/useForm';
import { Input, Select, Button } from '../common';

const ProductForm = ({ product, onSubmit, onCancel, isLoading = false }) => {
  const initialValues = {
    reference: product?.reference || '',
    name: product?.name || '',
    description: product?.description || '',
    category: product?.category || '',
    unit: product?.unit || 'pièce',
    purchasePrice: product?.purchasePrice || '',
    sellingPrice: product?.sellingPrice || '',
    stock: product?.stock || 0,
    minStock: product?.minStock || 0,
    maxStock: product?.maxStock || '',
    taxRate: product?.taxRate || 18,
    barcode: product?.barcode || '',
    status: product?.status || 'active',
  };

  const validationRules = {
    reference: {
      required: true,
      label: 'Référence',
    },
    name: {
      required: true,
      label: 'Nom du produit',
      minLength: 3,
    },
    category: {
      required: true,
      label: 'Catégorie',
    },
    unit: {
      required: true,
      label: 'Unité',
    },
    purchasePrice: {
      required: true,
      positive: true,
      label: 'Prix d\'achat',
    },
    sellingPrice: {
      required: true,
      positive: true,
      label: 'Prix de vente',
      custom: (value, formValues) => {
        if (parseFloat(value) < parseFloat(formValues.purchasePrice)) {
          return 'Le prix de vente doit être supérieur au prix d\'achat';
        }
        return null;
      },
    },
    minStock: {
      required: true,
      positive: true,
      label: 'Stock minimum',
    },
  };

  const form = useForm(initialValues, validationRules, onSubmit);

  useEffect(() => {
    if (product) {
      form.setFormValues(initialValues);
    }
  }, [product]); // eslint-disable-line react-hooks/exhaustive-deps

  const unitOptions = [
    { value: 'pièce', label: 'Pièce' },
    { value: 'kg', label: 'Kilogramme (Kg)' },
    { value: 'g', label: 'Gramme (g)' },
    { value: 'l', label: 'Litre (L)' },
    { value: 'ml', label: 'Millilitre (ml)' },
    { value: 'm', label: 'Mètre (m)' },
    { value: 'cm', label: 'Centimètre (cm)' },
    { value: 'carton', label: 'Carton' },
    { value: 'paquet', label: 'Paquet' },
    { value: 'boîte', label: 'Boîte' },
  ];

  const statusOptions = [
    { value: 'active', label: 'Actif' },
    { value: 'inactive', label: 'Inactif' },
    { value: 'discontinued', label: 'Discontinué' },
  ];

  return (
    <form onSubmit={form.handleSubmit} className="space-y-6">
      {/* Informations de base */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Informations de base
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            {...form.getFieldProps('reference')}
            label="Référence"
            placeholder="REF-001"
            required
          />
          <Input
            {...form.getFieldProps('name')}
            label="Nom du produit"
            placeholder="Nom du produit"
            required
          />
          <div className="md:col-span-2">
            <Input
              {...form.getFieldProps('description')}
              label="Description"
              placeholder="Description du produit"
              type="textarea"
            />
          </div>
          <Input
            {...form.getFieldProps('category')}
            label="Catégorie"
            placeholder="Électronique, Alimentaire, etc."
            required
          />
          <Select
            {...form.getFieldProps('unit')}
            label="Unité de mesure"
            options={unitOptions}
            required
          />
          <Input
            {...form.getFieldProps('barcode')}
            label="Code-barres"
            placeholder="1234567890123"
          />
          <Select
            {...form.getFieldProps('status')}
            label="Statut"
            options={statusOptions}
            required
          />
        </div>
      </div>

      {/* Prix */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Prix</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            {...form.getFieldProps('purchasePrice')}
            label="Prix d'achat (FCFA)"
            type="number"
            placeholder="0"
            required
          />
          <Input
            {...form.getFieldProps('sellingPrice')}
            label="Prix de vente (FCFA)"
            type="number"
            placeholder="0"
            required
          />
          <Input
            {...form.getFieldProps('taxRate')}
            label="Taux de TVA (%)"
            type="number"
            placeholder="18"
          />
        </div>
        {form.values.purchasePrice && form.values.sellingPrice && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Marge:{' '}
              {(
                ((form.values.sellingPrice - form.values.purchasePrice) /
                  form.values.purchasePrice) *
                100
              ).toFixed(2)}
              %
            </p>
          </div>
        )}
      </div>

      {/* Stock */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Gestion du stock
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            {...form.getFieldProps('stock')}
            label="Stock actuel"
            type="number"
            placeholder="0"
            disabled={!!product}
          />
          <Input
            {...form.getFieldProps('minStock')}
            label="Stock minimum"
            type="number"
            placeholder="0"
            required
          />
          <Input
            {...form.getFieldProps('maxStock')}
            label="Stock maximum"
            type="number"
            placeholder="0"
          />
        </div>
        {product && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Note: Pour modifier le stock actuel, utilisez les mouvements de stock.
            </p>
          </div>
        )}
      </div>

      {/* Boutons d'action */}
      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Annuler
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={isLoading || form.isSubmitting}
          disabled={!form.isValid || isLoading}
        >
          {product ? 'Mettre à jour' : 'Créer le produit'}
        </Button>
      </div>
    </form>
  );
};

ProductForm.propTypes = {
  product: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default ProductForm;
