import PropTypes from 'prop-types';
import DataTable from './DataTable';
import { Badge, Button } from '../common';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { INVOICE_STATUS_LABELS, INVOICE_STATUS_COLORS } from '../../utils/constants';

const InvoiceTable = ({
  invoices,
  loading,
  pagination,
  onPageChange,
  onEdit,
  onDelete,
  onView,
  onValidate,
  onDownloadPDF,
}) => {
  const getStatusBadgeVariant = (status) => {
    return INVOICE_STATUS_COLORS[status] || 'default';
  };

  const columns = [
    {
      header: 'N° Facture',
      accessor: 'number',
      width: '120px',
      render: (row) => (
        <span className="font-medium text-blue-600 dark:text-blue-400">{row.number}</span>
      ),
    },
    {
      header: 'Date',
      accessor: 'date',
      width: '110px',
      render: (row) => <span className="text-sm">{formatDate(row.date)}</span>,
    },
    {
      header: 'Client / Fournisseur',
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {row.customer?.name || row.supplier?.name || 'N/A'}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {row.type === 'sale' ? 'Client' : 'Fournisseur'}
          </div>
        </div>
      ),
    },
    {
      header: 'Montant HT',
      accessor: 'subtotal',
      width: '130px',
      cellClassName: 'text-right',
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {formatCurrency(row.subtotal)}
        </span>
      ),
    },
    {
      header: 'TVA',
      accessor: 'tax',
      width: '100px',
      cellClassName: 'text-right',
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {formatCurrency(row.tax)}
        </span>
      ),
    },
    {
      header: 'Total TTC',
      accessor: 'total',
      width: '130px',
      cellClassName: 'text-right',
      render: (row) => (
        <span className="font-semibold text-green-600 dark:text-green-400">
          {formatCurrency(row.total)}
        </span>
      ),
    },
    {
      header: 'Échéance',
      accessor: 'dueDate',
      width: '110px',
      render: (row) => {
        const isOverdue = new Date(row.dueDate) < new Date() && row.status !== 'paid';
        return (
          <span className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
            {formatDate(row.dueDate)}
          </span>
        );
      },
    },
    {
      header: 'Statut',
      accessor: 'status',
      width: '110px',
      cellClassName: 'text-center',
      render: (row) => (
        <Badge variant={getStatusBadgeVariant(row.status)}>
          {INVOICE_STATUS_LABELS[row.status] || row.status}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      width: '220px',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex justify-end space-x-1">
          {onView && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onView(row);
              }}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              }
            />
          )}
          {onEdit && row.status === 'draft' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(row);
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
          )}
          {onValidate && row.status === 'draft' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onValidate(row);
              }}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
            />
          )}
          {onDownloadPDF && row.status !== 'draft' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDownloadPDF(row);
              }}
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
            />
          )}
          {onDelete && row.status === 'draft' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(row);
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
          )}
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={invoices}
      loading={loading}
      pagination={pagination}
      onPageChange={onPageChange}
      emptyMessage="Aucune facture trouvée"
    />
  );
};

InvoiceTable.propTypes = {
  invoices: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  pagination: PropTypes.object,
  onPageChange: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onView: PropTypes.func,
  onValidate: PropTypes.func,
  onDownloadPDF: PropTypes.func,
};

export default InvoiceTable;
