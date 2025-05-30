import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Alert, Button, Box } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';

const CheckRole = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState('');
  const [tokenInfo, setTokenInfo] = useState(null);
  const { user } = useAuth();

  const checkRole = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found');
        return;
      }

      // Decode token
      try {
        const decoded = jwtDecode(token);
        setTokenInfo(decoded);
      } catch (e) {
        console.error('Error decoding token:', e);
        setError('Invalid token format');
        return;
      }

      // Get user info from server
      const response = await axios.get('/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUserInfo(response.data);
      setError('');
    } catch (err) {
      console.error('Error checking role:', err);
      setError(err.response?.data?.message || 'Error checking role');
    }
  };

  useEffect(() => {
    checkRole();
  }, []);

  return (
    <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 1, mb: 2 }}>
      <h3>User Role Information</h3>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {user && (
        <div>
          <h4>Current User (from Auth Context):</h4>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
      )}

      {tokenInfo && (
        <div>
          <h4>Token Information:</h4>
          <pre>{JSON.stringify(tokenInfo, null, 2)}</pre>
        </div>
      )}

      {userInfo && (
        <div>
          <h4>Server User Information:</h4>
          <pre>{JSON.stringify(userInfo, null, 2)}</pre>
        </div>
      )}

      <Button 
        variant="contained" 
        onClick={checkRole}
        sx={{ mt: 2 }}
      >
        Refresh Role Information
      </Button>
    </Box>
  );
};

export default CheckRole; 