import PropTypes from 'prop-types';
import { Pagination, Loader, Badge } from '../common';

const DataTable = ({
  columns,
  data,
  loading = false,
  pagination,
  onPageChange,
  onRowClick,
  emptyMessage = 'Aucune donnée disponible',
  className = '',
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader size="lg" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  const renderCellContent = (row, column) => {
    const value = column.accessor ? row[column.accessor] : null;

    // Custom render function
    if (column.render) {
      return column.render(row, value);
    }

    // Badge type
    if (column.type === 'badge') {
      return <Badge variant={column.getBadgeVariant?.(value) || 'default'}>{value}</Badge>;
    }

    // Currency type
    if (column.type === 'currency') {
      return <span className="font-medium">{value?.toLocaleString('fr-FR')} FCFA</span>;
    }

    // Date type
    if (column.type === 'date') {
      return value ? new Date(value).toLocaleDateString('fr-FR') : '-';
    }

    // Default
    return value ?? '-';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          {/* Header */}
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${
                    column.className || ''
                  }`}
                  style={{ width: column.width }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((row, rowIndex) => (
              <tr
                key={row._id || row.id || rowIndex}
                onClick={() => onRowClick?.(row)}
                className={`${
                  onRowClick
                    ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
                    : ''
                }`}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 ${
                      column.cellClassName || ''
                    }`}
                  >
                    {renderCellContent(row, column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex justify-center">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            itemsPerPage={pagination.pageSize}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      accessor: PropTypes.string,
      render: PropTypes.func,
      type: PropTypes.oneOf(['text', 'badge', 'currency', 'date']),
      getBadgeVariant: PropTypes.func,
      width: PropTypes.string,
      className: PropTypes.string,
      cellClassName: PropTypes.string,
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  pagination: PropTypes.shape({
    currentPage: PropTypes.number,
    totalPages: PropTypes.number,
    totalItems: PropTypes.number,
    pageSize: PropTypes.number,
  }),
  onPageChange: PropTypes.func,
  onRowClick: PropTypes.func,
  emptyMessage: PropTypes.string,
  className: PropTypes.string,
};

export default DataTable;
