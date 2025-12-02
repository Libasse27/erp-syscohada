import PropTypes from 'prop-types';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
  className = '',
}) => {
  const pages = [];
  const maxPagesToShow = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage < maxPagesToShow - 1) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="text-sm text-gray-700">
        Affichage de <span className="font-medium">{startItem}</span> à{' '}
        <span className="font-medium">{endItem}</span> sur{' '}
        <span className="font-medium">{totalItems}</span> résultats
      </div>

      <nav className="flex items-center space-x-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`
            px-3 py-2 rounded-lg border text-sm font-medium
            ${
              currentPage === 1
                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }
          `}
        >
          Précédent
        </button>

        {/* First Page */}
        {startPage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              1
            </button>
            {startPage > 2 && <span className="text-gray-500">...</span>}
          </>
        )}

        {/* Page Numbers */}
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`
              px-3 py-2 rounded-lg border text-sm font-medium
              ${
                page === currentPage
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            {page}
          </button>
        ))}

        {/* Last Page */}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="text-gray-500">...</span>}
            <button
              onClick={() => onPageChange(totalPages)}
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`
            px-3 py-2 rounded-lg border text-sm font-medium
            ${
              currentPage === totalPages
                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }
          `}
        >
          Suivant
        </button>
      </nav>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
  className: PropTypes.string,
};

export default Pagination;
