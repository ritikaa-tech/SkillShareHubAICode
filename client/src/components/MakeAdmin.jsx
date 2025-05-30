import React, { useState } from 'react';
import axios from 'axios';
import { Button, Alert } from '@mui/material';
import { getUserIdFromToken } from '../utils/decodeToken';

const MakeAdmin = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleMakeAdmin = async () => {
    try {
      const userId = getUserIdFromToken();
      if (!userId) {
        setError('No user ID found. Please log in again.');
        return;
      }

      const response = await axios.patch(
        `http://localhost:5002/api/users/make-admin/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setMessage('Successfully made admin! Please log out and log in again.');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to make admin');
      setMessage('');
    }
  };

  return (
    <div style={{ margin: '20px' }}>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleMakeAdmin}
        style={{ marginBottom: '10px' }}
      >
        Make Current User Admin
      </Button>
      
      {message && (
        <Alert severity="success" style={{ marginTop: '10px' }}>
          {message}
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" style={{ marginTop: '10px' }}>
          {error}
        </Alert>
      )}
    </div>
  );
};

export default MakeAdmin; 