import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button, Alert, Input, Badge } from '../../components/common';
import { DataTable } from '../../components/tables';
import { ConfirmModal } from '../../components/modals';
import { setBreadcrumb } from '../../store/slices/uiSlice';
import { selectCurrentUser } from '../../store/slices/authSlice';
import userService from '../../services/userService';

/**
 * User Settings Page
 * Manage users and permissions
 */
const UserSettings = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    password: '',
    isActive: true,
  });
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    dispatch(setBreadcrumb([
      { label: 'Param�tres', path: '/dashboard/settings' },
      { label: 'Gestion des utilisateurs' }
    ]));
  }, [dispatch]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getAll();
      setUsers(response.data);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setFormData({
      name: '',
      email: '',
      role: 'user',
      password: '',
      isActive: true,
    });
    setSelectedUser(null);
    setEditModalOpen(true);
  };

  const handleEdit = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      password: '',
      isActive: user.isActive,
    });
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setFormError(null);
      const dataToSend = { ...formData };

      // Don't send password if empty on update
      if (selectedUser && !dataToSend.password) {
        delete dataToSend.password;
      }

      if (selectedUser) {
        await userService.update(selectedUser._id, dataToSend);
      } else {
        await userService.create(dataToSend);
      }
      setEditModalOpen(false);
      loadUsers();
    } catch (err) {
      setFormError(err.message || 'Erreur lors de l\'enregistrement');
    }
  };

  const confirmDelete = async () => {
    try {
      await userService.delete(selectedUser._id);
      setDeleteModalOpen(false);
      setSelectedUser(null);
      loadUsers();
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression');
    }
  };

  const toggleUserStatus = async (user) => {
    try {
      await userService.update(user._id, { isActive: !user.isActive });
      loadUsers();
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise � jour');
    }
  };

  const columns = [
    {
      header: 'Nom',
      accessor: 'name',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{row.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{row.email}</p>
        </div>
      ),
    },
    {
      header: 'R�le',
      accessor: 'role',
      width: '140px',
      render: (row) => {
        const roleLabels = {
          admin: 'Administrateur',
          manager: 'Gestionnaire',
          accountant: 'Comptable',
          user: 'Utilisateur',
        };
        const roleColors = {
          admin: 'danger',
          manager: 'warning',
          accountant: 'info',
          user: 'default',
        };
        return (
          <Badge variant={roleColors[row.role] || 'default'}>
            {roleLabels[row.role] || row.role}
          </Badge>
        );
      },
    },
    {
      header: 'Statut',
      accessor: 'isActive',
      width: '120px',
      cellClassName: 'text-center',
      render: (row) => (
        <Badge variant={row.isActive ? 'success' : 'default'}>
          {row.isActive ? 'Actif' : 'Inactif'}
        </Badge>
      ),
    },
    {
      header: 'Derni�re connexion',
      accessor: 'lastLogin',
      width: '160px',
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {row.lastLogin ? new Date(row.lastLogin).toLocaleDateString('fr-FR') : 'Jamais'}
        </span>
      ),
    },
    {
      header: 'Actions',
      width: '160px',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex justify-end space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              toggleUserStatus(row);
            }}
            disabled={row._id === currentUser?._id}
            icon={
              row.isActive ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )
            }
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(row);
            }}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
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
            disabled={row._id === currentUser?._id}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            }
          />
        </div>
      ),
    },
  ];

  const stats = {
    total: users?.length || 0,
    active: users?.filter(u => u.isActive).length || 0,
    inactive: users?.filter(u => !u.isActive).length || 0,
    admins: users?.filter(u => u.role === 'admin').length || 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestion des utilisateurs
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            G�rez les comptes et permissions des utilisateurs
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleCreate}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }
        >
          Nouvel utilisateur
        </Button>
      </div>

      {error && <Alert variant="danger" onClose={() => setError(null)}>{error}</Alert>}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
        </Card>
        <Card className="text-center bg-green-50 dark:bg-green-900/30">
          <p className="text-sm text-gray-600 dark:text-gray-400">Actifs</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.active}</p>
        </Card>
        <Card className="text-center bg-gray-50 dark:bg-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">Inactifs</p>
          <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">{stats.inactive}</p>
        </Card>
        <Card className="text-center bg-red-50 dark:bg-red-900/30">
          <p className="text-sm text-gray-600 dark:text-gray-400">Administrateurs</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.admins}</p>
        </Card>
      </div>

      <Card>
        <DataTable
          columns={columns}
          data={users}
          loading={loading}
          emptyMessage="Aucun utilisateur"
        />
      </Card>

      {editModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setEditModalOpen(false)}></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {selectedUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
              </h2>

              {formError && (
                <Alert variant="danger" className="mb-4" onClose={() => setFormError(null)}>
                  {formError}
                </Alert>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <Input
                  label="Nom complet"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Ex: Jean Dupont"
                />

                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="Ex: jean.dupont@entreprise.sn"
                />

                <Input
                  label={selectedUser ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe'}
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!selectedUser}
                  placeholder="Entrez le mot de passe"
                  minLength={6}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    R�le
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="user">Utilisateur</option>
                    <option value="accountant">Comptable</option>
                    <option value="manager">Gestionnaire</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-700 dark:text-gray-300">
                    Compte actif
                  </label>
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
                    {selectedUser ? 'Mettre � jour' : 'Cr�er'}
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
        title="Supprimer l'utilisateur"
        message={`�tes-vous s�r de vouloir supprimer l'utilisateur ${selectedUser?.name} ? Cette action est irr�versible.`}
        variant="danger"
      />
    </div>
  );
};

export default UserSettings;
