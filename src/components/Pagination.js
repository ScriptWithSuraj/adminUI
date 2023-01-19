import "./Pagination.css";
const Pagination = ({
  usersPerPage,
  totalUsers,
  setCurrentPage,
  currentUsersPage,
}) => {
  const pageNumbers = [];
  for (
    let pageNum = 1;
    pageNum <= Math.ceil(totalUsers / usersPerPage);
    pageNum++
  ) {
    pageNumbers.push(pageNum);
  }
  const handleNextPage = () => {
    if (
      currentUsersPage >= 1 &&
      currentUsersPage < Math.ceil(totalUsers / usersPerPage)
    ) {
      setCurrentPage(currentUsersPage + 1);
    }
  };
  const handlePrevPage = () => {
    if (
      currentUsersPage > 1 &&
      currentUsersPage <= Math.ceil(totalUsers / usersPerPage)
    ) {
      setCurrentPage(currentUsersPage - 1);
    }
  };
  return (
    <div className="pagination">
      <span>
        <button onClick={handlePrevPage}>{`<`}</button>
      </span>
      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={page === currentUsersPage ? "P-active" : ""}
        >
          {page}
        </button>
      ))}
      <span>
        <button onClick={handleNextPage}>{`>`}</button>
      </span>
    </div>
  );
};

export default Pagination;
