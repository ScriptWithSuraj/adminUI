import { useEffect, useState } from "react";
import "./UsersListPage.css";
import Pagination from "./Pagination";
const UsersListPage = () => {
  const [users, setUsers] = useState([]); // users data from api call.
  // { for pagination }
  const [currentUsersPage, setCurrentUsersPage] = useState(1); // determines the current page number
  const usersPerPage = 10; // total users displayed per page.
  let indexOfLastUser = currentUsersPage * usersPerPage; // determines the last user on the page.
  let indexOfFirstUser = indexOfLastUser - usersPerPage; // determines the first user on the page.
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser); // detremines the total users currently on the page.
  const totalPages = users.length; // determines the total page numbers need to be displayed on pagination.
  // { for Users table operations}
  const [isChecked, setIsChecked] = useState([]); // contains the lists of users which are selected using checkbox.
  const [isCheckedAll, setIsCheckedAll] = useState(false); // checking whether all users are selected on current page.
  // {for searching the user}
  const [searchedUser, setSearchedUsers] = useState([]);
  const [searchUser, setSearchUser] = useState(""); //  searching user by name, email or by role.
  // const [data, setData] = useState([]); //  this state helps to set the setUser state when search becomes empty
  const [isEditing, setIsEditing] = useState(-1); //  this state holds the id of currently edited user.

  //  getting users data  from api

  const getUsersInformations = async () => {
    try {
      const response = await fetch(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      );
      const usersData = await response.json();
      setUsers(usersData);
      // setData(usersData);
    } catch (error) {
      console.log(error);
      return null;
    }
  };
  // api call on  every mounting
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
          user.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
          user.email.toLowerCase().includes(e.target.value.toLowerCase()) ||
          user.role.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setSearchedUsers(filteredUsers);
    } else {
      setSearchedUsers(users);
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
  //   Its a component for editing user by name email role and it takes  three props
  const EditUser = ({ user, lists, setList }) => {
    // by name
    function handleInputName(e) {
      const value = e.target.value;
      const newList = lists.map((item) =>
        item.id === user.id ? { ...item, name: value } : item
      );
      setList(newList); // changing setUser state by passing the changed value in  name field
    }
    //  by email
    function handleInputEmail(e) {
      const value = e.target.value;
      const newList = lists.map((item) =>
        item.id === user.id ? { ...item, email: value } : item
      );
      setList(newList); // changing setUser state by passing the changed value in  email field
    }
    //  by role
    function handleInputRole(e) {
      const value = e.target.value;
      const newList = lists.map((item) =>
        item.id === user.id ? { ...item, role: value } : item
      );
      setList(newList); // changing setUser state by passing the changed value in  role field
    }
    return (
      <tr>
        <td></td>
        <td>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleInputName}
          />
        </td>
        <td>
          <input
            type="text"
            name="email"
            value={user.email}
            onChange={handleInputEmail}
          />
        </td>
        <td>
          <input
            type="text"
            name="role"
            value={user.role}
            onChange={handleInputRole}
          />
        </td>
        <td>
          <button type="submit" className="saveButton">
            Save
          </button>
        </td>
      </tr>
    );
  };
  //  submitting the (changed values in the input field )/ edited field
  const handleSubmit = (e) => {
    e.preventDefault();
    const name = e.target.elements.name.value;
    const email = e.target.elements.email.value;
    const role = e.target.elements.role.value;
    const newList = users.map((item) =>
      item.id === isEditing
        ? { ...item, name: name, email: email, role: role }
        : item
    );
    setUsers(newList);
    setIsEditing(-1);
  };

  //  deleting the selected user with delte button present in the row
  const deleteUser = (selectedUser) => {
    let usersAfterDeletion = users.filter((user) => {
      return user.id !== selectedUser;
    });
    setUsers(usersAfterDeletion);
  };
  //  deleting the selected user which are marked as tick by main delete button.
  const deleteSelectedUser = () => {
    let usersAfterDeletion = users.filter((user) => {
      return !isChecked.includes(user.id);
    });
    setUsers(usersAfterDeletion);
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
              key={user.id}
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
  const searchUsersList = searchedUser
    .slice(indexOfFirstUser, indexOfLastUser)
    .map((user) => {
      return (
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
              key={user.id}
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
              <button>edit</button>
              <button onClick={() => deleteUser(user.id)}>delete</button>
            </div>
          </td>
        </tr>
      );
    });
  return (
    <div className="main">
      <br />
      {/* search bar */}
      <input
        className="searchBar"
        type="text"
        name="name"
        placeholder=" Search by name, email or role"
        onChange={(e) => searchUserData(e)}
        value={searchUser}
      />
      {/*  user table */}
      <form onSubmit={handleSubmit} className="userForm">
        <table className="table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  name="selectAll"
                  id="selectAll"
                  onChange={selectAll}
                  checked={isCheckedAll}
                />
              </th>
              <th>Name</th> <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{searchUser.length < 1 ? UsersList : searchUsersList}</tbody>
        </table>
      </form>
      <button className="deleteAll" type="button" onClick={deleteSelectedUser}>
        Delete Selected
      </button>
      {/*  for pagination */}
      <Pagination
        usersPerPage={usersPerPage}
        totalUsers={totalPages}
        setCurrentPage={setCurrentUsersPage}
        currentUsersPage={currentUsersPage}
      />
    </div>
  );
};
export default UsersListPage;
