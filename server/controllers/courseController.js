const course = new Course({
  title,
  description,
  price,
  instructor: req.user._id,
  averageRating: 0,
  enrolledStudents: []
}); 