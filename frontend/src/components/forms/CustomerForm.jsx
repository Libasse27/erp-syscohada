import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from '../../hooks/useForm';
import { Input, Select, Button } from '../common';

const CustomerForm = ({ customer, onSubmit, onCancel, isLoading = false }) => {
  const initialValues = {
    name: customer?.name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    address: customer?.address || '',
    city: customer?.city || '',
    postalCode: customer?.postalCode || '',
    country: customer?.country || 'Sénégal',
    type: customer?.type || 'individual',
    taxId: customer?.taxId || '',
    website: customer?.website || '',
    notes: customer?.notes || '',
    status: customer?.status || 'active',
  };

  const validationRules = {
    name: {
      required: true,
      label: 'Nom',
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
    type: {
      required: true,
      label: 'Type',
    },
  };

  const form = useForm(initialValues, validationRules, onSubmit);

  useEffect(() => {
    if (customer) {
      form.setFormValues(initialValues);
    }
  }, [customer]); // eslint-disable-line react-hooks/exhaustive-deps

  const typeOptions = [
    { value: 'individual', label: 'Particulier' },
    { value: 'company', label: 'Entreprise' },
  ];

  const statusOptions = [
    { value: 'active', label: 'Actif' },
    { value: 'inactive', label: 'Inactif' },
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
            label="Nom complet / Raison sociale"
            placeholder="Jean Dupont / Entreprise SARL"
            required
          />
          <Select
            {...form.getFieldProps('type')}
            label="Type de client"
            options={typeOptions}
            required
          />
          <Input {...form.getFieldProps('email')} label="Email" placeholder="email@exemple.com" />
          <Input
            {...form.getFieldProps('phone')}
            label="Téléphone"
            placeholder="77 XXX XX XX"
            required
          />
          {form.values.type === 'company' && (
            <>
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
            </>
          )}
          <Select {...form.getFieldProps('status')} label="Statut" options={statusOptions} />
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

      {/* Notes */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Informations supplémentaires
        </h3>
        <Input
          {...form.getFieldProps('notes')}
          label="Notes"
          placeholder="Notes ou remarques sur le client..."
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
          {customer ? 'Mettre à jour' : 'Créer le client'}
        </Button>
      </div>
    </form>
  );
};

CustomerForm.propTypes = {
  customer: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default CustomerForm;
