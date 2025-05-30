import React, { useState } from 'react';
import {
  Box,
  Rating,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material';
import axios from 'axios';

const CourseRating = ({ courseId, userRating, onRatingSubmit }) => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(userRating?.rating || 0);
  const [review, setReview] = useState(userRating?.review || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setError('');
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to rate this course');
        return;
      }

      // First check if user is enrolled
      const enrollmentResponse = await axios.get(`https://skillsharehubaicodebackend.onrender.com/api/enrollments/mine`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const isEnrolled = enrollmentResponse.data.some(
        enrollment => enrollment.course._id === courseId
      );

      if (!isEnrolled) {
        setError('You must be enrolled in this course to rate it');
        return;
      }

      // Submit the rating
      const response = await axios.post(
        `https://skillsharehubaicodebackend.onrender.com/api/courses/${courseId}/rate`,
        { rating, review },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onRatingSubmit({ rating, review });
      handleClose();
    } catch (err) {
      console.error('Error submitting rating:', err);
      setError(err.response?.data?.message || 'Failed to submit rating. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        onClick={handleOpen}
        sx={{ mt: 2 }}
      >
        {userRating ? 'Update Rating' : 'Rate This Course'}
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {userRating ? 'Update Your Rating' : 'Rate This Course'}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box sx={{ my: 2 }}>
            <Typography component="legend">Your Rating</Typography>
            <Rating
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
              precision={0.5}
              size="large"
            />
          </Box>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Your Review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your experience with this course..."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={loading || rating === 0}
          >
            {loading ? 'Submitting...' : 'Submit Rating'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CourseRating; 