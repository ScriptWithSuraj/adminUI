import { useEffect, useState } from "react";
import "./UsersListPage.css";
import Pagination from "./Pagination";
import EditUser from "./EditUser";
import config from "../services/config";
import SearchUser from "./SearchUser";
const UsersListPage = () => {
  const [users, setUsers] = useState([]); // users data from api call.
  // { for pagination }
  const [currentUsersPage, setCurrentUsersPage] = useState(1); // determines the current page number
  const usersPerPage = 10; // total users displayed per page.
  let indexOfLastUser = currentUsersPage * usersPerPage; // determines the last user on the page.
  let indexOfFirstUser = indexOfLastUser - usersPerPage; // determines the first user on the page.
  // { for Users table operations}
  const [isChecked, setIsChecked] = useState([]); // contains the lists of users which are selected using checkbox.
  const [isCheckedAll, setIsCheckedAll] = useState(false); // checking whether all users are selected on current page.
  // {for searching the user}
  const [searchedUser, setSearchedUsers] = useState([]);
  const [searchUser, setSearchUser] = useState(""); //  searching user by name, email or by role.
  // const [data, setData] = useState([]); //  this state helps to set the setUser state when search becomes empty
  const currentUsers =
    searchUser.length < 1
      ? users.slice(indexOfFirstUser, indexOfLastUser)
      : searchedUser.slice(indexOfFirstUser, indexOfLastUser); // detremines the total users currently on the page.
  const [isEditing, setIsEditing] = useState(-1); //  this state holds the id of currently edited user.
  const totalPages = users.length; // determines the total page numbers need to be displayed on pagination.
  const totalPagesSearched = searchedUser.length;

  //  getting users data  from api
  const getUsersInformations = async () => {
    try {
      const response = await fetch(config.endpoint);
      const usersData = await response.json();
      setUsers(usersData);
      // setData(usersData);
    } catch (error) {
      console.log(error);
      return null;
    }
  };
  // api call on  every mounting
  useEffect(() => {
    getUsersInformations();
  }, []);
  //   searching user data by name, role or email
  const searchUserData = (e) => {
    const search = e.target.value;
    setSearchUser(search);
    if (search !== "") {
      const filteredUsers = users.filter(
        (user) =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase()) ||
          user.role.toLowerCase().includes(search.toLowerCase())
      );

      setCurrentUsersPage(1);
      setSearchedUsers(filteredUsers);
    } else {
      setSearchedUsers([]);
    }
    setSearchUser(e.target.value);
  };
  //  displaying the users in another page on pagination
  // const pageChange = ({ selected }) => {
  //   setCurrentUsersPage(selected + 1);
  // };
  //  selecting the users at a time and storing it to isChecked state.
  const selectOne = (e) => {
    const { id, checked } = e.target;
    setIsChecked([...isChecked, id]);

    if (!checked) {
      setIsChecked(isChecked.filter((item) => item !== id));
    }
  };
  //  selecting the total users in the current page
  const selectAll = () => {
    setIsCheckedAll(!isCheckedAll);
    setIsChecked(currentUsers.map((item) => item.id));
    if (isCheckedAll) {
      setIsChecked([]);
    }
  };
  //  handling the which users is getting edited currently
  const handleEdit = (userId) => {
    setIsEditing(userId);
  };
  //  submitting the (changed values in the input field )/ edited field
  const handleSubmit = (e) => {
    e.preventDefault();
    const name = e.target.elements.name.value;
    const email = e.target.elements.email.value;
    const role = e.target.elements.role.value;
    if (!searchUser.length) {
      const newList = users.map((item) =>
        item.id === isEditing
          ? { ...item, name: name, email: email, role: role }
          : item
      );
      setUsers(newList);
      setIsEditing(-1);
    } else {
      const newList = searchedUser.map((item) =>
        item.id === isEditing
          ? { ...item, name: name, email: email, role: role }
          : item
      );
      setSearchedUsers(newList);
      setIsEditing(-1);
    }
  };

  //  deleting the selected user with delte button present in the row
  const deleteUser = (selectedUser) => {
    if (!searchUser.length) {
      const usersAfterDeletion = users.filter((user) => {
        return user.id !== selectedUser;
      });
      setUsers(usersAfterDeletion);
      // setSearchedUsers(usersAfterDeletion);
    } else {
      const usersAfterDeletion = searchedUser.filter((user) => {
        return user.id !== selectedUser;
      });
      setSearchedUsers(usersAfterDeletion);
      // setUsers(usersAfterDeletion);
    }
  };
  //  deleting the selected user which are marked as tick by main delete button.
  const deleteSelectedUser = () => {
    if (!searchUser.length) {
      const usersAfterDeletion = users.filter((user) => {
        return !isChecked.includes(user.id);
      });
      setUsers(usersAfterDeletion);
    } else {
      const usersAfterDeletion = searchedUser.filter((user) => {
        return !isChecked.includes(user.id);
      });
      setSearchedUsers(usersAfterDeletion);
    }
  };
  //   this component contains the user information as tabular row format
  const UsersList = users
    .slice(indexOfFirstUser, indexOfLastUser)
    .map((user) => {
      //  if user is getting edited then rendering the EditUser component
      return isEditing === user.id ? (
        <EditUser user={user} lists={users} setList={setUsers} key={user.id} />
      ) : (
        // user row data
        <tr
          key={user.id}
          style={{
            backgroundColor: isChecked.includes(user.id)
              ? "#eee"
              : "transparent",
          }}
        >
          <td>
            <input
              // key={user.id}
              type="checkbox"
              id={user.id}
              name={user.name}
              onChange={selectOne}
              checked={isChecked.includes(user.id)}
            />
          </td>
          <td>{user.name}</td> <td>{user.email}</td>
          <td>{user.role}</td>
          <td>
            <div>
              <button
                onClick={() => handleEdit(user.id)}
                className="editButton"
              >
                Edit
              </button>
              <button
                onClick={() => deleteUser(user.id)}
                className="deleteButton"
              >
                Delete
              </button>
            </div>
          </td>
        </tr>
      );
    });
  const SearchUsersList = searchedUser
    .slice(indexOfFirstUser, indexOfLastUser)
    .map((user) => {
      return isEditing === user.id ? (
        <EditUser
          user={user}
          lists={searchedUser}
          setList={setSearchedUsers}
          key={user.id}
        />
      ) : (
        // user row data
        <tr
          key={user.id}
          style={{
            backgroundColor: isChecked.includes(user.id)
              ? "#eee"
              : "transparent",
          }}
        >
          <td>
            <input
              // key={user.id}
              type="checkbox"
              id={user.id}
              name={user.name}
              onChange={selectOne}
              checked={isChecked.includes(user.id)}
            />
          </td>
          <td>{user.name}</td> <td>{user.email}</td>
          <td>{user.role}</td>
          <td>
            <div>
              <button
                onClick={() => handleEdit(user.id)}
                className="editButton"
              >
                Edit
              </button>
              <button
                onClick={() => deleteUser(user.id)}
                className="deleteButton"
              >
                Delete
              </button>
            </div>
          </td>
        </tr>
      );
    });
  return (
    <div className="main">
      <br />
      {/* search bar */}
      <SearchUser searchUser={searchUser} searchUserData={searchUserData} />
      {/*  user table */}
      <form onSubmit={handleSubmit} className="userForm">
        <table className="table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  name="selectAll"
                  // id="selectAll"
                  onChange={selectAll}
                  checked={isCheckedAll}
                />
              </th>
              <th>Name</th> <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{searchUser.length < 1 ? UsersList : SearchUsersList}</tbody>
        </table>
      </form>
      <button className="deleteAll" type="button" onClick={deleteSelectedUser}>
        Delete Selected
      </button>
      {/*  for pagination */}
      <Pagination
        usersPerPage={usersPerPage}
        totalUsers={searchUser !== "" ? totalPagesSearched : totalPages}
        setCurrentPage={setCurrentUsersPage}
        currentUsersPage={currentUsersPage}
      />
    </div>
  );
};
export default UsersListPage;
