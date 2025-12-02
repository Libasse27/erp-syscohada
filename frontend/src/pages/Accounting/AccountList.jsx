import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Card, Button, Badge, SearchBar, Alert, Input } from '../../components/common';
import { DataTable } from '../../components/tables';
import { ConfirmModal } from '../../components/modals';
import { setBreadcrumb } from '../../store/slices/uiSlice';
import accountService from '../../services/accountService';
import { SYSCOHADA_CLASSES } from '../../utils/constants';

/**
 * Account List Page
 * Displays and manages chart of accounts (Plan comptable SYSCOHADA)
 */
const AccountList = () => {
  const dispatch = useDispatch();

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [formData, setFormData] = useState({
    accountNumber: '',
    name: '',
    type: '',
    class: '',
    description: '',
  });
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    dispatch(setBreadcrumb([
      { label: 'Comptabilité', path: '/dashboard/accounting' },
      { label: 'Plan comptable' }
    ]));
  }, [dispatch]);

  useEffect(() => {
    loadAccounts();
  }, [searchQuery, classFilter]);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        search: searchQuery,
        ...(classFilter !== 'all' && { class: classFilter }),
      };
      const response = await accountService.getAll(params);
      setAccounts(response.data);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des comptes');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleClassFilter = (classNum) => {
    setClassFilter(classNum);
  };

  const handleCreate = () => {
    setFormData({
      accountNumber: '',
      name: '',
      type: '',
      class: '',
      description: '',
    });
    setSelectedAccount(null);
    setEditModalOpen(true);
  };

  const handleEdit = (account) => {
    setFormData({
      accountNumber: account.accountNumber,
      name: account.name,
      type: account.type,
      class: account.class,
      description: account.description || '',
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
        await accountService.update(selectedAccount._id, formData);
      } else {
        await accountService.create(formData);
      }
      setEditModalOpen(false);
      loadAccounts();
    } catch (err) {
      setFormError(err.message || 'Erreur lors de l\'enregistrement');
    }
  };

  const confirmDelete = async () => {
    try {
      await accountService.delete(selectedAccount._id);
      setDeleteModalOpen(false);
      setSelectedAccount(null);
      loadAccounts();
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression');
    }
  };

  const columns = [
    {
      header: 'N° Compte',
      accessor: 'accountNumber',
      width: '140px',
      render: (row) => (
        <span className="font-mono font-medium text-gray-900 dark:text-white">
          {row.accountNumber}
        </span>
      ),
    },
    {
      header: 'Nom',
      accessor: 'name',
      render: (row) => (
        <span className="font-medium text-gray-900 dark:text-white">{row.name}</span>
      ),
    },
    {
      header: 'Classe',
      accessor: 'class',
      width: '100px',
      cellClassName: 'text-center',
      render: (row) => (
        <Badge variant="info">Classe {row.class}</Badge>
      ),
    },
    {
      header: 'Type',
      accessor: 'type',
      width: '140px',
      render: (row) => {
        const types = {
          asset: 'Actif',
          liability: 'Passif',
          equity: 'Capitaux propres',
          revenue: 'Produits',
          expense: 'Charges',
        };
        return (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {types[row.type] || row.type}
          </span>
        );
      },
    },
    {
      header: 'Solde',
      accessor: 'balance',
      width: '140px',
      render: (row) => (
        <span className={`font-semibold ${row.balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {row.balance?.toLocaleString('fr-FR')} XOF
        </span>
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

  // Group accounts by class for stats
  const stats = Object.keys(SYSCOHADA_CLASSES).reduce((acc, classNum) => {
    acc[classNum] = accounts.filter(a => a.class === classNum).length;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Plan comptable SYSCOHADA
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Gestion du plan comptable selon les normes SYSCOHADA
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

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Stats Cards - SYSCOHADA Classes */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {Object.entries(SYSCOHADA_CLASSES).map(([classNum, className]) => (
          <Card
            key={classNum}
            className={`text-center cursor-pointer transition-shadow ${classFilter === classNum ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => handleClassFilter(classFilter === classNum ? 'all' : classNum)}
          >
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Classe {classNum}</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{stats[classNum] || 0}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate" title={className}>
              {className.substring(0, 15)}...
            </p>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex flex-col gap-4">
          <SearchBar
            placeholder="Rechercher par numéro ou nom de compte..."
            onSearch={handleSearch}
          />
          <div className="flex flex-wrap gap-2">
            <Button
              variant={classFilter === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleClassFilter('all')}
            >
              Toutes les classes
            </Button>
            {Object.entries(SYSCOHADA_CLASSES).map(([classNum, className]) => (
              <Button
                key={classNum}
                variant={classFilter === classNum ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleClassFilter(classNum)}
              >
                Classe {classNum}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Accounts Table */}
      <Card>
        <DataTable
          columns={columns}
          data={accounts}
          loading={loading}
          emptyMessage="Aucun compte trouvé"
        />
      </Card>

      {/* Edit/Create Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setEditModalOpen(false)}></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
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
                  label="Numéro de compte"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  required
                  placeholder="Ex: 411000"
                  maxLength={6}
                />
                <Input
                  label="Nom du compte"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Ex: Clients"
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
                    <option value="">Sélectionner un type</option>
                    <option value="asset">Actif</option>
                    <option value="liability">Passif</option>
                    <option value="equity">Capitaux propres</option>
                    <option value="revenue">Produits</option>
                    <option value="expense">Charges</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Classe SYSCOHADA
                  </label>
                  <select
                    value={formData.class}
                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Sélectionner une classe</option>
                    {Object.entries(SYSCOHADA_CLASSES).map(([num, name]) => (
                      <option key={num} value={num}>
                        Classe {num} - {name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Description optionnelle..."
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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Supprimer le compte"
        message={`Êtes-vous sûr de vouloir supprimer le compte ${selectedAccount?.accountNumber} - ${selectedAccount?.name} ? Cette action est irréversible.`}
        variant="danger"
      />
    </div>
  );
};

export default AccountList;
