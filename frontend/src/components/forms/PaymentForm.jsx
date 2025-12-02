import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from '../../hooks/useForm';
import { Input, Select, Button, DatePicker } from '../common';
import { PAYMENT_METHODS, PAYMENT_METHOD_LABELS, MOBILE_MONEY_PROVIDERS, MOBILE_MONEY_PROVIDER_LABELS } from '../../utils/constants';

const PaymentForm = ({ payment, invoice, onSubmit, onCancel, isLoading = false }) => {
  const initialValues = {
    invoiceId: payment?.invoiceId || invoice?._id || '',
    amount: payment?.amount || invoice?.total || '',
    date: payment?.date || new Date().toISOString().split('T')[0],
    method: payment?.method || PAYMENT_METHODS.CASH,
    reference: payment?.reference || '',
    mobileMoneyProvider: payment?.mobileMoneyProvider || '',
    mobileMoneyNumber: payment?.mobileMoneyNumber || '',
    checkNumber: payment?.checkNumber || '',
    bankName: payment?.bankName || '',
    notes: payment?.notes || '',
  };

  const validationRules = {
    invoiceId: {
      required: true,
      label: 'Facture',
    },
    amount: {
      required: true,
      positive: true,
      label: 'Montant',
    },
    date: {
      required: true,
      label: 'Date de paiement',
    },
    method: {
      required: true,
      label: 'Méthode de paiement',
    },
  };

  const form = useForm(initialValues, validationRules, onSubmit);

  useEffect(() => {
    if (payment) {
      form.setFormValues(initialValues);
    }
  }, [payment]); // eslint-disable-line react-hooks/exhaustive-deps

  const paymentMethodOptions = Object.keys(PAYMENT_METHODS).map((key) => ({
    value: PAYMENT_METHODS[key],
    label: PAYMENT_METHOD_LABELS[PAYMENT_METHODS[key]],
  }));

  const mobileMoneyProviderOptions = Object.keys(MOBILE_MONEY_PROVIDERS).map((key) => ({
    value: MOBILE_MONEY_PROVIDERS[key],
    label: MOBILE_MONEY_PROVIDER_LABELS[MOBILE_MONEY_PROVIDERS[key]],
  }));

  const selectedMethod = form.values.method;

  return (
    <form onSubmit={form.handleSubmit} className="space-y-6">
      {/* Informations de paiement */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Informations de paiement
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {invoice && (
            <div className="md:col-span-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Facture:</strong> {invoice.number}
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Montant total:</strong> {invoice.total} FCFA
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Montant restant:</strong> {invoice.remainingAmount || invoice.total} FCFA
              </p>
            </div>
          )}

          <Input
            {...form.getFieldProps('amount')}
            label="Montant du paiement (FCFA)"
            type="number"
            placeholder="0"
            required
          />
          <DatePicker
            {...form.getFieldProps('date')}
            label="Date de paiement"
            name="date"
            required
          />
        </div>
      </div>

      {/* Méthode de paiement */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Méthode de paiement
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Select
              {...form.getFieldProps('method')}
              label="Méthode"
              options={paymentMethodOptions}
              required
            />
          </div>

          {/* Champs spécifiques selon la méthode */}
          {selectedMethod === PAYMENT_METHODS.MOBILE_MONEY && (
            <>
              <Select
                {...form.getFieldProps('mobileMoneyProvider')}
                label="Opérateur Mobile Money"
                options={mobileMoneyProviderOptions}
                placeholder="Sélectionner un opérateur"
                required
              />
              <Input
                {...form.getFieldProps('mobileMoneyNumber')}
                label="Numéro de téléphone"
                placeholder="77 XXX XX XX"
                required
              />
            </>
          )}

          {selectedMethod === PAYMENT_METHODS.CHECK && (
            <>
              <Input
                {...form.getFieldProps('checkNumber')}
                label="Numéro de chèque"
                placeholder="XXXX-XXXX"
                required
              />
              <Input
                {...form.getFieldProps('bankName')}
                label="Nom de la banque"
                placeholder="Banque XXX"
                required
              />
            </>
          )}

          {(selectedMethod === PAYMENT_METHODS.BANK_TRANSFER ||
            selectedMethod === PAYMENT_METHODS.CREDIT_CARD) && (
            <div className="md:col-span-2">
              <Input
                {...form.getFieldProps('reference')}
                label="Référence de transaction"
                placeholder="REF-XXXXXXXXX"
                required
              />
            </div>
          )}

          {selectedMethod === PAYMENT_METHODS.CASH && (
            <div className="md:col-span-2">
              <Input
                {...form.getFieldProps('reference')}
                label="Référence (optionnelle)"
                placeholder="Numéro de reçu, etc."
              />
            </div>
          )}
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Informations supplémentaires
        </h3>
        <Input
          {...form.getFieldProps('notes')}
          label="Notes"
          placeholder="Notes ou remarques sur le paiement..."
          type="textarea"
        />
      </div>

      {/* Avertissements */}
      {invoice && parseFloat(form.values.amount) > parseFloat(invoice.remainingAmount || invoice.total) && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-700">
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            ⚠️ Le montant du paiement est supérieur au montant restant dû. Un avoir sera créé automatiquement.
          </p>
        </div>
      )}

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
          {payment ? 'Mettre à jour' : 'Enregistrer le paiement'}
        </Button>
      </div>
    </form>
  );
};

PaymentForm.propTypes = {
  payment: PropTypes.object,
  invoice: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default PaymentForm;
