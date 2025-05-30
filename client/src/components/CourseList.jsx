import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  School as SchoolIcon,
  People as PeopleIcon,
  Star as StarIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openEnrollDialog, setOpenEnrollDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to fetch courses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollClick = (course) => {
    setSelectedCourse(course);
    setOpenEnrollDialog(true);
  };

  const handleEnrollConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/enrollments', {
        courseId: selectedCourse._id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOpenEnrollDialog(false);
      navigate('/dashboard'); // Redirect to user dashboard after enrollment
    } catch (err) {
      console.error('Error enrolling in course:', err);
      setError(err.response?.data?.message || 'Failed to enroll in course. Please try again later.');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Available Courses
      </Typography>

      <Grid container spacing={3}>
        {courses.length === 0 ? (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography align="center" color="textSecondary">
                  No courses available at the moment.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ) : (
          courses.map((course) => (
            <Grid item xs={12} md={6} lg={4} key={course._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {course.title}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {course.category} • {course.level}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {course.description.substring(0, 100)}...
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" color="primary">
                      ${course.price}
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => handleEnrollClick(course)}
                    >
                      Enroll Now
                    </Button>
                  </Box>
                  <Box mt={2}>
                    <Chip
                      icon={<PeopleIcon />}
                      label={`${course.enrolledStudents?.length || 0} students`}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      icon={<StarIcon />}
                      label={`${course.averageRating || 0} rating`}
                      size="small"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Dialog open={openEnrollDialog} onClose={() => setOpenEnrollDialog(false)}>
        <DialogTitle>Enroll in Course</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to enroll in "{selectedCourse?.title}"?
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Course Price: ${selectedCourse?.price}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEnrollDialog(false)}>Cancel</Button>
          <Button onClick={handleEnrollConfirm} variant="contained" color="primary">
            Confirm Enrollment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CourseList; 