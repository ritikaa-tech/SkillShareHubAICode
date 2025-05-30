import React from 'react';
import { Box, Typography } from '@mui/material';

const VideoPlayer = ({ url, title }) => {
  // Check if it's a YouTube URL
  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
  
  // Convert YouTube URL to embed URL if needed
  const getEmbedUrl = (url) => {
    if (url.includes('youtube.com/watch')) {
      return url.replace('watch?v=', 'embed/');
    } else if (url.includes('youtu.be')) {
      return url.replace('youtu.be/', 'youtube.com/embed/');
    }
    return url;
  };

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {isYouTube ? (
        <iframe
          width="100%"
          height="315"
          src={getEmbedUrl(url)}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <video
          width="100%"
          height="315"
          controls
          src={url}
          title={title}
        >
          Your browser does not support the video tag.
        </video>
      )}
    </Box>
  );
};

export default VideoPlayer; 