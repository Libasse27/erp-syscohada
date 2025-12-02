import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, Button, Badge, Alert, Loader } from '../../components/common';
import { PaymentModal } from '../../components/modals';
import { fetchInvoiceById, updateInvoiceStatus } from '../../store/slices/invoiceSlice';
import { setBreadcrumb } from '../../store/slices/uiSlice';
import invoiceService from '../../services/invoiceService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { INVOICE_STATUS } from '../../utils/constants';

/**
 * Invoice Detail Page
 * Displays full invoice details with actions
 */
const InvoiceDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentInvoice: invoice, loading } = useSelector((state) => state.invoices);

  const [error, setError] = useState(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchInvoiceById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (invoice) {
      dispatch(setBreadcrumb([
        { label: 'Ventes', path: '/dashboard/sales' },
        { label: 'Factures', path: '/dashboard/sales/invoices' },
        { label: invoice.invoiceNumber }
      ]));
    }
  }, [dispatch, invoice]);

  const handleStatusChange = async (newStatus) => {
    try {
      setActionLoading(true);
      setError(null);
      await dispatch(updateInvoiceStatus({ id, status: newStatus })).unwrap();
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
      await invoiceService.sendByEmail(id);
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
      const blob = await invoiceService.downloadPDF(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `facture-${invoice.invoiceNumber}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || 'Erreur lors du téléchargement du PDF');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePaymentSubmit = async (paymentData) => {
    try {
      await invoiceService.addPayment(id, paymentData);
      setPaymentModalOpen(false);
      dispatch(fetchInvoiceById(id));
      // TODO: Show success toast
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'enregistrement du paiement');
    }
  };

  const getStatusBadgeVariant = (status) => {
    const variants = {
      draft: 'default',
      sent: 'info',
      paid: 'success',
      overdue: 'danger',
      cancelled: 'default',
    };
    return variants[status] || 'default';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader size="lg" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <Alert variant="warning">
        Facture introuvable
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
              {invoice.invoiceNumber}
            </h1>
            <Badge variant={getStatusBadgeVariant(invoice.status)} size="lg">
              {INVOICE_STATUS[invoice.status]?.label || invoice.status}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Créée le {formatDate(invoice.createdAt)}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          {invoice.status === 'draft' && (
            <Button
              variant="primary"
              onClick={() => handleStatusChange('sent')}
              disabled={actionLoading}
            >
              Marquer comme envoyée
            </Button>
          )}
          {(invoice.status === 'sent' || invoice.status === 'overdue') && (
            <Button
              variant="success"
              onClick={() => setPaymentModalOpen(true)}
              disabled={actionLoading}
            >
              Enregistrer un paiement
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
          {invoice.status === 'draft' && (
            <Link to={`/dashboard/sales/invoices/${id}/edit`}>
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

      {/* Invoice Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Info */}
        <Card title="Client">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Nom</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {invoice.customer?.name}
              </p>
            </div>
            {invoice.customer?.email && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                <p className="text-gray-900 dark:text-white">{invoice.customer.email}</p>
              </div>
            )}
            {invoice.customer?.phone && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Téléphone</p>
                <p className="text-gray-900 dark:text-white">{invoice.customer.phone}</p>
              </div>
            )}
            {invoice.customer?.address && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Adresse</p>
                <p className="text-gray-900 dark:text-white">{invoice.customer.address}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Dates */}
        <Card title="Dates">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Date de facturation</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {formatDate(invoice.invoiceDate)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Date d\'échéance</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {formatDate(invoice.dueDate)}
              </p>
            </div>
            {invoice.paidDate && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Date de paiement</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatDate(invoice.paidDate)}
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
                {formatCurrency(invoice.subtotal)}
              </span>
            </div>
            {invoice.discount > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Remise</span>
                <span className="font-medium text-red-600 dark:text-red-400">
                  -{formatCurrency(invoice.discount)}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Taxe</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatCurrency(invoice.taxAmount)}
              </span>
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
              <span className="font-semibold text-gray-900 dark:text-white">Total</span>
              <span className="font-bold text-xl text-blue-600 dark:text-blue-400">
                {formatCurrency(invoice.totalAmount)}
              </span>
            </div>
            {invoice.amountPaid > 0 && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Montant payé</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {formatCurrency(invoice.amountPaid)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900 dark:text-white">Reste à payer</span>
                  <span className="font-bold text-lg text-orange-600 dark:text-orange-400">
                    {formatCurrency(invoice.totalAmount - invoice.amountPaid)}
                  </span>
                </div>
              </>
            )}
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
              {invoice.items?.map((item, index) => (
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
      {invoice.notes && (
        <Card title="Notes">
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {invoice.notes}
          </p>
        </Card>
      )}

      {/* Payment History */}
      {invoice.payments && invoice.payments.length > 0 && (
        <Card title="Historique des paiements">
          <div className="space-y-3">
            {invoice.payments.map((payment, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(payment.amount)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(payment.date)} - {payment.method}
                  </p>
                  {payment.reference && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Réf: {payment.reference}
                    </p>
                  )}
                </div>
                <Badge variant="success">Payé</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onSubmit={handlePaymentSubmit}
        invoiceAmount={invoice.totalAmount}
        amountPaid={invoice.amountPaid || 0}
      />
    </div>
  );
};

export default InvoiceDetail;
