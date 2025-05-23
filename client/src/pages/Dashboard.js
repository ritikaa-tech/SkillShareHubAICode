import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
} from '@mui/material';

const Dashboard = () => {
  const [skills, setSkills] = useState([]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        
        {/* Skills Section */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            My Skills
          </Typography>
          <Grid container spacing={3}>
            {skills.length === 0 ? (
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary">
                      No skills added yet. Add your first skill!
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mt: 2 }}
                    >
                      Add Skill
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ) : (
              skills.map((skill) => (
                <Grid item xs={12} sm={6} md={4} key={skill._id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{skill.name}</Typography>
                      <Typography color="textSecondary">
                        Level: {skill.level}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard; 