import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Card, Button, Badge, Alert, Input } from '../../components/common';
import { DataTable } from '../../components/tables';
import { ConfirmModal } from '../../components/modals';
import { setBreadcrumb } from '../../store/slices/uiSlice';
import bankAccountService from '../../services/bankAccountService';
import { formatCurrency } from '../../utils/formatters';

/**
 * Bank Account List Page
 * Displays and manages bank accounts and cash registers
 */
const BankAccountList = () => {
  const dispatch = useDispatch();

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    accountNumber: '',
    bankName: '',
    type: 'bank',
    currency: 'XOF',
    balance: 0,
    iban: '',
    swift: '',
  });
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    dispatch(setBreadcrumb([
      { label: 'Trésorerie', path: '/dashboard/treasury' },
      { label: 'Comptes bancaires' }
    ]));
  }, [dispatch]);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bankAccountService.getAll();
      setAccounts(response.data);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des comptes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setFormData({
      name: '',
      accountNumber: '',
      bankName: '',
      type: 'bank',
      currency: 'XOF',
      balance: 0,
      iban: '',
      swift: '',
    });
    setSelectedAccount(null);
    setEditModalOpen(true);
  };

  const handleEdit = (account) => {
    setFormData({
      name: account.name,
      accountNumber: account.accountNumber || '',
      bankName: account.bankName || '',
      type: account.type,
      currency: account.currency,
      balance: account.balance || 0,
      iban: account.iban || '',
      swift: account.swift || '',
    });
    setSelectedAccount(account);
    setEditModalOpen(true);
  };

  const handleDelete = (account) => {
    setSelectedAccount(account);
    setDeleteModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setFormError(null);
      if (selectedAccount) {
        await bankAccountService.update(selectedAccount._id, formData);
      } else {
        await bankAccountService.create(formData);
      }
      setEditModalOpen(false);
      loadAccounts();
    } catch (err) {
      setFormError(err.message || 'Erreur lors de l\'enregistrement');
    }
  };

  const confirmDelete = async () => {
    try {
      await bankAccountService.delete(selectedAccount._id);
      setDeleteModalOpen(false);
      setSelectedAccount(null);
      loadAccounts();
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression');
    }
  };

  const columns = [
    {
      header: 'Nom',
      accessor: 'name',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{row.name}</p>
          {row.type === 'bank' && row.accountNumber && (
            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
              {row.accountNumber}
            </p>
          )}
        </div>
      ),
    },
    {
      header: 'Type',
      accessor: 'type',
      width: '120px',
      render: (row) => {
        const typeLabels = {
          bank: 'Banque',
          cash: 'Caisse',
          mobile_money: 'Mobile Money',
        };
        const typeColors = {
          bank: 'info',
          cash: 'success',
          mobile_money: 'warning',
        };
        return (
          <Badge variant={typeColors[row.type] || 'default'}>
            {typeLabels[row.type] || row.type}
          </Badge>
        );
      },
    },
    {
      header: 'Banque',
      accessor: 'bankName',
      width: '160px',
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {row.bankName || '-'}
        </span>
      ),
    },
    {
      header: 'Devise',
      accessor: 'currency',
      width: '80px',
      cellClassName: 'text-center',
      render: (row) => (
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {row.currency}
        </span>
      ),
    },
    {
      header: 'Solde',
      accessor: 'balance',
      width: '160px',
      render: (row) => (
        <span className={`font-bold text-lg ${row.balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {formatCurrency(row.balance)}
        </span>
      ),
    },
    {
      header: 'Statut',
      accessor: 'isActive',
      width: '100px',
      cellClassName: 'text-center',
      render: (row) => (
        <Badge variant={row.isActive ? 'success' : 'default'}>
          {row.isActive ? 'Actif' : 'Inactif'}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      width: '120px',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex justify-end space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(row);
            }}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            }
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row);
            }}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            }
          />
        </div>
      ),
    },
  ];

  // Calculate statistics
  const stats = {
    total: accounts?.length || 0,
    bank: accounts?.filter(a => a.type === 'bank').length || 0,
    cash: accounts?.filter(a => a.type === 'cash').length || 0,
    mobileMoney: accounts?.filter(a => a.type === 'mobile_money').length || 0,
    totalBalance: accounts?.reduce((sum, a) => sum + (a.balance || 0), 0) || 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Comptes bancaires et caisses
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Gestion des comptes de trésorerie
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleCreate}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          }
        >
          Nouveau compte
        </Button>
      </div>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total comptes</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
        </Card>
        <Card className="text-center bg-blue-50 dark:bg-blue-900/30">
          <p className="text-sm text-gray-600 dark:text-gray-400">Banques</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.bank}</p>
        </Card>
        <Card className="text-center bg-green-50 dark:bg-green-900/30">
          <p className="text-sm text-gray-600 dark:text-gray-400">Caisses</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.cash}</p>
        </Card>
        <Card className="text-center bg-yellow-50 dark:bg-yellow-900/30">
          <p className="text-sm text-gray-600 dark:text-gray-400">Mobile Money</p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.mobileMoney}</p>
        </Card>
        <Card className="text-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30">
          <p className="text-sm text-gray-600 dark:text-gray-400">Solde total</p>
          <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
            {formatCurrency(stats.totalBalance)}
          </p>
        </Card>
      </div>

      <Card>
        <DataTable
          columns={columns}
          data={accounts}
          loading={loading}
          emptyMessage="Aucun compte bancaire"
        />
      </Card>

      {editModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setEditModalOpen(false)}></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {selectedAccount ? 'Modifier le compte' : 'Nouveau compte'}
              </h2>

              {formError && (
                <Alert variant="danger" className="mb-4" onClose={() => setFormError(null)}>
                  {formError}
                </Alert>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <Input
                  label="Nom du compte"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Ex: Compte principal SGBS"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="bank">Banque</option>
                    <option value="cash">Caisse</option>
                    <option value="mobile_money">Mobile Money</option>
                  </select>
                </div>

                {formData.type === 'bank' && (
                  <>
                    <Input
                      label="Nom de la banque"
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      placeholder="Ex: SGBS, BOA, Ecobank"
                    />
                    <Input
                      label="Numéro de compte"
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                      placeholder="Ex: 12345678901234"
                    />
                    <Input
                      label="IBAN (optionnel)"
                      value={formData.iban}
                      onChange={(e) => setFormData({ ...formData, iban: e.target.value })}
                      placeholder="Ex: SN08SN0100152000011111111111"
                    />
                    <Input
                      label="Code SWIFT/BIC (optionnel)"
                      value={formData.swift}
                      onChange={(e) => setFormData({ ...formData, swift: e.target.value })}
                      placeholder="Ex: SGBSSNDA"
                    />
                  </>
                )}

                {formData.type === 'mobile_money' && (
                  <Input
                    label="Numéro de téléphone"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    placeholder="Ex: +221 77 123 45 67"
                  />
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Devise
                    </label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="XOF">XOF (FCFA)</option>
                      <option value="EUR">EUR (Euro)</option>
                      <option value="USD">USD (Dollar)</option>
                    </select>
                  </div>
                  <Input
                    label="Solde initial"
                    type="number"
                    value={formData.balance}
                    onChange={(e) => setFormData({ ...formData, balance: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                    disabled={!!selectedAccount}
                  />
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setEditModalOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button type="submit" variant="primary">
                    {selectedAccount ? 'Mettre à jour' : 'Créer'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Supprimer le compte"
        message={`Êtes-vous sûr de vouloir supprimer le compte ${selectedAccount?.name} ? Cette action est irréversible.`}
        variant="danger"
      />
    </div>
  );
};

export default BankAccountList;
