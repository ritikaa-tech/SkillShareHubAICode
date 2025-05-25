import React, { useState } from 'react';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';

const ReviewForm = ({ courseId, userId, onReviewSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting review:', { userId, courseId, rating, comment });
      await axios.post('/api/reviews/', { userId, courseId, rating, comment });
      onReviewSubmit();
      setRating(0);
      setComment('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            size={24}
            className={star <= rating ? 'text-yellow-500' : 'text-gray-300'}
            onClick={() => setRating(star)}
          />
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your review..."
        className="w-full border rounded p-2"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;
