import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  InputAdornment,
  Rating
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  Star as StarIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CourseRating from '../components/CourseRating';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openEnrollDialog, setOpenEnrollDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');
  const [userRatings, setUserRatings] = useState({});
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchCourses();
    if (user) {
      fetchUserRatings();
    }
  }, [user]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('https://skillsharehubaicodebackend.onrender.com/api/courses', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCourses(response.data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to fetch courses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRatings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://skillsharehubaicodebackend.onrender.com/api/enrollments/mine', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const ratings = {};
      response.data.forEach(enrollment => {
        if (enrollment.rating) {
          ratings[enrollment.course._id] = {
            rating: enrollment.rating,
            review: enrollment.review
          };
        }
      });
      setUserRatings(ratings);
    } catch (err) {
      console.error('Error fetching user ratings:', err);
    }
  };

  const handleEnrollClick = (course) => {
    if (!user) {
      navigate('/login', { state: { from: '/courses' } });
      return;
    }
    setSelectedCourse(course);
    setOpenEnrollDialog(true);
  };

  const handleEnrollConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to enroll in courses');
        return;
      }

      // Create payment order
      const orderResponse = await axios.post(
        'https://skillsharehubaicodebackend.onrender.com/api/payments/create-order',
        { courseId: selectedCourse._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!orderResponse.data.success) {
        throw new Error('Failed to create payment order');
      }

      const { order, key } = orderResponse.data;

      // Initialize Razorpay
      const options = {
        key: key,
        amount: order.amount,
        currency: order.currency,
        name: 'SkillShareHub',
        description: `Enrollment in ${selectedCourse.title}`,
        order_id: order.id,
        handler: async (response) => {
          try {
            // Verify payment
            const verifyResponse = await axios.post(
              'https://skillsharehubaicodebackend.onrender.com/api/payments/verify',
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyResponse.data.success) {
              // Update the course's enrolled students count
              setCourses(prev => prev.map(course => {
                if (course._id === selectedCourse._id) {
                  return {
                    ...course,
                    enrolledStudents: [...(course.enrolledStudents || []), user._id]
                  };
                }
                return course;
              }));

              setOpenEnrollDialog(false);
              navigate('/dashboard');
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (err) {
            console.error('Error verifying payment:', err);
            setError('Payment verification failed. Please try again.');
          }
        },
        prefill: {
          name: user.name,
          email: user.email
        },
        theme: {
          color: '#1976d2'
        },
        modal: {
          ondismiss: function() {
            setError('Payment cancelled. Please try again.');
          }
        }
      };

      // Check if Razorpay is loaded
      if (typeof window.Razorpay === 'undefined') {
        throw new Error('Razorpay SDK not loaded');
      }

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error('Error enrolling in course:', err);
      setError(err.response?.data?.message || 'Failed to enroll in course. Please try again later.');
    }
  };

  const handleRatingSubmit = (courseId, newRating) => {
    setUserRatings(prev => ({
      ...prev,
      [courseId]: newRating
    }));

    // Update course's average rating in the list
    setCourses(prev => prev.map(course => {
      if (course._id === courseId) {
        const oldRating = userRatings[courseId]?.rating || 0;
        const ratingDiff = newRating.rating - oldRating;
        const totalRatings = course.enrolledStudents.length;
        return {
          ...course,
          averageRating: ((course.averageRating * totalRatings) + ratingDiff) / totalRatings
        };
      }
      return course;
    }));
  };

  const filteredCourses = courses.filter(course => {
    if (!course) return false;
    const matchesSearch = (course.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                         (course.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesCategory = !category || course.category === category;
    const matchesLevel = !level || course.level === level;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Available Courses
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <MenuItem value="">All Categories</MenuItem>
              <MenuItem value="programming">Programming</MenuItem>
              <MenuItem value="design">Design</MenuItem>
              <MenuItem value="business">Business</MenuItem>
              <MenuItem value="marketing">Marketing</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              select
              label="Level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <MenuItem value="">All Levels</MenuItem>
              <MenuItem value="beginner">Beginner</MenuItem>
              <MenuItem value="intermediate">Intermediate</MenuItem>
              <MenuItem value="advanced">Advanced</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {filteredCourses.length === 0 ? (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography align="center" color="textSecondary">
                  No courses found matching your criteria.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ) : (
          filteredCourses.map((course) => {
            const isEnrolled = user && course.enrolledStudents?.some(student => student._id === user._id);
            return (
              <Grid item xs={12} md={6} lg={4} key={course._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {course.title || 'Untitled Course'}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      {course.category || 'Uncategorized'} • {course.level || 'Not Specified'}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {course.description ? `${course.description.substring(0, 100)}...` : 'No description available'}
                    </Typography>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6" color="primary">
                        ${course.price || 0}
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={() => handleEnrollClick(course)}
                        disabled={isEnrolled}
                      >
                        {user ? (isEnrolled ? 'Enrolled' : 'Enroll Now') : 'Login to Enroll'}
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
                    {isEnrolled && (
                      <Box mt={2}>
                        <CourseRating
                          courseId={course._id}
                          userRating={userRatings[course._id]}
                          onRatingSubmit={(rating) => handleRatingSubmit(course._id, rating)}
                        />
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        )}
      </Grid>

      <Dialog open={openEnrollDialog} onClose={() => setOpenEnrollDialog(false)}>
        <DialogTitle>Enroll in Course</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to enroll in "{selectedCourse?.title || 'this course'}"?
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Course Price: ${selectedCourse?.price || 0}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEnrollDialog(false)}>Cancel</Button>
          <Button onClick={handleEnrollConfirm} variant="contained" color="primary">
            Proceed to Payment
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CourseList; 