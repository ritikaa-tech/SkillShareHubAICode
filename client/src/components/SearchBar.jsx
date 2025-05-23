import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleInput = async (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val.length > 2) {
      const res = await axios.get(`/api/courses/search?query=${val}`);
      setSuggestions(res.data.slice(0, 5)); // Limit suggestions
    } else {
      setSuggestions([]);
    }
  };

  const handleSearch = () => {
    onSearch({ query });
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={handleInput}
        placeholder="Search courses..."
        className="border px-4 py-2 w-full"
      />
      {suggestions.length > 0 && (
        <ul className="absolute bg-white shadow w-full z-10">
          {suggestions.map(course => (
            <li
              key={course._id}
              onClick={() => { setQuery(course.title); setSuggestions([]); onSearch({ query: course.title }); }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {course.title}
            </li>
          ))}
        </ul>
      )}
      <button onClick={handleSearch} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Search</button>
    </div>
  );
};

export default SearchBar;
