// src/pages/CourseDetail.js
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import isEqual from 'lodash.isequal';

import Task from './Task';
import CoursePage from './CoursePage';
import ReviewForm from '../components/ReviewForm';
// import ReviewsList from '../components/ReviewsList';
import { useParams } from 'react-router-dom';

import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
} from '@mui/material';

const CourseDetail = () => {
  const { id } = useParams();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const [course, setCourse] = useState(null);
  const [showTask, setShowTask] = useState(false);
  const [video, setVideo] = useState({ title: '', url: '' });
  const [resource, setResource] = useState({ name: '', link: '' });
  const [quiz, setQuiz] = useState({ question: '', options: '', answer: '' });
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchCourse = async () => {
      if (token) {
        const res = await axios.get(`https://skillsharehubbackend.onrender.com/api/courses/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!course || !isEqual(course, res.data)) {
          setCourse(res.data);
        }
      }
    };
    fetchCourse();
  }, [id, token]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`https://skillsharehubbackend.onrender.com/api/reviews/${id}`);
        setReviews(res.data);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      }
    };
    fetchReviews();
  }, [id]);

  const handleReviewSubmit = async () => {
    try {
      const res = await axios.get(`https://skillsharehubbackend.onrender.com/api/reviews/${id}`);
      setReviews(res.data);
    } catch (err) {
      console.error('Error refreshing reviews:', err);
    }
  };

  const handleAddField = async (field, data) => {
    try {
      switch (field) {
        case 'videos':
          if (!data.title || !data.url) {
            alert('Please fill in all fields for video');
            return;
          }
          break;
        case 'resources':
          if (!data.name || !data.link) {
            alert('Please fill in all fields for resource');
            return;
          }
          break;
        case 'quizzes':
          if (!data.question || !data.options || !data.answer) {
            alert('Please fill in all fields for quiz');
            return;
          }
          break;
        default:
          alert('Invalid field type');
          return;
      }

      const updated = await axios.put(
        `https://skillsharehubbackend.onrender.com/api/courses/${id}/${field}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCourse(updated.data);

      if (field === 'videos') setVideo({ title: '', url: '' });
      if (field === 'resources') setResource({ name: '', link: '' });
      if (field === 'quizzes') setQuiz({ question: '', options: '', answer: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const taskProps = useMemo(() => {
    if (!course) return null;
    return {
      quizzes: course.quizzes,
      videos: course.videos,
      resources: course.resources,
      title: course.title,
      description: course.description,
    };
  }, [course]);

  if (!course || !taskProps) return <Typography>Loading...</Typography>;

  return (
    <Container>
      <Typography variant="h4">{course.title}</Typography>
      <Typography>{course.description}</Typography>

      <Button onClick={() => setShowTask((prev) => !prev)} variant="contained" sx={{ mt: 1 }}>
        Add Task
      </Button>

      {showTask && (
        <>
          // Add Video
router.put('/:id/videos', authMiddleware, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    if (!course.videos) course.videos = [];
    course.videos.push(req.body);
    await course.save();
    res.json(course);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add video', details: err.message });
  }
});

// Add Resource
router.put('/:id/resources', authMiddleware, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    if (!course.resources) course.resources = [];
    course.resources.push(req.body);
    await course.save();
    res.json(course);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add resource', details: err.message });
  }
});

// Add Quiz
router.put('/:id/quizzes', authMiddleware, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    if (!course.quizzes) course.quizzes = [];
    course.quizzes.push(req.body);
    await course.save();
    res.json(course);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add quiz', details: err.message });
  }
});

        </>
      )}

      {/* Task Component */}
      <Task {...taskProps} />

      {/* Course Page (extra content) */}
      <CoursePage />

      {/* Reviews Section */}
      <Box mt={4}>
        <Typography variant="h5">Reviews</Typography>
        <Divider sx={{ my: 2 }} />

        {/* Review Form */}
        {token && (
          <ReviewForm
            courseId={id}
            userId={user?._id}
            onReviewSubmit={handleReviewSubmit}
          />
        )}

        {/* Reviews List */}
{/*       <ReviewsList reviews={reviews} /> */}
      </Box>
    </Container>
  );
};

export default CourseDetail;
