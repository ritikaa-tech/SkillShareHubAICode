<Container maxWidth="sm" className="register-container">
  <Box>
    <Paper elevation={3} className="register-paper">
      <Typography variant="h4" component="h1" className="register-title">
        Register
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit} className="register-form">
        {/* All TextFields and Button stay the same */}
      </form>
    </Paper>
  </Box>
</Container>
