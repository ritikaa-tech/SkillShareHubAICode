import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminStats = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalCourses: 0, totalReviews: 0 });

  useEffect(() => {
    axios.get('/api/admin/analytics').then(res => setStats(res.data));
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4 text-center">
      <div className="p-4 bg-blue-100 rounded shadow">
        <h3 className="text-lg font-bold">Users</h3>
        <p className="text-2xl">{stats.totalUsers}</p>
      </div>
      <div className="p-4 bg-green-100 rounded shadow">
        <h3 className="text-lg font-bold">Courses</h3>
        <p className="text-2xl">{stats.totalCourses}</p>
      </div>
      <div className="p-4 bg-yellow-100 rounded shadow">
        <h3 className="text-lg font-bold">Reviews</h3>
        <p className="text-2xl">{stats.totalReviews}</p>
      </div>
    </div>
  );
};

export default AdminStats;
