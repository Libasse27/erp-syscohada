import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from '../../hooks/useForm';
import { Input, Select, Button } from '../common';

const SupplierForm = ({ supplier, onSubmit, onCancel, isLoading = false }) => {
  const initialValues = {
    name: supplier?.name || '',
    email: supplier?.email || '',
    phone: supplier?.phone || '',
    address: supplier?.address || '',
    city: supplier?.city || '',
    postalCode: supplier?.postalCode || '',
    country: supplier?.country || 'Sénégal',
    taxId: supplier?.taxId || '',
    website: supplier?.website || '',
    contactPerson: supplier?.contactPerson || '',
    contactPhone: supplier?.contactPhone || '',
    paymentTerms: supplier?.paymentTerms || '30',
    currency: supplier?.currency || 'XOF',
    notes: supplier?.notes || '',
    status: supplier?.status || 'active',
  };

  const validationRules = {
    name: {
      required: true,
      label: 'Nom du fournisseur',
      minLength: 3,
    },
    email: {
      email: true,
      label: 'Email',
    },
    phone: {
      required: true,
      phone: true,
      label: 'Téléphone',
    },
    address: {
      required: true,
      label: 'Adresse',
    },
    city: {
      required: true,
      label: 'Ville',
    },
  };

  const form = useForm(initialValues, validationRules, onSubmit);

  useEffect(() => {
    if (supplier) {
      form.setFormValues(initialValues);
    }
  }, [supplier]); // eslint-disable-line react-hooks/exhaustive-deps

  const statusOptions = [
    { value: 'active', label: 'Actif' },
    { value: 'inactive', label: 'Inactif' },
  ];

  const paymentTermsOptions = [
    { value: '0', label: 'Paiement immédiat' },
    { value: '15', label: '15 jours' },
    { value: '30', label: '30 jours' },
    { value: '45', label: '45 jours' },
    { value: '60', label: '60 jours' },
    { value: '90', label: '90 jours' },
  ];

  const currencyOptions = [
    { value: 'XOF', label: 'FCFA (XOF)' },
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'USD', label: 'Dollar US (USD)' },
  ];

  const countryOptions = [
    { value: 'Sénégal', label: 'Sénégal' },
    { value: 'Mali', label: 'Mali' },
    { value: 'Côte d\'Ivoire', label: 'Côte d\'Ivoire' },
    { value: 'Burkina Faso', label: 'Burkina Faso' },
    { value: 'Niger', label: 'Niger' },
    { value: 'Togo', label: 'Togo' },
    { value: 'Bénin', label: 'Bénin' },
    { value: 'Guinée', label: 'Guinée' },
  ];

  return (
    <form onSubmit={form.handleSubmit} className="space-y-6">
      {/* Informations générales */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Informations générales
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            {...form.getFieldProps('name')}
            label="Nom du fournisseur"
            placeholder="Entreprise Fournisseur SARL"
            required
          />
          <Select {...form.getFieldProps('status')} label="Statut" options={statusOptions} />
          <Input {...form.getFieldProps('email')} label="Email" placeholder="email@exemple.com" />
          <Input
            {...form.getFieldProps('phone')}
            label="Téléphone"
            placeholder="77 XXX XX XX"
            required
          />
          <Input
            {...form.getFieldProps('taxId')}
            label="Numéro d'identification fiscale"
            placeholder="NIF-XXXXXXXXXX"
          />
          <Input
            {...form.getFieldProps('website')}
            label="Site web"
            placeholder="https://www.exemple.com"
          />
        </div>
      </div>

      {/* Personne de contact */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Personne de contact
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            {...form.getFieldProps('contactPerson')}
            label="Nom du contact"
            placeholder="Jean Dupont"
          />
          <Input
            {...form.getFieldProps('contactPhone')}
            label="Téléphone du contact"
            placeholder="77 XXX XX XX"
          />
        </div>
      </div>

      {/* Adresse */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Adresse</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              {...form.getFieldProps('address')}
              label="Adresse"
              placeholder="123 Rue de la République"
              required
            />
          </div>
          <Input {...form.getFieldProps('city')} label="Ville" placeholder="Dakar" required />
          <Input
            {...form.getFieldProps('postalCode')}
            label="Code postal"
            placeholder="12345"
          />
          <div className="md:col-span-2">
            <Select
              {...form.getFieldProps('country')}
              label="Pays"
              options={countryOptions}
              required
            />
          </div>
        </div>
      </div>

      {/* Conditions commerciales */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Conditions commerciales
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            {...form.getFieldProps('paymentTerms')}
            label="Délai de paiement"
            options={paymentTermsOptions}
          />
          <Select
            {...form.getFieldProps('currency')}
            label="Devise"
            options={currencyOptions}
          />
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
          placeholder="Notes ou remarques sur le fournisseur..."
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
          disabled={!form.isValid || isLoading}
        >
          {supplier ? 'Mettre à jour' : 'Créer le fournisseur'}
        </Button>
      </div>
    </form>
  );
};

SupplierForm.propTypes = {
  supplier: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default SupplierForm;
