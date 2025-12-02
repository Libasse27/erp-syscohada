import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from '../../hooks/useForm';
import { Input, Select, Button, DatePicker } from '../common';
import { formatCurrency } from '../../utils/formatters';

const AccountingEntryForm = ({ entry, onSubmit, onCancel, isLoading = false }) => {
  const [lines, setLines] = useState(entry?.lines || []);

  const initialValues = {
    date: entry?.date || new Date().toISOString().split('T')[0],
    reference: entry?.reference || '',
    description: entry?.description || '',
    journal: entry?.journal || 'general',
    status: entry?.status || 'draft',
  };

  const validationRules = {
    date: {
      required: true,
      label: 'Date',
    },
    reference: {
      required: true,
      label: 'Référence',
    },
    description: {
      required: true,
      label: 'Description',
    },
    journal: {
      required: true,
      label: 'Journal',
    },
  };

  const form = useForm(initialValues, validationRules, (values) => {
    onSubmit({ ...values, lines });
  });

  useEffect(() => {
    if (entry) {
      form.setFormValues(initialValues);
      setLines(entry.lines || []);
    }
  }, [entry]); // eslint-disable-line react-hooks/exhaustive-deps

  // Add new line
  const addLine = () => {
    setLines([
      ...lines,
      {
        accountCode: '',
        accountName: '',
        description: '',
        debit: 0,
        credit: 0,
      },
    ]);
  };

  // Remove line
  const removeLine = (index) => {
    setLines(lines.filter((_, i) => i !== index));
  };

  // Update line
  const updateLine = (index, field, value) => {
    const newLines = [...lines];
    newLines[index][field] = value;

    // Ensure only debit OR credit is filled
    if (field === 'debit' && value > 0) {
      newLines[index].credit = 0;
    }
    if (field === 'credit' && value > 0) {
      newLines[index].debit = 0;
    }

    setLines(newLines);
  };

  // Calculate totals
  const totalDebit = lines.reduce((sum, line) => sum + parseFloat(line.debit || 0), 0);
  const totalCredit = lines.reduce((sum, line) => sum + parseFloat(line.credit || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

  const journalOptions = [
    { value: 'general', label: 'Journal Général' },
    { value: 'sales', label: 'Journal des Ventes' },
    { value: 'purchases', label: 'Journal des Achats' },
    { value: 'bank', label: 'Journal de Banque' },
    { value: 'cash', label: 'Journal de Caisse' },
    { value: 'operations', label: 'Journal des Opérations Diverses' },
  ];

  const statusOptions = [
    { value: 'draft', label: 'Brouillon' },
    { value: 'validated', label: 'Validée' },
  ];

  return (
    <form onSubmit={form.handleSubmit} className="space-y-6">
      {/* En-tête */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Informations de l'écriture
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DatePicker {...form.getFieldProps('date')} label="Date" name="date" required />
          <Input
            {...form.getFieldProps('reference')}
            label="Numéro de pièce"
            placeholder="ECR-001"
            required
          />
          <Select
            {...form.getFieldProps('journal')}
            label="Journal"
            options={journalOptions}
            required
          />
          <Select
            {...form.getFieldProps('status')}
            label="Statut"
            options={statusOptions}
            required
          />
          <div className="md:col-span-2">
            <Input
              {...form.getFieldProps('description')}
              label="Description"
              placeholder="Description de l'écriture comptable"
              required
            />
          </div>
        </div>
      </div>

      {/* Lignes d'écriture */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Lignes d'écriture
          </h3>
          <Button type="button" variant="outline" size="sm" onClick={addLine}>
            + Ajouter une ligne
          </Button>
        </div>

        {lines.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Aucune ligne ajoutée. Cliquez sur "Ajouter une ligne" pour commencer.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left w-32">Compte</th>
                  <th className="px-4 py-2 text-left">Libellé</th>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-right w-32">Débit</th>
                  <th className="px-4 py-2 text-right w-32">Crédit</th>
                  <th className="px-4 py-2 w-16"></th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line, index) => (
                  <tr key={index} className="border-b dark:border-gray-700">
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={line.accountCode}
                        onChange={(e) => updateLine(index, 'accountCode', e.target.value)}
                        className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                        placeholder="Ex: 411"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={line.accountName}
                        onChange={(e) => updateLine(index, 'accountName', e.target.value)}
                        className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                        placeholder="Nom du compte"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={line.description}
                        onChange={(e) => updateLine(index, 'description', e.target.value)}
                        className="w-full px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                        placeholder="Description"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={line.debit}
                        onChange={(e) => updateLine(index, 'debit', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 border rounded text-right dark:bg-gray-700 dark:border-gray-600"
                        min="0"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={line.credit}
                        onChange={(e) => updateLine(index, 'credit', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 border rounded text-right dark:bg-gray-700 dark:border-gray-600"
                        min="0"
                      />
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => removeLine(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 dark:bg-gray-700 font-bold">
                <tr>
                  <td colSpan="3" className="px-4 py-2 text-right">
                    Totaux:
                  </td>
                  <td className="px-4 py-2 text-right">{formatCurrency(totalDebit)}</td>
                  <td className="px-4 py-2 text-right">{formatCurrency(totalCredit)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {/* Balance check */}
        {lines.length > 0 && (
          <div className={`mt-4 p-4 rounded ${isBalanced ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${isBalanced ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                {isBalanced ? '✓ Écriture équilibrée' : '⚠️ Écriture non équilibrée'}
              </span>
              <span className={`text-sm ${isBalanced ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                Différence: {formatCurrency(Math.abs(totalDebit - totalCredit))}
              </span>
            </div>
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
          disabled={lines.length === 0 || !isBalanced || !form.isValid || isLoading}
        >
          {entry ? 'Mettre à jour' : 'Enregistrer l'écriture'}
        </Button>
      </div>
    </form>
  );
};

AccountingEntryForm.propTypes = {
  entry: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default AccountingEntryForm;
