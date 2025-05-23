import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProgressBar from '../components/ProgressBar';

const LearnerDashboard = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const enrolledCourses = await axios.get('/api/enrollments/mine'); // Replace with your real route
        const dataWithProgress = await Promise.all(
          enrolledCourses.data.map(async (course) => {
            const res = await axios.get(`/api/progress/${course._id}`);
            return {
              ...course,
              progress: res.data?.percentage || 0,
            };
          })
        );
        setCourses(dataWithProgress);
      } catch (err) {
        console.error('Failed to fetch learner data', err);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Courses</h2>
      <ul className="grid gap-6">
        {courses.map((course) => (
          <li key={course._id} className="p-4 border rounded shadow">
            <h3 className="text-lg font-semibold">{course.title}</h3>
            <ProgressBar percentage={course.progress} />
            <p className="text-sm text-gray-600">{course.progress}% completed</p>
            <a
              href={`/course/${course._id}`}
              className="inline-block mt-2 text-blue-500 hover:underline"
            >
              Continue Course
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LearnerDashboard;
