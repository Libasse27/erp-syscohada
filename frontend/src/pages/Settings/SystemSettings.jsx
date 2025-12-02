import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button, Alert } from '../../components/common';
import { setBreadcrumb } from '../../store/slices/uiSlice';
import { selectTheme, setTheme } from '../../store/slices/uiSlice';
import systemService from '../../services/systemService';

/**
 * System Settings Page
 * Manage application and system preferences
 */
const SystemSettings = () => {
  const dispatch = useDispatch();
  const currentTheme = useSelector(selectTheme);

  const [settings, setSettings] = useState({
    language: 'fr',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: 'fr-FR',
    timezone: 'Africa/Dakar',
    autoBackup: true,
    backupFrequency: 'daily',
    emailNotifications: true,
    invoicePrefix: 'FAC-',
    quotePrefix: 'DEV-',
    purchaseOrderPrefix: 'CMD-',
    receiptPrefix: 'REC-',
    paymentPrefix: 'PAY-',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    dispatch(setBreadcrumb([
      { label: 'Paramètres', path: '/dashboard/settings' },
      { label: 'Paramètres système' }
    ]));
    loadSystemSettings();
  }, [dispatch]);

  const loadSystemSettings = async () => {
    try {
      setLoading(true);
      const response = await systemService.getSettings();
      if (response.data) {
        setSettings(response.data);
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
      await systemService.updateSettings(settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleThemeChange = (newTheme) => {
    dispatch(setTheme(newTheme));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Paramètres système
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Configuration de l&apos;application et préférences système
          </p>
        </div>
      </div>

      {error && <Alert variant="danger" onClose={() => setError(null)}>{error}</Alert>}
      {success && <Alert variant="success">Paramètres enregistrés avec succès</Alert>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card title="Apparence">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Thème
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => handleThemeChange('light')}
                  className={`flex-1 p-4 border-2 rounded-lg transition-all ${
                    currentTheme === 'light'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-center mb-2">
                    <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Clair</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleThemeChange('dark')}
                  className={`flex-1 p-4 border-2 rounded-lg transition-all ${
                    currentTheme === 'dark'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-center mb-2">
                    <svg className="w-8 h-8 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Sombre</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleThemeChange('system')}
                  className={`flex-1 p-4 border-2 rounded-lg transition-all ${
                    currentTheme === 'system'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-center mb-2">
                    <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Système</p>
                </button>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Localisation">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Langue
              </label>
              <select
                value={settings.language}
                onChange={(e) => handleChange('language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fuseau horaire
              </label>
              <select
                value={settings.timezone}
                onChange={(e) => handleChange('timezone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="Africa/Dakar">Dakar (GMT)</option>
                <option value="Africa/Abidjan">Abidjan (GMT)</option>
                <option value="Africa/Bamako">Bamako (GMT)</option>
                <option value="Africa/Lagos">Lagos (WAT)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Format de date
              </label>
              <select
                value={settings.dateFormat}
                onChange={(e) => handleChange('dateFormat', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="DD/MM/YYYY">JJ/MM/AAAA (31/12/2024)</option>
                <option value="MM/DD/YYYY">MM/JJ/AAAA (12/31/2024)</option>
                <option value="YYYY-MM-DD">AAAA-MM-JJ (2024-12-31)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Format de nombres
              </label>
              <select
                value={settings.numberFormat}
                onChange={(e) => handleChange('numberFormat', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="fr-FR">Français (1 234,56)</option>
                <option value="en-US">Anglais (1,234.56)</option>
              </select>
            </div>
          </div>
        </Card>

        <Card title="Numérotation des documents">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Préfixe factures
              </label>
              <input
                type="text"
                value={settings.invoicePrefix}
                onChange={(e) => handleChange('invoicePrefix', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="FAC-"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Exemple : {settings.invoicePrefix}2024-001
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Préfixe devis
              </label>
              <input
                type="text"
                value={settings.quotePrefix}
                onChange={(e) => handleChange('quotePrefix', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="DEV-"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Exemple : {settings.quotePrefix}2024-001
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Préfixe commandes d&apos;achat
              </label>
              <input
                type="text"
                value={settings.purchaseOrderPrefix}
                onChange={(e) => handleChange('purchaseOrderPrefix', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="CMD-"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Préfixe paiements
              </label>
              <input
                type="text"
                value={settings.paymentPrefix}
                onChange={(e) => handleChange('paymentPrefix', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="PAY-"
              />
            </div>
          </div>
        </Card>

        <Card title="Sauvegarde et notifications">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Sauvegarde automatique</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Créer automatiquement des sauvegardes de la base de données
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoBackup}
                  onChange={(e) => handleChange('autoBackup', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {settings.autoBackup && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fréquence de sauvegarde
                </label>
                <select
                  value={settings.backupFrequency}
                  onChange={(e) => handleChange('backupFrequency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="hourly">Toutes les heures</option>
                  <option value="daily">Quotidienne</option>
                  <option value="weekly">Hebdomadaire</option>
                </select>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Notifications par email</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Recevoir des notifications par email pour les événements importants
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={loadSystemSettings}
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

export default SystemSettings;
