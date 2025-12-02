import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, Button, Badge, Alert, Loader } from '../../components/common';
import { DataTable } from '../../components/tables';
import { setBreadcrumb } from '../../store/slices/uiSlice';
import supplierService from '../../services/supplierService';
import { formatCurrency, formatDate, formatPhone } from '../../utils/formatters';

/**
 * Supplier Detail Page
 * Displays full supplier details with purchase orders
 */
const SupplierDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalAmount: 0,
    receivedOrders: 0,
    pendingOrders: 0,
  });

  useEffect(() => {
    if (id) {
      loadSupplier();
      loadSupplierOrders();
    }
  }, [id]);

  useEffect(() => {
    if (supplier) {
      dispatch(setBreadcrumb([
        { label: 'Achats', path: '/dashboard/purchases' },
        { label: 'Fournisseurs', path: '/dashboard/purchases/suppliers' },
        { label: supplier.name }
      ]));
    }
  }, [dispatch, supplier]);

  const loadSupplier = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await supplierService.getById(id);
      setSupplier(response.data);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement du fournisseur');
    } finally {
      setLoading(false);
    }
  };

  const loadSupplierOrders = async () => {
    try {
      const response = await supplierService.getPurchaseOrders(id);
      setOrders(response.data);
      calculateStats(response.data);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des commandes');
    }
  };

  const calculateStats = (ordersData) => {
    const totalAmount = ordersData.reduce((sum, order) => sum + order.totalAmount, 0);
    const receivedOrders = ordersData.filter(order => order.status === 'received').length;
    const pendingOrders = ordersData.filter(
      order => ['sent', 'confirmed'].includes(order.status)
    ).length;

    setStats({
      totalOrders: ordersData.length,
      totalAmount,
      receivedOrders,
      pendingOrders,
    });
  };

  const orderColumns = [
    {
      header: 'N° Commande',
      accessor: 'orderNumber',
      width: '140px',
      render: (row) => (
        <Link
          to={`/dashboard/purchases/orders/${row._id}`}
          className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          {row.orderNumber}
        </Link>
      ),
    },
    {
      header: 'Date',
      accessor: 'orderDate',
      width: '120px',
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {formatDate(row.orderDate)}
        </span>
      ),
    },
    {
      header: 'Livraison',
      accessor: 'expectedDate',
      width: '120px',
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {row.expectedDate ? formatDate(row.expectedDate) : '-'}
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
          confirmed: 'warning',
          received: 'success',
          cancelled: 'danger',
        };
        const labels = {
          draft: 'Brouillon',
          sent: 'Envoyée',
          confirmed: 'Confirmée',
          received: 'Reçue',
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader size="lg" />
      </div>
    );
  }

  if (!supplier) {
    return (
      <Alert variant="warning">
        Fournisseur introuvable
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
              {supplier.name}
            </h1>
            <Badge variant={supplier.status === 'active' ? 'success' : 'default'}>
              {supplier.status === 'active' ? 'Actif' : 'Inactif'}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Fournisseur depuis {formatDate(supplier.createdAt)}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Link to={`/dashboard/purchases/orders/new?supplier=${id}`}>
            <Button variant="primary">
              Nouvelle commande
            </Button>
          </Link>
          <Link to={`/dashboard/purchases/suppliers/${id}/edit`}>
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
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Commandes</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalOrders}</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total acheté</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {formatCurrency(stats.totalAmount)}
          </p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Reçues</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.receivedOrders}
          </p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">En attente</p>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {stats.pendingOrders}
          </p>
        </Card>
      </div>

      {/* Supplier Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Info */}
        <Card title="Informations de contact">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
              <a
                href={`mailto:${supplier.email}`}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {supplier.email}
              </a>
            </div>
            {supplier.phone && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Téléphone</p>
                <a
                  href={`tel:${supplier.phone}`}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {formatPhone(supplier.phone)}
                </a>
              </div>
            )}
            {supplier.website && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Site web</p>
                <a
                  href={supplier.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {supplier.website}
                </a>
              </div>
            )}
            {supplier.contactPerson && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Personne de contact</p>
                <p className="text-gray-900 dark:text-white">{supplier.contactPerson}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Address Info */}
        <Card title="Adresse">
          <div className="space-y-3">
            {supplier.address && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Rue</p>
                <p className="text-gray-900 dark:text-white">{supplier.address}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              {supplier.city && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Ville</p>
                  <p className="text-gray-900 dark:text-white">{supplier.city}</p>
                </div>
              )}
              {supplier.postalCode && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Code postal</p>
                  <p className="text-gray-900 dark:text-white">{supplier.postalCode}</p>
                </div>
              )}
            </div>
            {supplier.country && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pays</p>
                <p className="text-gray-900 dark:text-white">{supplier.country}</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Business Info */}
      <Card title="Informations commerciales">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {supplier.taxId && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">N° TVA</p>
              <p className="text-gray-900 dark:text-white">{supplier.taxId}</p>
            </div>
          )}
          {supplier.registrationNumber && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">N° RCCM</p>
              <p className="text-gray-900 dark:text-white">{supplier.registrationNumber}</p>
            </div>
          )}
          {supplier.paymentTerms && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Conditions de paiement</p>
              <p className="text-gray-900 dark:text-white">{supplier.paymentTerms} jours</p>
            </div>
          )}
        </div>
      </Card>

      {/* Purchase Orders List */}
      <Card title="Commandes d'achat">
        <DataTable
          columns={orderColumns}
          data={orders}
          loading={false}
          emptyMessage="Aucune commande pour ce fournisseur"
        />
      </Card>

      {/* Notes */}
      {supplier.notes && (
        <Card title="Notes">
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {supplier.notes}
          </p>
        </Card>
      )}
    </div>
  );
};

export default SupplierDetail;
