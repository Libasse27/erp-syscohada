import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Card, Button, Alert, Input, Badge } from '../../components/common';
import { DataTable } from '../../components/tables';
import { ConfirmModal } from '../../components/modals';
import { setBreadcrumb } from '../../store/slices/uiSlice';
import fiscalYearService from '../../services/fiscalYearService';
import { formatDate } from '../../utils/formatters';

/**
 * Fiscal Year Settings Page
 * Manage accounting fiscal years (exercices comptables)
 */
const FiscalYearSettings = () => {
  const dispatch = useDispatch();

  const [fiscalYears, setFiscalYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [closeModalOpen, setCloseModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    isActive: false,
  });
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    dispatch(setBreadcrumb([
      { label: 'Paramètres', path: '/dashboard/settings' },
      { label: 'Exercices comptables' }
    ]));
  }, [dispatch]);

  useEffect(() => {
    loadFiscalYears();
  }, []);

  const loadFiscalYears = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fiscalYearService.getAll();
      setFiscalYears(response.data);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des exercices');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    const today = new Date();
    const nextYear = new Date(today.getFullYear() + 1, 0, 1);

    setFormData({
      name: `Exercice ${today.getFullYear()}`,
      startDate: today.toISOString().split('T')[0],
      endDate: new Date(today.getFullYear(), 11, 31).toISOString().split('T')[0],
      isActive: false,
    });
    setSelectedYear(null);
    setEditModalOpen(true);
  };

  const handleEdit = (year) => {
    setFormData({
      name: year.name,
      startDate: year.startDate.split('T')[0],
      endDate: year.endDate.split('T')[0],
      isActive: year.isActive,
    });
    setSelectedYear(year);
    setEditModalOpen(true);
  };

  const handleDelete = (year) => {
    setSelectedYear(year);
    setDeleteModalOpen(true);
  };

  const handleClose = (year) => {
    setSelectedYear(year);
    setCloseModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setFormError(null);
      if (selectedYear) {
        await fiscalYearService.update(selectedYear._id, formData);
      } else {
        await fiscalYearService.create(formData);
      }
      setEditModalOpen(false);
      loadFiscalYears();
    } catch (err) {
      setFormError(err.message || 'Erreur lors de l\'enregistrement');
    }
  };

  const confirmDelete = async () => {
    try {
      await fiscalYearService.delete(selectedYear._id);
      setDeleteModalOpen(false);
      setSelectedYear(null);
      loadFiscalYears();
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression');
    }
  };

  const confirmClose = async () => {
    try {
      await fiscalYearService.close(selectedYear._id);
      setCloseModalOpen(false);
      setSelectedYear(null);
      loadFiscalYears();
    } catch (err) {
      setError(err.message || 'Erreur lors de la clôture');
    }
  };

  const setAsActive = async (year) => {
    try {
      await fiscalYearService.setActive(year._id);
      loadFiscalYears();
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'activation');
    }
  };

  const columns = [
    {
      header: 'Exercice',
      accessor: 'name',
      render: (row) => (
        <span className="font-medium text-gray-900 dark:text-white">{row.name}</span>
      ),
    },
    {
      header: 'Date de début',
      accessor: 'startDate',
      width: '140px',
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {formatDate(row.startDate)}
        </span>
      ),
    },
    {
      header: 'Date de fin',
      accessor: 'endDate',
      width: '140px',
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {formatDate(row.endDate)}
        </span>
      ),
    },
    {
      header: 'Statut',
      accessor: 'status',
      width: '120px',
      cellClassName: 'text-center',
      render: (row) => {
        const variants = {
          open: 'success',
          closed: 'danger',
        };
        const labels = {
          open: 'Ouvert',
          closed: 'Clôturé',
        };
        return (
          <Badge variant={variants[row.status] || 'default'}>
            {labels[row.status] || row.status}
          </Badge>
        );
      },
    },
    {
      header: 'Actif',
      accessor: 'isActive',
      width: '100px',
      cellClassName: 'text-center',
      render: (row) => (
        row.isActive ? (
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30">
            <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </span>
        ) : (
          <span className="text-gray-400">-</span>
        )
      ),
    },
    {
      header: 'Actions',
      width: '180px',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex justify-end space-x-2">
          {row.status === 'open' && !row.isActive && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setAsActive(row);
              }}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              }
            />
          )}
          {row.status === 'open' && (
            <>
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
                  handleClose(row);
                }}
                disabled={row.isActive}
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                }
              />
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row);
            }}
            disabled={row.isActive || row.status === 'closed'}
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
    total: fiscalYears?.length || 0,
    open: fiscalYears?.filter(y => y.status === 'open').length || 0,
    closed: fiscalYears?.filter(y => y.status === 'closed').length || 0,
    active: fiscalYears?.find(y => y.isActive),
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Exercices comptables
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Gestion des périodes fiscales selon SYSCOHADA
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
          Nouvel exercice
        </Button>
      </div>

      {error && <Alert variant="danger" onClose={() => setError(null)}>{error}</Alert>}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
        </Card>
        <Card className="text-center bg-green-50 dark:bg-green-900/30">
          <p className="text-sm text-gray-600 dark:text-gray-400">Ouverts</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.open}</p>
        </Card>
        <Card className="text-center bg-red-50 dark:bg-red-900/30">
          <p className="text-sm text-gray-600 dark:text-gray-400">Clôturés</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.closed}</p>
        </Card>
        <Card className="text-center bg-blue-50 dark:bg-blue-900/30">
          <p className="text-sm text-gray-600 dark:text-gray-400">Exercice actif</p>
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {stats.active ? stats.active.name : 'Aucun'}
          </p>
        </Card>
      </div>

      <Card>
        <DataTable
          columns={columns}
          data={fiscalYears}
          loading={loading}
          emptyMessage="Aucun exercice comptable"
        />
      </Card>

      <Card>
        <div className="border-l-4 border-blue-500 pl-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            À propos des exercices comptables
          </h3>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <p>
              Un exercice comptable correspond à une période de 12 mois durant laquelle l&apos;entreprise
              enregistre toutes ses opérations comptables selon les normes SYSCOHADA.
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                <strong>Exercice actif :</strong> L&apos;exercice en cours où les opérations sont enregistrées
              </li>
              <li>
                <strong>Clôture :</strong> Une fois clôturé, un exercice ne peut plus être modifié
              </li>
              <li>
                <strong>Normes SYSCOHADA :</strong> Les exercices doivent respecter la réglementation comptable
              </li>
            </ul>
            <p className="mt-3 text-xs text-orange-600 dark:text-orange-400">
                La clôture d&apos;un exercice est une opération importante et irréversible.
            </p>
          </div>
        </div>
      </Card>

      {editModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setEditModalOpen(false)}></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {selectedYear ? 'Modifier l\'exercice' : 'Nouvel exercice comptable'}
              </h2>

              {formError && (
                <Alert variant="danger" className="mb-4" onClose={() => setFormError(null)}>
                  {formError}
                </Alert>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <Input
                  label="Nom de l'exercice"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Ex: Exercice 2024"
                />

                <Input
                  label="Date de début"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />

                <Input
                  label="Date de fin"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />

                {!selectedYear && (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="mr-2"
                    />
                    <label htmlFor="isActive" className="text-sm text-gray-700 dark:text-gray-300">
                      Définir comme exercice actif
                    </label>
                  </div>
                )}

                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setEditModalOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button type="submit" variant="primary">
                    {selectedYear ? 'Mettre à jour' : 'Créer'}
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
        title="Supprimer l'exercice"
        message={`Êtes-vous sûr de vouloir supprimer l'exercice ${selectedYear?.name} ? Cette action est irréversible.`}
        variant="danger"
      />

      <ConfirmModal
        isOpen={closeModalOpen}
        onClose={() => setCloseModalOpen(false)}
        onConfirm={confirmClose}
        title="Clôturer l'exercice"
        message={`Êtes-vous sûr de vouloir clôturer l'exercice ${selectedYear?.name} ? Une fois clôturé, aucune modification ne sera possible.`}
        variant="warning"
      />
    </div>
  );
};

export default FiscalYearSettings;
