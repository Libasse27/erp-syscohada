import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Card, Button, Badge, SearchBar, Alert, Input } from '../../components/common';
import { DataTable } from '../../components/tables';
import { ConfirmModal } from '../../components/modals';
import { setBreadcrumb } from '../../store/slices/uiSlice';
import categoryService from '../../services/categoryService';

/**
 * Category List Page
 * Displays and manages product categories
 */
const CategoryList = () => {
  const dispatch = useDispatch();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    dispatch(setBreadcrumb([
      { label: 'Inventaire', path: '/dashboard/inventory' },
      { label: 'Catégories' }
    ]));
  }, [dispatch]);

  useEffect(() => {
    loadCategories();
  }, [searchQuery]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = { search: searchQuery };
      const response = await categoryService.getAll(params);
      setCategories(response.data);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des catégories');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCreate = () => {
    setFormData({ name: '', description: '' });
    setSelectedCategory(null);
    setEditModalOpen(true);
  };

  const handleEdit = (category) => {
    setFormData({ name: category.name, description: category.description || '' });
    setSelectedCategory(category);
    setEditModalOpen(true);
  };

  const handleDelete = (category) => {
    setSelectedCategory(category);
    setDeleteModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setFormError(null);
      if (selectedCategory) {
        await categoryService.update(selectedCategory._id, formData);
      } else {
        await categoryService.create(formData);
      }
      setEditModalOpen(false);
      loadCategories();
    } catch (err) {
      setFormError(err.message || 'Erreur lors de l\'enregistrement');
    }
  };

  const confirmDelete = async () => {
    try {
      await categoryService.delete(selectedCategory._id);
      setDeleteModalOpen(false);
      setSelectedCategory(null);
      loadCategories();
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression');
    }
  };

  const columns = [
    {
      header: 'Nom',
      accessor: 'name',
      render: (row) => (
        <span className="font-medium text-gray-900 dark:text-white">{row.name}</span>
      ),
    },
    {
      header: 'Description',
      accessor: 'description',
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {row.description || '-'}
        </span>
      ),
    },
    {
      header: 'Produits',
      accessor: 'productCount',
      width: '120px',
      cellClassName: 'text-center',
      render: (row) => (
        <Badge variant="info">{row.productCount || 0}</Badge>
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Catégories de produits
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Organisez vos produits par catégories
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
          Nouvelle catégorie
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Stats Card */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total catégories</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {categories.length}
            </p>
          </div>
          <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
        </div>
      </Card>

      {/* Search */}
      <Card>
        <SearchBar
          placeholder="Rechercher une catégorie..."
          onSearch={handleSearch}
        />
      </Card>

      {/* Categories Table */}
      <Card>
        <DataTable
          columns={columns}
          data={categories}
          loading={loading}
          emptyMessage="Aucune catégorie trouvée"
        />
      </Card>

      {/* Edit/Create Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setEditModalOpen(false)}></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {selectedCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
              </h2>

              {formError && (
                <Alert variant="danger" className="mb-4" onClose={() => setFormError(null)}>
                  {formError}
                </Alert>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <Input
                  label="Nom"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Ex: Électronique, Mobilier..."
                />
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
                    {selectedCategory ? 'Mettre à jour' : 'Créer'}
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
        title="Supprimer la catégorie"
        message={`Êtes-vous sûr de vouloir supprimer la catégorie "${selectedCategory?.name}" ? Cette action est irréversible.`}
        variant="danger"
      />
    </div>
  );
};

export default CategoryList;
