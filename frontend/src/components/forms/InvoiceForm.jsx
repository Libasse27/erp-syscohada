import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from '../../hooks/useForm';
import { Input, Select, Button, DatePicker } from '../common';
import { formatCurrency } from '../../utils/formatters';
import { calculateInvoiceTotal } from '../../utils/currencyUtils';

const InvoiceForm = ({ invoice, onSubmit, onCancel, isLoading = false }) => {
  const [items, setItems] = useState(invoice?.items || []);

  const initialValues = {
    number: invoice?.number || '',
    date: invoice?.date || new Date().toISOString().split('T')[0],
    dueDate: invoice?.dueDate || '',
    type: invoice?.type || 'sale',
    customerId: invoice?.customerId || '',
    supplierId: invoice?.supplierId || '',
    discount: invoice?.discount || 0,
    taxRate: invoice?.taxRate || 18,
    notes: invoice?.notes || '',
    status: invoice?.status || 'draft',
  };

  const validationRules = {
    number: {
      required: true,
      label: 'Numéro de facture',
    },
    date: {
      required: true,
      label: 'Date',
    },
    dueDate: {
      required: true,
      label: 'Date d\'échéance',
    },
  };

  const form = useForm(initialValues, validationRules, (values) => {
    onSubmit({ ...values, items });
  });

  useEffect(() => {
    if (invoice) {
      form.setFormValues(initialValues);
      setItems(invoice.items || []);
    }
  }, [invoice]); // eslint-disable-line react-hooks/exhaustive-deps

  // Add new item
  const addItem = () => {
    setItems([
      ...items,
      {
        description: '',
        quantity: 1,
        unitPrice: 0,
        total: 0,
      },
    ]);
  };

  // Remove item
  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Update item
  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    // Calculate total
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
    }

    setItems(newItems);
  };

  // Calculate totals
  const totals = calculateInvoiceTotal(items, form.values.discount, form.values.taxRate);

  const typeOptions = [
    { value: 'sale', label: 'Facture de vente' },
    { value: 'purchase', label: 'Facture d\'achat' },
  ];

  const statusOptions = [
    { value: 'draft', label: 'Brouillon' },
    { value: 'pending', label: 'En attente' },
    { value: 'validated', label: 'Validée' },
    { value: 'paid', label: 'Payée' },
    { value: 'cancelled', label: 'Annulée' },
  ];

  return (
    <form onSubmit={form.handleSubmit} className="space-y-6">
      {/* En-tête de facture */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Informations de la facture
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            {...form.getFieldProps('number')}
            label="Numéro de facture"
            placeholder="FAC-001"
            required
          />
          <Select {...form.getFieldProps('type')} label="Type" options={typeOptions} required />
          <Select
            {...form.getFieldProps('status')}
            label="Statut"
            options={statusOptions}
            required
          />
          <DatePicker
            {...form.getFieldProps('date')}
            label="Date de facture"
            name="date"
            required
          />
          <DatePicker
            {...form.getFieldProps('dueDate')}
            label="Date d'échéance"
            name="dueDate"
            required
          />
          {form.values.type === 'sale' ? (
            <Input
              {...form.getFieldProps('customerId')}
              label="Client"
              placeholder="Sélectionner un client"
              required
            />
          ) : (
            <Input
              {...form.getFieldProps('supplierId')}
              label="Fournisseur"
              placeholder="Sélectionner un fournisseur"
              required
            />
          )}
        </div>
      </div>

      {/* Lignes de facture */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Articles</h3>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            + Ajouter un article
          </Button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Aucun article ajouté. Cliquez sur "Ajouter un article" pour commencer.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-right w-24">Quantité</th>
                  <th className="px-4 py-2 text-right w-32">Prix unitaire</th>
                  <th className="px-4 py-2 text-right w-32">Total</th>
                  <th className="px-4 py-2 w-16"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="border-b dark:border-gray-700">
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                        placeholder="Description de l'article"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value))}
                        className="w-full px-2 py-1 border rounded text-right dark:bg-gray-700 dark:border-gray-600"
                        min="0"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) =>
                          updateItem(index, 'unitPrice', parseFloat(e.target.value))
                        }
                        className="w-full px-2 py-1 border rounded text-right dark:bg-gray-700 dark:border-gray-600"
                        min="0"
                      />
                    </td>
                    <td className="px-4 py-2 text-right font-medium">
                      {formatCurrency(item.total)}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Totaux et remises */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Remise et TVA */}
          <div className="space-y-4">
            <Input
              {...form.getFieldProps('discount')}
              label="Remise (%)"
              type="number"
              placeholder="0"
              min="0"
              max="100"
            />
            <Input
              {...form.getFieldProps('taxRate')}
              label="TVA (%)"
              type="number"
              placeholder="18"
              min="0"
            />
          </div>

          {/* Calcul des totaux */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Sous-total:</span>
              <span>{formatCurrency(totals.subtotal)}</span>
            </div>
            {totals.discountAmount > 0 && (
              <div className="flex justify-between text-sm text-red-600">
                <span>Remise ({form.values.discount}%):</span>
                <span>-{formatCurrency(totals.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span>Montant HT:</span>
              <span>{formatCurrency(totals.taxableAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>TVA ({form.values.taxRate}%):</span>
              <span>{formatCurrency(totals.taxAmount)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t">
              <span>Total TTC:</span>
              <span className="text-blue-600">{formatCurrency(totals.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <Input
          {...form.getFieldProps('notes')}
          label="Notes"
          placeholder="Notes supplémentaires..."
          type="textarea"
        />
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
          disabled={items.length === 0 || !form.isValid || isLoading}
        >
          {invoice ? 'Mettre à jour' : 'Créer la facture'}
        </Button>
      </div>
    </form>
  );
};

InvoiceForm.propTypes = {
  invoice: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default InvoiceForm;
