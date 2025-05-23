import React, { useState } from 'react';
import axios from 'axios';

const InstructorCourseForm = () => {
  const [course, setCourse] = useState({
    title: '',
    description: '',
    price: 0,
    category: '',
    tags: '',
    thumbnail: '',
    videos: [{ title: '', url: '' }],
  });

  const handleChange = (e) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...course,
        tags: course.tags.split(',').map(tag => tag.trim()),
      };
      const res = await axios.post('/api/courses', payload);
      alert('Course created!');
      console.log(res.data);
    } catch (err) {
      console.error('Upload failed', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Create New Course</h2>

      <input name="title" onChange={handleChange} placeholder="Title" className="input" required />
      <textarea name="description" onChange={handleChange} placeholder="Description" className="textarea" />

      <input name="category" onChange={handleChange} placeholder="Category" className="input" />
      <input name="price" type="number" onChange={handleChange} placeholder="Price" className="input" />
      <input name="tags" onChange={handleChange} placeholder="Comma-separated tags" className="input" />

      <input name="thumbnail" onChange={handleChange} placeholder="Thumbnail URL" className="input" />

      <h3 className="mt-4">Videos</h3>
      <input
        name="videos[0].title"
        placeholder="Video Title"
        onChange={(e) =>
          setCourse({
            ...course,
            videos: [{ ...course.videos[0], title: e.target.value }],
          })
        }
        className="input"
      />
      <input
        name="videos[0].url"
        placeholder="Video URL"
        onChange={(e) =>
          setCourse({
            ...course,
            videos: [{ ...course.videos[0], url: e.target.value }],
          })
        }
        className="input"
      />

      <button type="submit" className="btn mt-4">Upload Course</button>
    </form>
  );
};

export default InstructorCourseForm;
