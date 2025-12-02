import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, Button, Badge, Alert, Loader } from '../../components/common';
import { DataTable } from '../../components/tables';
import { fetchCustomerById } from '../../store/slices/customerSlice';
import { setBreadcrumb } from '../../store/slices/uiSlice';
import customerService from '../../services/customerService';
import { formatCurrency, formatDate, formatPhone } from '../../utils/formatters';

/**
 * Customer Detail Page
 * Displays full customer details with invoices and transactions
 */
const CustomerDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentCustomer: customer, loading } = useSelector((state) => state.customers);

  const [error, setError] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalAmount: 0,
    paidAmount: 0,
    pendingAmount: 0,
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchCustomerById(id));
      loadCustomerInvoices();
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (customer) {
      dispatch(setBreadcrumb([
        { label: 'Ventes', path: '/dashboard/sales' },
        { label: 'Clients', path: '/dashboard/sales/customers' },
        { label: customer.name }
      ]));
    }
  }, [dispatch, customer]);

  const loadCustomerInvoices = async () => {
    try {
      const response = await customerService.getInvoices(id);
      setInvoices(response.data);
      calculateStats(response.data);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des factures');
    }
  };

  const calculateStats = (invoicesData) => {
    const totalAmount = invoicesData.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const paidAmount = invoicesData
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.totalAmount, 0);
    const pendingAmount = totalAmount - paidAmount;

    setStats({
      totalInvoices: invoicesData.length,
      totalAmount,
      paidAmount,
      pendingAmount,
    });
  };

  const invoiceColumns = [
    {
      header: 'N° Facture',
      accessor: 'invoiceNumber',
      width: '120px',
      render: (row) => (
        <Link
          to={`/dashboard/sales/invoices/${row._id}`}
          className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          {row.invoiceNumber}
        </Link>
      ),
    },
    {
      header: 'Date',
      accessor: 'invoiceDate',
      width: '120px',
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {formatDate(row.invoiceDate)}
        </span>
      ),
    },
    {
      header: 'Échéance',
      accessor: 'dueDate',
      width: '120px',
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {formatDate(row.dueDate)}
        </span>
      ),
    },
    {
      header: 'Montant',
      accessor: 'totalAmount',
      width: '140px',
      render: (row) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          {formatCurrency(row.totalAmount)}
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
          draft: 'default',
          sent: 'info',
          paid: 'success',
          overdue: 'danger',
          cancelled: 'default',
        };
        const labels = {
          draft: 'Brouillon',
          sent: 'Envoyée',
          paid: 'Payée',
          overdue: 'En retard',
          cancelled: 'Annulée',
        };
        return (
          <Badge variant={variants[row.status] || 'default'}>
            {labels[row.status] || row.status}
          </Badge>
        );
      },
    },
  ];

  const getTypeBadgeVariant = (type) => {
    return type === 'company' ? 'info' : 'default';
  };

  const getStatusBadgeVariant = (status) => {
    return status === 'active' ? 'success' : 'default';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader size="lg" />
      </div>
    );
  }

  if (!customer) {
    return (
      <Alert variant="warning">
        Client introuvable
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {customer.name}
            </h1>
            <Badge variant={getTypeBadgeVariant(customer.type)}>
              {customer.type === 'company' ? 'Entreprise' : 'Particulier'}
            </Badge>
            <Badge variant={getStatusBadgeVariant(customer.status)}>
              {customer.status === 'active' ? 'Actif' : 'Inactif'}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Client depuis {formatDate(customer.createdAt)}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Link to={`/dashboard/sales/invoices/new?customer=${id}`}>
            <Button variant="primary">
              Nouvelle facture
            </Button>
          </Link>
          <Link to={`/dashboard/sales/customers/${id}/edit`}>
            <Button variant="outline">Modifier</Button>
          </Link>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Factures</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalInvoices}</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total facturé</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {formatCurrency(stats.totalAmount)}
          </p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Payé</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(stats.paidAmount)}
          </p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">En attente</p>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {formatCurrency(stats.pendingAmount)}
          </p>
        </Card>
      </div>

      {/* Customer Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Info */}
        <Card title="Informations de contact">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
              <a
                href={`mailto:${customer.email}`}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {customer.email}
              </a>
            </div>
            {customer.phone && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Téléphone</p>
                <a
                  href={`tel:${customer.phone}`}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {formatPhone(customer.phone)}
                </a>
              </div>
            )}
            {customer.website && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Site web</p>
                <a
                  href={customer.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {customer.website}
                </a>
              </div>
            )}
          </div>
        </Card>

        {/* Address Info */}
        <Card title="Adresse">
          <div className="space-y-3">
            {customer.address && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Rue</p>
                <p className="text-gray-900 dark:text-white">{customer.address}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              {customer.city && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Ville</p>
                  <p className="text-gray-900 dark:text-white">{customer.city}</p>
                </div>
              )}
              {customer.postalCode && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Code postal</p>
                  <p className="text-gray-900 dark:text-white">{customer.postalCode}</p>
                </div>
              )}
            </div>
            {customer.country && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pays</p>
                <p className="text-gray-900 dark:text-white">{customer.country}</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Additional Info for Companies */}
      {customer.type === 'company' && (
        <Card title="Informations entreprise">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customer.companyName && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Raison sociale</p>
                <p className="text-gray-900 dark:text-white">{customer.companyName}</p>
              </div>
            )}
            {customer.taxId && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">N° TVA</p>
                <p className="text-gray-900 dark:text-white">{customer.taxId}</p>
              </div>
            )}
            {customer.registrationNumber && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">N° RCCM</p>
                <p className="text-gray-900 dark:text-white">{customer.registrationNumber}</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Invoices List */}
      <Card title="Factures">
        <DataTable
          columns={invoiceColumns}
          data={invoices}
          loading={false}
          emptyMessage="Aucune facture pour ce client"
        />
      </Card>

      {/* Notes */}
      {customer.notes && (
        <Card title="Notes">
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {customer.notes}
          </p>
        </Card>
      )}
    </div>
  );
};

export default CustomerDetail;
