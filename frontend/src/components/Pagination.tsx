import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {

    const pages = Array.from({ length: totalPages }, (_, i) => i);

    return (
        <div style={{ marginTop: '1rem' }}>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 0}
            >
                Previous
            </button>

            {pages.map((page) => (
                    <button
                    key={page}
                    onClick={() => onPageChange(page)}
                >
                {page + 1}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
