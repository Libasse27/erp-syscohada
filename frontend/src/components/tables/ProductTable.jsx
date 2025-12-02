import PropTypes from 'prop-types';
import DataTable from './DataTable';
import { Badge, Button } from '../common';
import { formatCurrency } from '../../utils/formatters';

const ProductTable = ({
  products,
  loading,
  pagination,
  onPageChange,
  onEdit,
  onDelete,
  onView,
}) => {
  const getStockBadgeVariant = (product) => {
    if (product.stock === 0) return 'danger';
    if (product.stock <= product.minStock) return 'warning';
    return 'success';
  };

  const getStatusBadgeVariant = (status) => {
    const variants = {
      active: 'success',
      inactive: 'default',
      discontinued: 'danger',
    };
    return variants[status] || 'default';
  };

  const columns = [
    {
      header: 'Référence',
      accessor: 'reference',
      width: '120px',
      render: (row) => (
        <span className="font-medium text-blue-600 dark:text-blue-400">{row.reference}</span>
      ),
    },
    {
      header: 'Nom',
      accessor: 'name',
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{row.name}</div>
          {row.category && (
            <div className="text-xs text-gray-500 dark:text-gray-400">{row.category}</div>
          )}
        </div>
      ),
    },
    {
      header: 'Prix d\'achat',
      accessor: 'purchasePrice',
      type: 'currency',
      cellClassName: 'text-right',
      render: (row) => formatCurrency(row.purchasePrice),
    },
    {
      header: 'Prix de vente',
      accessor: 'sellingPrice',
      type: 'currency',
      cellClassName: 'text-right',
      render: (row) => (
        <span className="font-semibold text-green-600 dark:text-green-400">
          {formatCurrency(row.sellingPrice)}
        </span>
      ),
    },
    {
      header: 'Stock',
      accessor: 'stock',
      width: '100px',
      cellClassName: 'text-center',
      render: (row) => (
        <Badge variant={getStockBadgeVariant(row)}>
          {row.stock} {row.unit || 'pcs'}
        </Badge>
      ),
    },
    {
      header: 'Stock min',
      accessor: 'minStock',
      width: '100px',
      cellClassName: 'text-center text-gray-500 dark:text-gray-400',
    },
    {
      header: 'Statut',
      accessor: 'status',
      width: '100px',
      cellClassName: 'text-center',
      render: (row) => {
        const labels = {
          active: 'Actif',
          inactive: 'Inactif',
          discontinued: 'Discontinué',
        };
        return (
          <Badge variant={getStatusBadgeVariant(row.status)}>
            {labels[row.status] || row.status}
          </Badge>
        );
      },
    },
    {
      header: 'Actions',
      width: '180px',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex justify-end space-x-2">
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
          {onEdit && (
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
          {onDelete && (
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
      data={products}
      loading={loading}
      pagination={pagination}
      onPageChange={onPageChange}
      emptyMessage="Aucun produit trouvé"
    />
  );
};

ProductTable.propTypes = {
  products: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  pagination: PropTypes.object,
  onPageChange: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onView: PropTypes.func,
};

export default ProductTable;
