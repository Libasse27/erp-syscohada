import { useState, useMemo } from 'react';
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NUMBER } from '../utils/constants';

/**
 * Custom hook to manage pagination state and calculations
 * @param {Object} options - Pagination options
 * @param {number} options.initialPage - Initial page number (default: 1)
 * @param {number} options.initialPageSize - Initial page size (default: 10)
 * @param {number} options.totalItems - Total number of items
 * @returns {Object} - Pagination state and handlers
 */
const usePagination = ({
  initialPage = DEFAULT_PAGE_NUMBER,
  initialPageSize = DEFAULT_PAGE_SIZE,
  totalItems = 0,
} = {}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / pageSize) || 1;
  }, [totalItems, pageSize]);

  // Calculate current page items range
  const { startItem, endItem } = useMemo(() => {
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalItems);
    return { startItem: start, endItem: end };
  }, [currentPage, pageSize, totalItems]);

  // Go to specific page
  const goToPage = (page) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };

  // Go to next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Go to previous page
  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Go to first page
  const firstPage = () => {
    setCurrentPage(1);
  };

  // Go to last page
  const lastPage = () => {
    setCurrentPage(totalPages);
  };

  // Change page size and reset to first page
  const changePageSize = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  // Reset pagination
  const reset = () => {
    setCurrentPage(initialPage);
    setPageSize(initialPageSize);
  };

  // Check if on first page
  const isFirstPage = currentPage === 1;

  // Check if on last page
  const isLastPage = currentPage === totalPages;

  // Get pagination parameters for API calls
  const getPaginationParams = () => ({
    page: currentPage,
    limit: pageSize,
    skip: (currentPage - 1) * pageSize,
  });

  return {
    // State
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    startItem,
    endItem,
    isFirstPage,
    isLastPage,

    // Actions
    goToPage,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    changePageSize,
    reset,
    getPaginationParams,

    // Setters (for manual control)
    setCurrentPage,
    setPageSize,
  };
};

export default usePagination;
