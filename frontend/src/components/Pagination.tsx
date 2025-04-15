import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i);

  return (
    <div style={paginationContainerStyle}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        style={paginationButtonStyle}
      >
        Previous
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          style={{
            ...paginationButtonStyle,
            backgroundColor: currentPage === page ? '#007bff' : '#f8f9fa',
            color: currentPage === page ? '#fff' : '#495057',
            borderColor: '#dee2e6',
          }}
        >
          {page + 1}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        style={paginationButtonStyle}
      >
        Next
      </button>
    </div>
  );
};

const paginationContainerStyle = {
  marginTop: '2rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '0.5rem',
};

const paginationButtonStyle = {
  padding: '0.5rem 0.75rem',
  borderRadius: '4px',
  border: '1px solid #dee2e6',
  backgroundColor: '#f8f9fa',
  color: '#495057',
  cursor: 'pointer',
  fontSize: '1rem',
  transition: 'background-color 0.3s ease',

  '&:hover': {
    backgroundColor: '#e9ecef',
  },

  '&:disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
};

export default Pagination;