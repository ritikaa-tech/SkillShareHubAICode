import React, { useState } from 'react';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FilterSidebar';

const CourseSearchPage = () => {
  const [courses, setCourses] = useState([]);

  const handleSearch = async (params) => {
    const query = new URLSearchParams(params).toString();
    const res = await axios.get(`/api/courses/search?${query}`);
    setCourses(res.data);
  };

  return (
    <div className="p-6 grid grid-cols-4 gap-6">
      <div>
        <FilterSidebar onFilter={handleSearch} />
      </div>
      <div className="col-span-3 space-y-4">
        <SearchBar onSearch={handleSearch} />
        <div className="grid grid-cols-2 gap-4">
          {courses.map(course => (
            <div key={course._id} className="p-4 border rounded shadow">
              <h3 className="text-xl font-semibold">{course.title}</h3>
              <p className="text-gray-600">{course.description}</p>
              <p className="text-sm text-gray-500">${course.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseSearchPage;
