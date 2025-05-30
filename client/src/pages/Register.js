import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Alert,
  MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user', // Default role
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Registration successful! You can now log in.');
        setError('');
        setFormData({ name: '', email: '', password: '', role: 'user' });
        setTimeout(() => navigate('/login'), 2000);
      } else {
        // Handle validation errors
        if (data.errors && Array.isArray(data.errors)) {
          const errorMessages = data.errors.map(err => err.msg).join(', ');
          setError(errorMessages);
        } else {
          setError(data.message || 'Registration failed');
        }
        setSuccess('');
      }
    } catch (err) {
      console.error('Registration error:', err);
      if (!navigator.onLine) {
        setError('No internet connection. Please check your network and try again.');
      } else {
        setError('Unable to connect to the server. Please try again later.');
      }
      setSuccess('');
    }
  };

  return (
    <Container maxWidth="sm" className="register-container">
      <Box>
        <Paper elevation={3} className="register-paper">
          <Typography variant="h4" component="h1" className="register-title">
            Register
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
          <form onSubmit={handleSubmit} className="register-form">
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <TextField
              select
              fullWidth
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="instructor">Instructor</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Register
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}

export default Register;
