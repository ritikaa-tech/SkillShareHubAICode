import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Paper,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
  Save as SaveIcon,
  Quiz as QuizIcon,
  AttachFile as AttachFileIcon
} from '@mui/icons-material';
import axios from 'axios';

const steps = ['Basic Information', 'Course Content', 'Resources', 'Quizzes'];

const CreateCourse = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    level: '',
    thumbnail: null,
    videos: [],
    resources: [],
    quizzes: []
  });
  const [errors, setErrors] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});

  // Video upload handling
  const handleVideoUpload = async (event) => {
    const files = Array.from(event.target.files);
    const newVideos = [...courseData.videos];
    
    for (const file of files) {
      const formData = new FormData();
      formData.append('video', file);
      
      try {
        const response = await axios.post('https://skillsharehubaicodebackend.onrender.com/api/courses/upload-video', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(prev => ({
              ...prev,
              [file.name]: progress
            }));
          }
        });
        
        newVideos.push({
          title: file.name,
          url: response.data.url,
          duration: response.data.duration
        });
      } catch (error) {
        console.error('Error uploading video:', error);
        setErrors(prev => ({
          ...prev,
          videoUpload: 'Failed to upload video. Please try again.'
        }));
      }
    }
    
    setCourseData(prev => ({
      ...prev,
      videos: newVideos
    }));
  };

  // Resource upload handling
  const handleResourceUpload = async (event) => {
    const files = Array.from(event.target.files);
    const newResources = [...courseData.resources];
    
    for (const file of files) {
      const formData = new FormData();
      formData.append('resource', file);
      
      try {
        const response = await axios.post('https://skillsharehubaicodebackend.onrender.com/api/courses/upload-resource', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        newResources.push({
          title: file.name,
          url: response.data.url,
          type: file.type
        });
      } catch (error) {
        console.error('Error uploading resource:', error);
        setErrors(prev => ({
          ...prev,
          resourceUpload: 'Failed to upload resource. Please try again.'
        }));
      }
    }
    
    setCourseData(prev => ({
      ...prev,
      resources: newResources
    }));
  };

  // Quiz handling
  const [currentQuiz, setCurrentQuiz] = useState({
    title: '',
    questions: []
  });

  const addQuestion = () => {
    setCurrentQuiz(prev => ({
      ...prev,
      questions: [...prev.questions, {
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0
      }]
    }));
  };

  const handleQuizChange = (index, field, value) => {
    const updatedQuestions = [...currentQuiz.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    };
    setCurrentQuiz(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  };

  const saveQuiz = () => {
    if (currentQuiz.title && currentQuiz.questions.length > 0) {
      setCourseData(prev => ({
        ...prev,
        quizzes: [...prev.quizzes, currentQuiz]
      }));
      setCurrentQuiz({
        title: '',
        questions: []
      });
    }
  };

  // Form submission
  const handleSubmit = async () => {
    try {
      const response = await axios.post('https://skillsharehubaicodebackend.onrender.com/api/courses', courseData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data) {
        // Handle successful course creation
        console.log('Course created successfully:', response.data);
        // Reset form or redirect
      }
    } catch (error) {
      console.error('Error creating course:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to create course. Please try again.'
      }));
    }
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Course Title"
                value={courseData.title}
                onChange={(e) => setCourseData(prev => ({ ...prev, title: e.target.value }))}
                error={!!errors.title}
                helperText={errors.title}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Course Description"
                value={courseData.description}
                onChange={(e) => setCourseData(prev => ({ ...prev, description: e.target.value }))}
                error={!!errors.description}
                helperText={errors.description}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={courseData.price}
                onChange={(e) => setCourseData(prev => ({ ...prev, price: e.target.value }))}
                error={!!errors.price}
                helperText={errors.price}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.category}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={courseData.category}
                  onChange={(e) => setCourseData(prev => ({ ...prev, category: e.target.value }))}
                >
                  <MenuItem value="programming">Programming</MenuItem>
                  <MenuItem value="design">Design</MenuItem>
                  <MenuItem value="business">Business</MenuItem>
                  <MenuItem value="marketing">Marketing</MenuItem>
                </Select>
                {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.level}>
                <InputLabel>Level</InputLabel>
                <Select
                  value={courseData.level}
                  onChange={(e) => setCourseData(prev => ({ ...prev, level: e.target.value }))}
                >
                  <MenuItem value="beginner">Beginner</MenuItem>
                  <MenuItem value="intermediate">Intermediate</MenuItem>
                  <MenuItem value="advanced">Advanced</MenuItem>
                </Select>
                {errors.level && <FormHelperText>{errors.level}</FormHelperText>}
              </FormControl>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Box>
            <Box mb={3}>
              <Button
                variant="contained"
                component="label"
                startIcon={<CloudUploadIcon />}
              >
                Upload Videos
                <input
                  type="file"
                  hidden
                  multiple
                  accept="video/*"
                  onChange={handleVideoUpload}
                />
              </Button>
            </Box>
            
            <List>
              {courseData.videos.map((video, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={video.title}
                    secondary={`Duration: ${video.duration}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => {
                        const newVideos = [...courseData.videos];
                        newVideos.splice(index, 1);
                        setCourseData(prev => ({ ...prev, videos: newVideos }));
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Box mb={3}>
              <Button
                variant="contained"
                component="label"
                startIcon={<AttachFileIcon />}
              >
                Upload Resources
                <input
                  type="file"
                  hidden
                  multiple
                  onChange={handleResourceUpload}
                />
              </Button>
            </Box>
            
            <List>
              {courseData.resources.map((resource, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={resource.title}
                    secondary={`Type: ${resource.type}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => {
                        const newResources = [...courseData.resources];
                        newResources.splice(index, 1);
                        setCourseData(prev => ({ ...prev, resources: newResources }));
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Box mb={3}>
              <TextField
                fullWidth
                label="Quiz Title"
                value={currentQuiz.title}
                onChange={(e) => setCurrentQuiz(prev => ({ ...prev, title: e.target.value }))}
                sx={{ mb: 2 }}
              />
              
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={addQuestion}
                sx={{ mb: 2 }}
              >
                Add Question
              </Button>
            </Box>

            {currentQuiz.questions.map((question, qIndex) => (
              <Paper key={qIndex} sx={{ p: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  label="Question"
                  value={question.question}
                  onChange={(e) => handleQuizChange(qIndex, 'question', e.target.value)}
                  sx={{ mb: 2 }}
                />
                
                {question.options.map((option, oIndex) => (
                  <Box key={oIndex} sx={{ mb: 1 }}>
                    <TextField
                      fullWidth
                      label={`Option ${oIndex + 1}`}
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...question.options];
                        newOptions[oIndex] = e.target.value;
                        handleQuizChange(qIndex, 'options', newOptions);
                      }}
                    />
                  </Box>
                ))}
                
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Correct Answer</InputLabel>
                  <Select
                    value={question.correctAnswer}
                    onChange={(e) => handleQuizChange(qIndex, 'correctAnswer', e.target.value)}
                  >
                    {question.options.map((_, index) => (
                      <MenuItem key={index} value={index}>
                        Option {index + 1}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Paper>
            ))}

            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={saveQuiz}
              disabled={!currentQuiz.title || currentQuiz.questions.length === 0}
            >
              Save Quiz
            </Button>

            <Box mt={3}>
              <Typography variant="h6" gutterBottom>
                Saved Quizzes
              </Typography>
              {courseData.quizzes.map((quiz, index) => (
                <Chip
                  key={index}
                  label={quiz.title}
                  onDelete={() => {
                    const newQuizzes = [...courseData.quizzes];
                    newQuizzes.splice(index, 1);
                    setCourseData(prev => ({ ...prev, quizzes: newQuizzes }));
                  }}
                  sx={{ m: 0.5 }}
                />
              ))}
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Create New Course
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Card>
        <CardContent>
          {renderStepContent(activeStep)}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                startIcon={<SaveIcon />}
              >
                Create Course
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
              >
                Next
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateCourse; 