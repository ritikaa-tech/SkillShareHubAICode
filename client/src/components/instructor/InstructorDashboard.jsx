import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  LinearProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  AttachMoney as MoneyIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  VideoLibrary as VideoIcon,
  PictureAsPdf as PdfIcon,
  Quiz as QuizIcon,
  Assessment as AssessmentIcon,
  Download as DownloadIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../utils/api';

const InstructorDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [earnings, setEarnings] = useState({
    total: 0,
    monthly: 0,
    history: []
  });
  const [analytics, setAnalytics] = useState({
    totalStudents: 0,
    averageRating: 0,
    completionRate: 0,
    revenueByCourse: [],
    studentProgress: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openContentDialog, setOpenContentDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    level: 'beginner'
  });
  const [newContent, setNewContent] = useState({
    type: 'video',
    title: '',
    url: '',
    description: ''
  });
  const [editingContent, setEditingContent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInstructorData();
  }, []);

  const fetchInstructorData = async () => {
    try {
      setLoading(true);
      const [coursesRes, enrollmentsRes, earningsRes, analyticsRes] = await Promise.all([
        apiService.getCourses(),
        apiService.getEnrollments(),
        apiService.getProfile(),
        apiService.getProfile()
      ]);

      setCourses(coursesRes.data);
      setEnrollments(enrollmentsRes.data.enrollments || []);
      setEarnings({
        total: earningsRes.data.totalRevenue || 0,
        monthly: 0,
        history: []
      });
      setAnalytics({
        totalStudents: analyticsRes.data.totalStudents || 0,
        averageRating: 0,
        completionRate: 0,
        revenueByCourse: [],
        studentProgress: []
      });
      setError('');
    } catch (err) {
      console.error('Error fetching instructor data:', err);
      setError(err.message || 'Failed to fetch instructor data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewCourse({
      title: '',
      description: '',
      price: '',
      category: '',
      level: 'beginner'
    });
  };

  const handleCourseSubmit = async () => {
    try {
      const response = await apiService.createCourse(newCourse);
      setCourses([...courses, response.data]);
      handleCloseDialog();
      fetchInstructorData();
    } catch (err) {
      console.error('Error creating course:', err);
      setError(err.message || 'Failed to create course. Please try again later.');
    }
  };

  const handleEditCourse = (courseId) => {
    navigate(`/edit-course/${courseId}`);
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await apiService.deleteCourse(courseId);
        setCourses(courses.filter(course => course._id !== courseId));
      } catch (err) {
        console.error('Error deleting course:', err);
        setError(err.message || 'Failed to delete course. Please try again later.');
      }
    }
  };

  const handleAddContent = (course) => {
    setSelectedCourse(course);
    setOpenContentDialog(true);
  };

  const handleEditContent = (courseId, contentId) => {
    const course = courses.find(c => c._id === courseId);
    const content = course.content.find(c => c._id === contentId);
    if (content) {
      setEditingContent(content);
      setNewContent({
        type: content.type,
        title: content.title,
        url: content.url,
        description: content.description
      });
      setSelectedCourse(course);
      setOpenContentDialog(true);
    }
  };

  const handleDeleteContent = async (courseId, contentId) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        await apiService.deleteCourse(courseId);
        fetchInstructorData();
      } catch (err) {
        console.error('Error deleting content:', err);
        setError(err.message || 'Failed to delete content. Please try again later.');
      }
    }
  };

  const handleContentSubmit = async () => {
    try {
      if (!newContent.type || !newContent.title || !newContent.url || !newContent.description) {
        setError('All fields are required');
        return;
      }

      // For video content, validate YouTube URL
      if (newContent.type === 'video') {
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
        if (!youtubeRegex.test(newContent.url)) {
          setError('Please enter a valid YouTube URL');
          return;
        }
      }

      let response;
      if (editingContent) {
        response = await apiService.updateCourse(selectedCourse._id, {
          ...selectedCourse,
          content: selectedCourse.content.map(c => 
            c._id === editingContent._id ? newContent : c
          )
        });
      } else {
        response = await apiService.updateCourse(selectedCourse._id, {
          ...selectedCourse,
          content: [...selectedCourse.content, newContent]
        });
      }

      if (response.data) {
        setOpenContentDialog(false);
        setNewContent({
          type: 'video',
          title: '',
          url: '',
          description: ''
        });
        setEditingContent(null);
        fetchInstructorData();
      }
    } catch (err) {
      console.error('Error saving content:', err);
      setError(err.message || 'Failed to save content. Please try again later.');
    }
  };

  const handleExportAnalytics = async () => {
    try {
      const response = await apiService.getProfile();
      const blob = new Blob([JSON.stringify(response.data)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'course-analytics.json');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error exporting analytics:', err);
      setError(err.message || 'Failed to export analytics. Please try again later.');
    }
  };

  const renderCoursesTab = () => (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">My Courses</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateCourse}
        >
          Create New Course
        </Button>
      </Box>

      <Grid container spacing={3}>
        {courses.length === 0 ? (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography align="center" color="textSecondary">
                  No courses created yet. Click "Create New Course" to get started.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ) : (
          courses.map((course) => (
            <Grid item xs={12} md={6} lg={4} key={course._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {course.title}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {course.category} • {course.level}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {course.description.substring(0, 100)}...
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" color="primary">
                      ${course.price}
                    </Typography>
                    <Box>
                      <IconButton onClick={() => handleEditCourse(course._id)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteCourse(course._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  <Box mt={2}>
                    <Chip
                      icon={<PeopleIcon />}
                      label={`${course.enrolledStudents?.length || 0} students`}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      icon={<MoneyIcon />}
                      label={`$${course.price * (course.enrolledStudents?.length || 0)} earned`}
                      size="small"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Course</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Course Title"
              value={newCourse.title}
              onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={newCourse.description}
              onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
              margin="normal"
              multiline
              rows={4}
              required
            />
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={newCourse.price}
              onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              select
              label="Category"
              value={newCourse.category}
              onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
              margin="normal"
              required
            >
              <MenuItem value="programming">Programming</MenuItem>
              <MenuItem value="design">Design</MenuItem>
              <MenuItem value="business">Business</MenuItem>
              <MenuItem value="marketing">Marketing</MenuItem>
            </TextField>
            <TextField
              fullWidth
              select
              label="Level"
              value={newCourse.level}
              onChange={(e) => setNewCourse({ ...newCourse, level: e.target.value })}
              margin="normal"
              required
            >
              <MenuItem value="beginner">Beginner</MenuItem>
              <MenuItem value="intermediate">Intermediate</MenuItem>
              <MenuItem value="advanced">Advanced</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleCourseSubmit} variant="contained" color="primary">
            Create Course
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );

  const renderEnrollmentsTab = () => (
    <Box>
      <Typography variant="h5" gutterBottom>
        Student Enrollments
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Course</TableCell>
              <TableCell>Student</TableCell>
              <TableCell>Enrollment Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {enrollments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No enrollments found
                </TableCell>
              </TableRow>
            ) : (
              enrollments.map((enrollment) => (
                <TableRow key={enrollment._id}>
                  <TableCell>{enrollment.course.title}</TableCell>
                  <TableCell>{enrollment.student.name}</TableCell>
                  <TableCell>
                    {new Date(enrollment.enrolledAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={enrollment.status}
                      color={enrollment.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small">
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderEarningsTab = () => (
    <Box>
      <Typography variant="h5" gutterBottom>
        Earnings Overview
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Earnings
              </Typography>
              <Typography variant="h4">
                ${earnings?.total || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Monthly Earnings
              </Typography>
              <Typography variant="h4">
                ${earnings?.monthly || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom>
        Earnings History
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Course</TableCell>
              <TableCell>Student</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!earnings?.history || earnings.history.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No earnings history found
                </TableCell>
              </TableRow>
            ) : (
              earnings.history.map((earning) => (
                <TableRow key={earning._id}>
                  <TableCell>{earning?.course?.title || 'N/A'}</TableCell>
                  <TableCell>{earning?.student?.name || 'N/A'}</TableCell>
                  <TableCell>${earning?.amount || 0}</TableCell>
                  <TableCell>
                    {earning?.date ? new Date(earning.date).toLocaleDateString() : 'N/A'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderContentTab = () => (
    <Box>
      <Typography variant="h5" gutterBottom>
        Course Content Management
      </Typography>
      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid item xs={12} key={course._id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">{course.title}</Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleAddContent(course)}
                  >
                    Add Content
                  </Button>
                </Box>
                {course.content?.length === 0 ? (
                  <Typography color="textSecondary" align="center" sx={{ py: 2 }}>
                    No content added yet. Click "Add Content" to get started.
                  </Typography>
                ) : (
                  <List>
                    {course.content?.map((item, index) => (
                      <React.Fragment key={item._id || index}>
                        <ListItem
                          sx={{
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            py: 2
                          }}
                        >
                          <Box display="flex" width="100%" justifyContent="space-between" alignItems="center" mb={1}>
                            <Box display="flex" alignItems="center">
                              <ListItemIcon>
                                {item.type === 'video' ? <VideoIcon color="primary" /> :
                                 item.type === 'pdf' ? <PdfIcon color="error" /> :
                                 <QuizIcon color="secondary" />}
                              </ListItemIcon>
                              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                {item.title}
                              </Typography>
                            </Box>
                            <Box>
                              <IconButton 
                                size="small"
                                onClick={() => handleEditContent(course._id, item._id)}
                                sx={{ mr: 1 }}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton 
                                size="small"
                                onClick={() => handleDeleteContent(course._id, item._id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </Box>
                          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                            {item.description}
                          </Typography>
                          {item.type === 'video' && (
                            <Box mt={1} width="100%">
                              <iframe
                                width="100%"
                                height="315"
                                src={item.url.replace('watch?v=', 'embed/')}
                                title={item.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                style={{ maxWidth: '560px' }}
                              />
                            </Box>
                          )}
                          {item.type === 'pdf' && (
                            <Button
                              variant="outlined"
                              startIcon={<PdfIcon />}
                              href={item.url}
                              target="_blank"
                              sx={{ mt: 1 }}
                            >
                              View PDF
                            </Button>
                          )}
                          {item.type === 'quiz' && (
                            <Button
                              variant="outlined"
                              startIcon={<QuizIcon />}
                              sx={{ mt: 1 }}
                            >
                              View Quiz
                            </Button>
                          )}
                        </ListItem>
                        {index < course.content.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog 
        open={openContentDialog} 
        onClose={() => {
          setOpenContentDialog(false);
          setError('');
          setNewContent({
            type: 'video',
            title: '',
            url: '',
            description: ''
          });
          setEditingContent(null);
        }} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>
          {editingContent ? 'Edit Content' : 'Add Content'} to {selectedCourse?.title}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            fullWidth
            select
            label="Content Type"
            value={newContent.type}
            onChange={(e) => setNewContent({ ...newContent, type: e.target.value })}
            margin="normal"
            required
            error={!newContent.type}
            helperText={!newContent.type ? 'Content type is required' : ''}
          >
            <MenuItem value="video">Video</MenuItem>
            <MenuItem value="pdf">PDF</MenuItem>
            <MenuItem value="quiz">Quiz</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Title"
            value={newContent.title}
            onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
            margin="normal"
            required
            error={!newContent.title}
            helperText={!newContent.title ? 'Title is required' : ''}
          />
          <TextField
            fullWidth
            label={newContent.type === 'video' ? 'YouTube URL' : 'URL'}
            value={newContent.url}
            onChange={(e) => setNewContent({ ...newContent, url: e.target.value })}
            margin="normal"
            required
            error={!newContent.url}
            helperText={
              !newContent.url 
                ? 'URL is required' 
                : newContent.type === 'video' 
                  ? 'Enter a valid YouTube URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID)' 
                  : ''
            }
          />
          <TextField
            fullWidth
            label="Description"
            value={newContent.description}
            onChange={(e) => setNewContent({ ...newContent, description: e.target.value })}
            margin="normal"
            multiline
            rows={3}
            required
            error={!newContent.description}
            helperText={!newContent.description ? 'Description is required' : ''}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenContentDialog(false);
            setError('');
            setNewContent({
              type: 'video',
              title: '',
              url: '',
              description: ''
            });
            setEditingContent(null);
          }}>Cancel</Button>
          <Button onClick={handleContentSubmit} variant="contained" color="primary">
            {editingContent ? 'Update Content' : 'Add Content'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );

  const renderAnalyticsTab = () => (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Course Analytics</Typography>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleExportAnalytics}
        >
          Export Analytics
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Students
              </Typography>
              <Typography variant="h4">
                {analytics.totalStudents}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Rating
              </Typography>
              <Box display="flex" alignItems="center">
                <Typography variant="h4">
                  {analytics.averageRating.toFixed(1)}
                </Typography>
                <StarIcon color="warning" sx={{ ml: 1 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Completion Rate
              </Typography>
              <Typography variant="h4">
                {analytics.completionRate}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        Revenue by Course
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Course</TableCell>
              <TableCell>Enrollments</TableCell>
              <TableCell>Revenue</TableCell>
              <TableCell>Average Rating</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {analytics.revenueByCourse.map((course) => (
              <TableRow key={course._id}>
                <TableCell>{course.title}</TableCell>
                <TableCell>{course.enrollments}</TableCell>
                <TableCell>${course.revenue}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    {course.rating.toFixed(1)}
                    <StarIcon color="warning" sx={{ ml: 0.5, fontSize: '1rem' }} />
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        Student Progress
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Progress</TableCell>
              <TableCell>Last Activity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {analytics.studentProgress.map((progress) => (
              <TableRow key={progress._id}>
                <TableCell>{progress.student.name}</TableCell>
                <TableCell>{progress.course.title}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Box width="100%" mr={1}>
                      <LinearProgress variant="determinate" value={progress.percentage} />
                    </Box>
                    <Box minWidth={35}>
                      <Typography variant="body2" color="textSecondary">
                        {`${Math.round(progress.percentage)}%`}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  {new Date(progress.lastActivity).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Instructor Dashboard
      </Typography>

      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab icon={<SchoolIcon />} label="Courses" />
        <Tab icon={<PeopleIcon />} label="Enrollments" />
        <Tab icon={<MoneyIcon />} label="Earnings" />
        <Tab icon={<VideoIcon />} label="Content" />
        <Tab icon={<AssessmentIcon />} label="Analytics" />
      </Tabs>

      {activeTab === 0 && renderCoursesTab()}
      {activeTab === 1 && renderEnrollmentsTab()}
      {activeTab === 2 && renderEarningsTab()}
      {activeTab === 3 && renderContentTab()}
      {activeTab === 4 && renderAnalyticsTab()}
    </Box>
  );
};

export default InstructorDashboard; 