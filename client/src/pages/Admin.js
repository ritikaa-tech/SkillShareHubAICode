import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Box, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Admin = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/api/users/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token]);

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 6 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Admin Panel
          </Typography>
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <>
              <Typography variant="h6" gutterBottom>
                All Users
              </Typography>
              <ul>
                {users.map((user) => (
                  <li key={user._id}>
                    {user.username} ({user.email}) - <b>{user.role}</b>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Admin; 