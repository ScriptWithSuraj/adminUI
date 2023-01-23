// this component is used for searching the user from search bar
const SearchUser = ({ searchUser, searchUserData }) => {
  return (
    <>
      <input
        className="searchBar"
        type="text"
        name="name"
        placeholder=" Search by name, email or role"
        onChange={(e) => searchUserData(e)}
        value={searchUser}
      />
    </>
  );
};
export default SearchUser;
