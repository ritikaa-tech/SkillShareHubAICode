# SkillShareHub

A platform for sharing and learning skills through online courses.

## Features

- User authentication and authorization
- Course creation and management
- Course enrollment with payment integration
- Course rating and review system
- Progress tracking
- Instructor dashboard
- Student dashboard
- Payment processing with Razorpay

## Tech Stack

- Frontend: React.js, Material-UI
- Backend: Node.js, Express.js
- Database: MongoDB
- Payment: Razorpay
- Authentication: JWT

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Razorpay account

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/yourusername/SkillShareHub.git
cd SkillShareHub
```

2. Install dependencies:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Create environment files:

Create `.env` in the server directory:
```
PORT=5002
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_secret
```

4. Start the development servers:

```bash
# Start server (from server directory)
npm run dev

# Start client (from client directory)
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5002

## Project Structure

```
SkillShareHub/
├── client/                 # Frontend React application
│   ├── public/            # Static files
│   └── src/               # React source files
│       ├── components/    # Reusable components
│       ├── context/       # React context
│       ├── pages/         # Page components
│       └── utils/         # Utility functions
├── server/                # Backend Node.js application
│   ├── config/           # Configuration files
│   ├── middleware/       # Custom middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   └── utils/            # Utility functions
└── uploads/              # Uploaded files
    ├── videos/           # Course videos
    └── resources/        # Course resources
```

## API Documentation

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user

### Courses
- GET /api/courses - Get all courses
- POST /api/courses - Create a new course
- GET /api/courses/:id - Get course by ID
- PUT /api/courses/:id - Update course
- DELETE /api/courses/:id - Delete course

### Enrollments
- POST /api/enrollments/:courseId - Enroll in a course
- GET /api/enrollments/mine - Get user's enrollments
- PUT /api/enrollments/:id/progress - Update course progress

### Payments
- POST /api/payments/create-order - Create payment order
- POST /api/payments/verify - Verify payment

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Your Name - your.email@example.com
Project Link: https://github.com/yourusername/SkillShareHub