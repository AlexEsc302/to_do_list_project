import React from 'react';
import './pagination.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i);

  // If there are more than 7 pages, show a condensed version
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return pages;
    }

    const pageNumbers = [];
    // Always show first page
    pageNumbers.push(0);

    // Show dots if current page is more than 3
    if (currentPage > 3) {
      pageNumbers.push(-1); // -1 represents dots
    }

    // Show pages around current page
    for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages - 2, currentPage + 1); i++) {
      pageNumbers.push(i);
    }

    // Show dots if current page is less than totalPages - 4
    if (currentPage < totalPages - 4) {
      pageNumbers.push(-2); // -2 represents dots
    }

    // Always show last page
    if (totalPages > 1) {
      pageNumbers.push(totalPages - 1);
    }

    return pageNumbers;
  };

  return (
    <nav aria-label="Todo pagination" className="mt-4">
      <ul className="pagination justify-content-center d-flex list-unstyled">
        <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
          <button 
            className="page-link" 
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
          >
            &laquo; Prev
          </button>
        </li>

        {getPageNumbers().map((page, index) => {
          if (page < 0) {
            return (
              <li className="page-item disabled" key={`ellipsis-${index}`}>
                <span className="page-link">...</span>
              </li>
            );
          }
          
          return (
            <li 
              className={`page-item ${currentPage === page ? 'active' : ''}`} 
              key={page}
            >
              <button 
                className="page-link" 
                onClick={() => onPageChange(page)}
              >
                {page + 1}
              </button>
            </li>
          );
        })}

        <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
          <button 
            className="page-link" 
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1 || totalPages === 0}
          >
            Next &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;