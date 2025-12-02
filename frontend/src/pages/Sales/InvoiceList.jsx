import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Button, Badge, SearchBar, Alert } from '../../components/common';
import { InvoiceTable } from '../../components/tables';
import { ConfirmModal } from '../../components/modals';
import { fetchInvoices, deleteInvoice } from '../../store/slices/invoiceSlice';
import { setBreadcrumb } from '../../store/slices/uiSlice';
import invoiceService from '../../services/invoiceService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { INVOICE_STATUS } from '../../utils/constants';

/**
 * Invoice List Page
 * Displays list of all invoices with search, filter, and actions
 */
const InvoiceList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { invoices, loading, error, pagination } = useSelector((state) => state.invoices);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    dispatch(setBreadcrumb([
      { label: 'Ventes', path: '/dashboard/sales' },
      { label: 'Factures' }
    ]));
  }, [dispatch]);

  useEffect(() => {
    loadInvoices();
  }, [searchQuery, statusFilter]);

  const loadInvoices = (page = 1) => {
    const params = {
      page,
      limit: 10,
      search: searchQuery,
      ...(statusFilter !== 'all' && { status: statusFilter }),
    };
    dispatch(fetchInvoices(params));
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

  const handleView = (invoice) => {
    navigate(`/dashboard/sales/invoices/${invoice._id}`);
  };

  const handleEdit = (invoice) => {
    navigate(`/dashboard/sales/invoices/${invoice._id}/edit`);
  };

  const handleDelete = (invoice) => {
    setSelectedInvoice(invoice);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteInvoice(selectedInvoice._id)).unwrap();
      setDeleteModalOpen(false);
      setSelectedInvoice(null);
      loadInvoices(pagination?.currentPage || 1);
    } catch (err) {
      setLocalError(err.message || 'Erreur lors de la suppression');
    }
  };

  const handleSendEmail = async (invoice) => {
    try {
      await invoiceService.sendByEmail(invoice._id);
      // TODO: Show success toast
    } catch (err) {
      setLocalError(err.message || 'Erreur lors de l\'envoi de l\'email');
    }
  };

  const handleDownloadPDF = async (invoice) => {
    try {
      const blob = await invoiceService.downloadPDF(invoice._id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `facture-${invoice.invoiceNumber}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setLocalError(err.message || 'Erreur lors du téléchargement du PDF');
    }
  };

  const handlePageChange = (page) => {
    loadInvoices(page);
  };

  // Calculate stats
  const stats = {
    total: invoices?.length || 0,
    draft: invoices?.filter(inv => inv.status === 'draft').length || 0,
    sent: invoices?.filter(inv => inv.status === 'sent').length || 0,
    paid: invoices?.filter(inv => inv.status === 'paid').length || 0,
    overdue: invoices?.filter(inv => inv.status === 'overdue').length || 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Factures
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Gérez vos factures de vente
          </p>
        </div>
        <Link to="/dashboard/sales/invoices/new">
          <Button
            variant="primary"
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
            Nouvelle facture
          </Button>
        </Link>
      </div>

      {/* Error Alert */}
      {(error || localError) && (
        <Alert variant="danger" onClose={() => setLocalError(null)}>
          {error || localError}
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Brouillon</p>
          <p className="text-2xl font-bold text-gray-600 dark:text-gray-300">{stats.draft}</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Envoyées</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.sent}</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Payées</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.paid}</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">En retard</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.overdue}</p>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Rechercher par numéro, client..."
              onSearch={handleSearch}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            <Button
              variant={statusFilter === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleStatusFilter('all')}
            >
              Tous
            </Button>
            {Object.entries(INVOICE_STATUS).map(([key, { label }]) => (
              <Button
                key={key}
                variant={statusFilter === key ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleStatusFilter(key)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Invoices Table */}
      <Card>
        <InvoiceTable
          invoices={invoices}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSendEmail={handleSendEmail}
          onDownloadPDF={handleDownloadPDF}
        />
      </Card>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Supprimer la facture"
        message={`Êtes-vous sûr de vouloir supprimer la facture ${selectedInvoice?.invoiceNumber} ? Cette action est irréversible.`}
        variant="danger"
      />
    </div>
  );
};

export default InvoiceList;
