import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReviewForm from '../components/ReviewForm';
// import ReviewsList from '../components/ReviewsList';

const CoursePage = ({ courseId, userId }) => {
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    const res = await axios.get(`/api/reviews/${courseId}`);
    setReviews(res.data);
  };

  useEffect(() => {
    fetchReviews();
  }, [courseId]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-2">Course Reviews</h2>
      <ReviewForm courseId={courseId} userId={userId} onReviewSubmit={fetchReviews} />
      <ReviewsList reviews={reviews} />
    </div>
  );
};

export default CoursePage;
