const Pagination = ({ currentPage, totalPages, handlePageChange }) => (
  <div className="pagination-container mt-6 flex justify-center gap-2">
    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
      <button
        key={pageNumber}
        onClick={() => handlePageChange(pageNumber)}
        className={`pagination-button ${
          currentPage === pageNumber
            ? 'pagination-button-active'
            : 'pagination-button-inactive'
        }`}
      >
        {pageNumber}
      </button>
    ))}
  </div>
);

export default Pagination;
