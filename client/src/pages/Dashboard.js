import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  TextField,
} from '@mui/material';
import './Dashboard.css'; // ✅ Import custom styles

const Dashboard = () => {
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [tags, setTags] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get('https://skillsharehubbackend.onrender.com/api/courses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data);
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  const handleAddCourseClick = () => {
    setShowForm(true);
    setEditingCourseId(null);
    setTitle('');
    setDescription('');
    setCategory('');
    setPrice('');
    setTags('');
    setThumbnail('');
  };

  const handleEditClick = (e, course) => {
    e.stopPropagation();
    setEditingCourseId(course._id);
    setShowForm(true);
    setTitle(course.title);
    setDescription(course.description);
    setCategory(course.category);
    setPrice(course.price);
    setTags(course.tags.join(', '));
    setThumbnail(course.thumbnail);
  };

  const handleDeleteClick = async (e, id) => {
    e.stopPropagation();
    try {
      await axios.delete(`https://skillsharehubbackend.onrender.com/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCourses();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleCardClick = (id) => {
    navigate(`/courses/${id}`);
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();

    const courseData = {
      title,
      description,
      category,
      price: parseFloat(price),
      tags: tags.split(',').map((tag) => tag.trim()),
      thumbnail,
    };

    try {
      if (editingCourseId) {
        await axios.put(`https://skillsharehubbackend.onrender.com/api/courses/${editingCourseId}`, courseData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post('https://skillsharehubbackend.onrender.com/api/courses', courseData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      fetchCourses();
      setShowForm(false);
      setEditingCourseId(null);
      setTitle('');
      setDescription('');
      setCategory('');
      setPrice('');
      setTags('');
      setThumbnail('');
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const handlePayment = async (e) => {
    e.stopPropagation();
    const options = {
      key: "rzp_test_I32MxpVUddAgQo",
      amount: 50000,
      currency: "INR",
      name: "Your Company Name",
      description: "Test Transaction",
      image: "https://your-logo-url.com/logo.png",
      order_id: "",
      handler: async function (response) {
        const data = await axios.post('https://skillsharehubbackend.onrender.com/api/payment/verify', {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        });
        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
      },
      prefill: {
        name: "Ritika Singh",
        email: "ritikasinghhh27@gmail.com",
        contact: "9380869785",
      },
      notes: {
        address: "Your Company Address",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  return (
    <Container maxWidth="lg" className="dashboard-container">
      <Box>
        <Typography variant="h4" gutterBottom>Dashboard</Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>My Courses</Typography>

          <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={handleAddCourseClick}>
            Create New Course
          </Button>

          <Grid container spacing={3}>
            {courses.length === 0 ? (
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography className="no-courses">No courses added yet.</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ) : (
              courses.map((course) => (
                <Grid item xs={12} sm={6} md={4} key={course._id}>
                  <Card className="course-card" onClick={() => handleCardClick(course._id)}>
                    <CardContent>
                      <Typography variant="h6">{course.title}</Typography>
                      <Typography>{course.description}</Typography>
                      <Typography color="textSecondary">Category: {course.category}</Typography>
                      <Typography color="textSecondary">Price: ${course.price}</Typography>
                      <Box className="course-buttons" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={(e) => handleEditClick(e, course)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          onClick={(e) => handleDeleteClick(e, course._id)}
                        >
                          Delete
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={handlePayment}
                        >
                          Buy Course
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>

          {showForm && (
            <Box
              component="form"
              onSubmit={handleCourseSubmit}
              className="course-form"
            >
              <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              <TextField
                label="Description"
                multiline
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <TextField label="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
              <TextField label="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
              <TextField
                label="Tags (comma-separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
              <TextField label="Thumbnail URL" value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} />
              <Button type="submit" variant="contained" color="secondary">
                {editingCourseId ? 'Update Course' : 'Save Course'}
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;
