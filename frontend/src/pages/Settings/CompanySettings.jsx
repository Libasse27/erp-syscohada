import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Card, Button, Alert, Input } from '../../components/common';
import { setBreadcrumb } from '../../store/slices/uiSlice';
import companyService from '../../services/companyService';

/**
 * Company Settings Page
 * Manage company information and configuration
 */
const CompanySettings = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    legalForm: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Sénégal',
    phone: '',
    email: '',
    website: '',
    taxNumber: '',
    tradeRegister: '',
    logo: '',
    currency: 'XOF',
    defaultVATRate: 18,
    fiscalYearStart: '01-01',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    dispatch(setBreadcrumb([
      { label: 'Paramètres', path: '/dashboard/settings' },
      { label: 'Informations de l\'entreprise' }
    ]));
    loadCompanySettings();
  }, [dispatch]);

  const loadCompanySettings = async () => {
    try {
      setLoading(true);
      const response = await companyService.getSettings();
      if (response.data) {
        setFormData(response.data);
      }
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des paramètres');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      await companyService.updateSettings(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Informations de l&apos;entreprise
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Gérez les informations et paramètres de votre entreprise
          </p>
        </div>
      </div>

      {error && <Alert variant="danger" onClose={() => setError(null)}>{error}</Alert>}
      {success && <Alert variant="success">Paramètres enregistrés avec succès</Alert>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card title="Informations générales">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input
                label="Nom de l'entreprise"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Ex: SARL SYSCOHADA BUSINESS"
              />
            </div>

            <Input
              label="Forme juridique"
              name="legalForm"
              value={formData.legalForm}
              onChange={handleChange}
              placeholder="Ex: SARL, SA, SAS, SUARL"
            />

            <Input
              label="Numéro NINEA"
              name="taxNumber"
              value={formData.taxNumber}
              onChange={handleChange}
              placeholder="Ex: 000123456"
            />

            <Input
              label="Registre du commerce"
              name="tradeRegister"
              value={formData.tradeRegister}
              onChange={handleChange}
              placeholder="Ex: SN-DKR-2024-A-12345"
            />

            <Input
              label="Téléphone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Ex: +221 33 123 45 67"
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ex: contact@entreprise.sn"
            />

            <div className="md:col-span-2">
              <Input
                label="Site web"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                placeholder="Ex: https://www.entreprise.sn"
              />
            </div>
          </div>
        </Card>

        <Card title="Adresse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input
                label="Adresse"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Ex: Rue 10, Cité Keur Gorgui"
              />
            </div>

            <Input
              label="Ville"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Ex: Dakar"
            />

            <Input
              label="Code postal"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="Ex: 12000"
            />

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Pays
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="Sénégal">Sénégal</option>
                <option value="Mali">Mali</option>
                <option value="Burkina Faso">Burkina Faso</option>
                <option value="Côte d'Ivoire">Côte d&apos;Ivoire</option>
                <option value="Bénin">Bénin</option>
                <option value="Togo">Togo</option>
                <option value="Niger">Niger</option>
                <option value="Guinée-Bissau">Guinée-Bissau</option>
              </select>
            </div>
          </div>
        </Card>

        <Card title="Paramètres comptables">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Devise
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="XOF">XOF (Franc CFA - BCEAO)</option>
                <option value="XAF">XAF (Franc CFA - BEAC)</option>
                <option value="EUR">EUR (Euro)</option>
                <option value="USD">USD (Dollar américain)</option>
              </select>
            </div>

            <Input
              label="Taux de TVA par défaut (%)"
              name="defaultVATRate"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={formData.defaultVATRate}
              onChange={handleChange}
              placeholder="Ex: 18"
            />

            <div className="md:col-span-2">
              <Input
                label="Début de l'exercice fiscal (JJ-MM)"
                name="fiscalYearStart"
                value={formData.fiscalYearStart}
                onChange={handleChange}
                placeholder="Ex: 01-01"
                pattern="[0-9]{2}-[0-9]{2}"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Format : JJ-MM (Ex: 01-01 pour 1er janvier, 01-07 pour 1er juillet)
              </p>
            </div>
          </div>
        </Card>

        <Card title="Logo de l'entreprise">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                URL du logo
              </label>
              <Input
                name="logo"
                value={formData.logo}
                onChange={handleChange}
                placeholder="Ex: https://example.com/logo.png"
              />
            </div>
            {formData.logo && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Aperçu :</p>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg inline-block">
                  <img
                    src={formData.logo}
                    alt="Logo entreprise"
                    className="max-h-32 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={loadCompanySettings}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Enregistrement...' : 'Enregistrer les paramètres'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CompanySettings;
