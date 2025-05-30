import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Alert, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { jwtDecode } from 'jwt-decode';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Debug token
      try {
        const decoded = jwtDecode(token);
        console.log('Decoded token:', decoded);
        console.log('User role from token:', decoded.role);
      } catch (e) {
        console.error('Error decoding token:', e);
      }

      const res = await axios.get('https://skillsharehubaicodebackend.onrender.com/api/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (res.data) {
        setUsers(res.data);
        setError('');
      } else {
        throw new Error('No data received from server');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      if (err.response) {
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
      }
      setError(err.response?.data?.error || err.message || 'Failed to fetch users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      await axios.patch(`https://skillsharehubaicodebackend.onrender.com/api/admin/users/${id}/block`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchUsers();
    } catch (err) {
      console.error('Error blocking user:', err);
      setError(err.response?.data?.error || err.message || 'Failed to block user. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      await axios.delete(`https://skillsharehubaicodebackend.onrender.com/api/admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err.response?.data?.error || err.message || 'Failed to delete user. Please try again.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
        <br />
        <small>Please make sure you're logged in as an admin and the server is running.</small>
      </Alert>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleBlock(user._id)}
                  sx={{ mr: 1 }}
                >
                  {user.isBlocked ? 'Unblock' : 'Block'}
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => handleDelete(user._id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserTable;
