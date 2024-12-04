import React from 'react';
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, setCurrentPage, category }) => {
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="pagination">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-btn"
      >
        Previous
      </button>

      {/* Render các trang */}
      {[...Array(totalPages)].map((_, idx) => (
        <button
          key={idx}
          onClick={() => handlePageChange(idx + 1)}
          className={currentPage === idx + 1 ? 'active' : ''}
        >
          {idx + 1}
        </button>
      ))}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination-btn"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
