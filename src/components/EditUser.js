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
export default EditUser;
