# SkillshareHub

A MERN stack application for sharing and learning skills.

## Project Structure

```
skillsharehub/
├── client/                 # React frontend
│   ├── public/            # Static files
│   └── src/               # React source files
└── server/                # Node.js backend
    ├── config/            # Configuration files
    ├── controllers/       # Route controllers
    ├── models/           # Database models
    ├── routes/           # API routes
    └── middleware/       # Custom middleware
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a .env file and add your environment variables
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## Environment Variables

Create a `.env` file in the server directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skillsharehub
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

## Available Scripts

### Backend
- `