// src/pages/CourseDetail.js
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  Rating,
} from '@mui/material';
import CourseRating from '../components/CourseRating';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRating, setUserRating] = useState(null);

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5002/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourse(response.data);

      // Fetch user's rating if they're enrolled
      if (user) {
        const enrollmentResponse = await axios.get(`http://localhost:5002/api/enrollments/mine`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const userEnrollment = enrollmentResponse.data.find(e => e.course._id === id);
        if (userEnrollment) {
          setUserRating({
            rating: userEnrollment.rating,
            review: userEnrollment.review
          });
        }
      }
    } catch (err) {
      console.error('Error fetching course details:', err);
      setError('Failed to fetch course details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/courses/${id}` } });
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5002/api/enrollments/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Error enrolling in course:', err);
      setError(err.response?.data?.message || 'Failed to enroll in course. Please try again later.');
    }
  };

  const handleRatingSubmit = (newRating) => {
    setUserRating(newRating);
    // Update course's average rating
    setCourse(prev => ({
      ...prev,
      averageRating: ((prev.averageRating * prev.enrolledStudents.length) + newRating.rating) / 
                    (prev.enrolledStudents.length + 1)
    }));
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
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!course) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          Course not found
        </Alert>
      </Container>
    );
  }

  const isEnrolled = user && course.enrolledStudents.some(student => student._id === user._id);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Typography variant="h4" gutterBottom>
            {course.title}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={course.averageRating} readOnly precision={0.5} />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({course.enrolledStudents.length} students)
            </Typography>
          </Box>

          <Typography variant="h6" gutterBottom>
            About This Course
          </Typography>
          <Typography paragraph>
            {course.description}
          </Typography>

          <Typography variant="h6" gutterBottom>
            What You'll Learn
          </Typography>
          <Typography paragraph>
            {course.learningObjectives}
          </Typography>

          {isEnrolled && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" gutterBottom>
                Your Rating
              </Typography>
              <CourseRating
                courseId={course._id}
                userRating={userRating}
                onRatingSubmit={handleRatingSubmit}
              />
            </>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h5" color="primary" gutterBottom>
              ${course.price}
            </Typography>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={handleEnroll}
              disabled={isEnrolled}
              sx={{ mt: 2 }}
            >
              {isEnrolled ? 'Enrolled' : 'Enroll Now'}
            </Button>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                This course includes:
              </Typography>
              <ul>
                <li>Full lifetime access</li>
                <li>Certificate of completion</li>
                <li>Downloadable resources</li>
                <li>Instructor support</li>
              </ul>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CourseDetail;
