import React from 'react';
import { Container, Typography, Box, Alert } from '@mui/material';
import UserTable from '../components/admin/UserTable';
import AdminStats from '../components/admin/AdminStats';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          You do not have permission to access this page.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Welcome back, {user.name}! Here's an overview of your platform.
        </Typography>
      </Box>

      <Box sx={{ mb: 6 }}>
        <AdminStats />
      </Box>

      <Box>
        <Typography variant="h5" component="h2" gutterBottom>
          Manage Users
        </Typography>
        <UserTable />
      </Box>
    </Container>
  );
};

export default AdminDashboard;
