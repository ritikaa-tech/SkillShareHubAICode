import React from 'react';
import { FaStar } from 'react-icons/fa';

const ReviewsList = ({ reviews }) => {
  if (!Array.isArray(reviews)) {
    return <div className="text-gray-500 italic">No reviews available.</div>;
  }

  return (
    <div className="mt-4 space-y-4">
      {reviews.map((review) => (
        <div key={review._id} className="border rounded p-3">
          <div className="flex items-center gap-2">
            <strong>{review.userId?.name || "Anonymous"}</strong>
            {[...Array(review.rating)].map((_, i) => (
              <FaStar key={i} className="text-yellow-500" />
            ))}
          </div>
          <p>{review.comment}</p>
          <p className="text-sm text-gray-400">
            {new Date(review.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ReviewsList;
