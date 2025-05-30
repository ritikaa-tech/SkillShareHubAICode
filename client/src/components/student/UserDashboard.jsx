import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  LinearProgress,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Rating,
  Divider,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  School as SchoolIcon,
  Star as StarIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: ''
  });

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const [enrollmentsRes, reviewsRes] = await Promise.all([
        axios.get('/api/enrollments/mine', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('/api/reviews/mine', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setEnrolledCourses(enrollmentsRes.data);
      setReviews(reviewsRes.data);
      setError('');
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError(err.response?.data?.message || 'Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `/api/courses/${selectedCourse._id}/review`,
        newReview,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setOpenReviewDialog(false);
      setNewReview({ rating: 0, comment: '' });
      fetchUserData();
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err.response?.data?.message || 'Failed to submit review');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUserData();
    } catch (err) {
      console.error('Error deleting review:', err);
      setError('Failed to delete review');
    }
  };

  const renderEnrolledCourses = () => (
    <Grid container spacing={3}>
      {enrolledCourses.length === 0 ? (
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography align="center" color="textSecondary">
                You haven't enrolled in any courses yet.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ) : (
        enrolledCourses.map((enrollment) => (
          <Grid item xs={12} md={6} lg={4} key={enrollment._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {enrollment.course.title}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {enrollment.course.category} • {enrollment.course.level}
                </Typography>
                <Box sx={{ mt: 2, mb: 1 }}>
                  <Typography variant="body2" color="textSecondary">
                    Progress
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={enrollment.progress}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    {enrollment.progress}% Complete
                  </Typography>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Chip
                    label={enrollment.status}
                    color={enrollment.status === 'active' ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  startIcon={<PlayIcon />}
                  onClick={() => navigate(`/courses/${enrollment.course._id}`)}
                >
                  Continue Learning
                </Button>
                <Button
                  startIcon={<StarIcon />}
                  onClick={() => {
                    setSelectedCourse(enrollment.course);
                    setOpenReviewDialog(true);
                  }}
                >
                  Review
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))
      )}
    </Grid>
  );

  const renderReviews = () => (
    <List>
      {reviews.length === 0 ? (
        <Typography align="center" color="textSecondary">
          You haven't written any reviews yet.
        </Typography>
      ) : (
        reviews.map((review) => (
          <React.Fragment key={review._id}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar>
                  <SchoolIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={review.course.title}
                secondary={
                  <>
                    <Rating value={review.rating} readOnly size="small" />
                    <Typography variant="body2" color="textPrimary">
                      {review.comment}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(review.date).toLocaleDateString()}
                    </Typography>
                  </>
                }
              />
              <IconButton
                size="small"
                onClick={() => handleDeleteReview(review._id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))
      )}
    </List>
  );

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
        Welcome, {user?.name}!
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab icon={<SchoolIcon />} label="Enrolled Courses" />
        <Tab icon={<StarIcon />} label="My Reviews" />
      </Tabs>

      {activeTab === 0 && renderEnrolledCourses()}
      {activeTab === 1 && renderReviews()}

      <Dialog open={openReviewDialog} onClose={() => setOpenReviewDialog(false)}>
        <DialogTitle>Write a Review for {selectedCourse?.title}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography component="legend">Rating</Typography>
            <Rating
              value={newReview.rating}
              onChange={(e, newValue) => {
                setNewReview({ ...newReview, rating: newValue });
              }}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Your Review"
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReviewDialog(false)}>Cancel</Button>
          <Button
            onClick={handleReviewSubmit}
            variant="contained"
            disabled={!newReview.rating || !newReview.comment}
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserDashboard; 