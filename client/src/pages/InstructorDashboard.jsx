import React, { useEffect, useState } from 'react';
import axios from 'axios';

const InstructorDashboard = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios.get('/api/courses/mine')
      .then((res) => setCourses(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Courses</h2>
      <ul className="grid gap-4">
        {courses.map((course) => (
          <li key={course._id} className="border p-4 rounded shadow">
            <h3 className="text-xl font-semibold">{course.title}</h3>
            <p>{course.description}</p>
            <p><strong>Price:</strong> ${course.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InstructorDashboard;
