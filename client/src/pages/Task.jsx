import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import VideoPlayer from '../components/VideoPlayer';

const TaskPage = ({quizzes,  videos, resources, title, description }) => {
  const { id } = useParams(); // Course ID from route
  const { token } = useAuth(); // Auth context
  //const [course, setCourse] = useState(null);

  

  //if (!course) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        {description}
      </Typography>

  
      {/* Videos */}
        <Card sx={{ my: 3 }}>
        <CardContent>
            <Typography variant="h6" gutterBottom>Videos</Typography>
            {videos.length === 0 ? (
            <Typography>No videos added yet.</Typography>
            ) : (
            <List>
                {videos.map((video) =>{
                    const embedUrl = video.url.replace("watch?v=", "embed/");
                  return (
                 
                <React.Fragment key={video._id}>
                    <ListItem alignItems="flex-start" sx={{ flexDirection: 'column', alignItems: 'start' }}>
                    <VideoPlayer url={video.url} title={video.title} />
                    
                    </ListItem>
                    <Divider />
                </React.Fragment>
                )})}
            </List>
            )}
        </CardContent>
        </Card>


      {/* Resources */}
      <Card sx={{ my: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Resources</Typography>
          {resources.length === 0 ? (
            <Typography>No resources added yet.</Typography>
          ) : (
            <List>
              {resources.map((res) => (
                <React.Fragment key={res._id}>
                  <ListItem>
                    <ListItemText
                      primary={res.name}
                      secondary={res.link}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Quizzes */}
      <Card sx={{ my: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Quizzes</Typography>
          {quizzes.length === 0 ? (
            <Typography>No quizzes added yet.</Typography>
          ) : (
             quizzes.map((quiz) => (
              <Card key={quiz._id} sx={{ my: 2, p: 2 }}>
                <Typography variant="subtitle1"><strong>Q:</strong> {quiz.question}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Options:</strong> {quiz.options.join(', ')}
                </Typography>
                <Typography variant="body2">
                  <strong>Answer:</strong> {quiz.answer}
                </Typography>
              </Card>
            ))
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default React.memo(TaskPage);
