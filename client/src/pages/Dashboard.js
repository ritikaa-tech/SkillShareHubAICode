// client/src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    axiosInstance
      .get('/courses')
      .then((res) => setCourses(res.data))
      .catch((err) => console.error('Error loading courses', err));
  }, []);

  const handleAddVideo = (courseId) => {
    if (!videoUrl) return alert('Please enter a video URL');

    axiosInstance
      .put(`/courses/${courseId}/videos`, {
        title: 'New Video',
        url: videoUrl,
      })
      .then((res) => {
        alert('Video added!');
        setVideoUrl('');
        setCourses((prev) =>
          prev.map((c) => (c._id === res.data._id ? res.data : c))
        );
      })
      .catch((err) => console.error('Error adding video:', err));
  };

  const handleAddResource = (courseId) => {
    axiosInstance
      .put(`/courses/${courseId}/resources`, {
        title: 'New Resource',
        url: 'https://example.com/resource.pdf',
      })
      .then((res) => {
        alert('Resource added!');
        setCourses((prev) =>
          prev.map((c) => (c._id === res.data._id ? res.data : c))
        );
      })
      .catch((err) => console.error('Error adding resource:', err));
  };

  const handleAddQuiz = (courseId) => {
    axiosInstance
      .put(`/courses/${courseId}/quizzes`, {
        question: 'Sample Question?',
        options: ['A', 'B', 'C', 'D'],
        answer: 'A',
      })
      .then((res) => {
        alert('Quiz added!');
        setCourses((prev) =>
          prev.map((c) => (c._id === res.data._id ? res.data : c))
        );
      })
      .catch((err) => console.error('Error adding quiz:', err));
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <input
        type="text"
        placeholder="YouTube embed URL"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
      />
      {courses.map((course) => (
        <div key={course._id} style={{ border: '1px solid #ccc', margin: 10 }}>
          <h2>{course.title}</h2>
          <button type="button" onClick={() => handleAddVideo(course._id)}>
            Add Video
          </button>
          <button type="button" onClick={() => handleAddResource(course._id)}>
            Add Resource
          </button>
          <button type="button" onClick={() => handleAddQuiz(course._id)}>
            Add Quiz
          </button>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
