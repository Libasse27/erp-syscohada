import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, Button, Badge, Alert, Loader } from '../../components/common';
import { setBreadcrumb } from '../../store/slices/uiSlice';
import purchaseOrderService from '../../services/purchaseOrderService';
import { formatCurrency, formatDate } from '../../utils/formatters';

/**
 * Purchase Order Detail Page
 * Displays full purchase order details with actions
 */
const PurchaseOrderDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadOrder();
    }
  }, [id]);

  useEffect(() => {
    if (order) {
      dispatch(setBreadcrumb([
        { label: 'Achats', path: '/dashboard/purchases' },
        { label: 'Commandes d\'achat', path: '/dashboard/purchases/orders' },
        { label: order.orderNumber }
      ]));
    }
  }, [dispatch, order]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await purchaseOrderService.getById(id);
      setOrder(response.data);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement de la commande');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setActionLoading(true);
      setError(null);
      await purchaseOrderService.updateStatus(id, newStatus);
      loadOrder();
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour du statut');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendEmail = async () => {
    try {
      setActionLoading(true);
      setError(null);
      await purchaseOrderService.sendByEmail(id);
      // TODO: Show success toast
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'envoi de l\'email');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setActionLoading(true);
      setError(null);
      const blob = await purchaseOrderService.downloadPDF(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `commande-${order.orderNumber}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || 'Erreur lors du téléchargement du PDF');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadgeVariant = (status) => {
    const variants = {
      draft: 'default',
      sent: 'info',
      confirmed: 'warning',
      received: 'success',
      cancelled: 'danger',
    };
    return variants[status] || 'default';
  };

  const getStatusLabel = (status) => {
    const labels = {
      draft: 'Brouillon',
      sent: 'Envoyée',
      confirmed: 'Confirmée',
      received: 'Reçue',
      cancelled: 'Annulée',
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <Alert variant="warning">
        Commande d'achat introuvable
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
              {order.orderNumber}
            </h1>
            <Badge variant={getStatusBadgeVariant(order.status)} size="lg">
              {getStatusLabel(order.status)}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Créée le {formatDate(order.createdAt)}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          {order.status === 'draft' && (
            <Button
              variant="primary"
              onClick={() => handleStatusChange('sent')}
              disabled={actionLoading}
            >
              Envoyer au fournisseur
            </Button>
          )}
          {order.status === 'sent' && (
            <Button
              variant="warning"
              onClick={() => handleStatusChange('confirmed')}
              disabled={actionLoading}
            >
              Marquer comme confirmée
            </Button>
          )}
          {order.status === 'confirmed' && (
            <Button
              variant="success"
              onClick={() => handleStatusChange('received')}
              disabled={actionLoading}
            >
              Marquer comme reçue
            </Button>
          )}
          <Button
            variant="outline"
            onClick={handleSendEmail}
            disabled={actionLoading}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            }
          >
            Envoyer par email
          </Button>
          <Button
            variant="outline"
            onClick={handleDownloadPDF}
            disabled={actionLoading}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            }
          >
            Télécharger PDF
          </Button>
          {order.status === 'draft' && (
            <Link to={`/dashboard/purchases/orders/${id}/edit`}>
              <Button variant="outline">Modifier</Button>
            </Link>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Order Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Supplier Info */}
        <Card title="Fournisseur">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Nom</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {order.supplier?.name}
              </p>
            </div>
            {order.supplier?.email && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                <p className="text-gray-900 dark:text-white">{order.supplier.email}</p>
              </div>
            )}
            {order.supplier?.phone && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Téléphone</p>
                <p className="text-gray-900 dark:text-white">{order.supplier.phone}</p>
              </div>
            )}
            {order.supplier?.address && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Adresse</p>
                <p className="text-gray-900 dark:text-white">{order.supplier.address}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Dates */}
        <Card title="Dates">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Date de commande</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {formatDate(order.orderDate)}
              </p>
            </div>
            {order.expectedDate && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Livraison prévue</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatDate(order.expectedDate)}
                </p>
              </div>
            )}
            {order.receivedDate && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Date de réception</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatDate(order.receivedDate)}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Amounts */}
        <Card title="Montants">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Sous-total</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatCurrency(order.subtotal)}
              </span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Remise</span>
                <span className="font-medium text-red-600 dark:text-red-400">
                  -{formatCurrency(order.discount)}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Taxe</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatCurrency(order.taxAmount)}
              </span>
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
              <span className="font-semibold text-gray-900 dark:text-white">Total</span>
              <span className="font-bold text-xl text-blue-600 dark:text-blue-400">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Items Table */}
      <Card title="Articles">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                  Article
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                  Quantité
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                  Prix unitaire
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                  Taxe
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {order.items?.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {item.product?.name || item.description}
                      </p>
                      {item.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-900 dark:text-white">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-900 dark:text-white">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-900 dark:text-white">
                    {item.taxRate}%
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-white">
                    {formatCurrency(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Notes */}
      {order.notes && (
        <Card title="Notes">
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {order.notes}
          </p>
        </Card>
      )}
    </div>
  );
};

export default PurchaseOrderDetail;
