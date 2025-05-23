import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserTable = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const res = await axios.get('/api/admin/users');
    setUsers(res.data);
  };

  const handleBlock = async (id) => {
    await axios.patch(`/api/admin/users/${id}/block`);
    fetchUsers();
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/admin/users/${id}`);
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th>Name</th><th>Email</th><th>Role</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td><td>{user.email}</td><td>{user.role}</td>
              <td>
                <button onClick={() => handleBlock(user._id)} className="px-2 py-1 bg-yellow-500 text-white rounded mr-2">Block</button>
                <button onClick={() => handleDelete(user._id)} className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
