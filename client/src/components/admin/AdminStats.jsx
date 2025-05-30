import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Alert, 
  CircularProgress, 
  Grid, 
  Paper, 
  Typography, 
  Box,
  Card,
  CardContent,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  RateReview as ReviewIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

const AdminStats = () => {
  const [stats, setStats] = useState({ 
    totalUsers: 0, 
    totalCourses: 0, 
    totalReviews: 0 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const res = await axios.get('https://skillsharehubaicodebackend.onrender.com/api/admin/analytics', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (res.data) {
        setStats(res.data);
        setError('');
      } else {
        throw new Error('No data received from server');
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err.response?.data?.error || err.message || 'Failed to fetch analytics. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
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

  const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'visible',
      '&:hover': {
        transform: 'translateY(-4px)',
        transition: 'transform 0.3s ease-in-out'
      }
    }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" component="div" color="text.secondary">
            {title}
          </Typography>
          <Box 
            sx={{ 
              backgroundColor: `${color}.light`,
              borderRadius: '50%',
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {icon}
          </Box>
        </Box>
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: `${color}.main` }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" component="h2" gutterBottom>
          Platform Statistics
        </Typography>
        <Tooltip title="Refresh Statistics">
          <IconButton onClick={fetchStats} color="primary">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<PeopleIcon sx={{ color: 'primary.main' }} />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Total Courses"
            value={stats.totalCourses}
            icon={<SchoolIcon sx={{ color: 'success.main' }} />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Total Reviews"
            value={stats.totalReviews}
            icon={<ReviewIcon sx={{ color: 'warning.main' }} />}
            color="warning"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminStats;
