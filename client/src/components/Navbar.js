import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  AccountCircle,
  Menu as MenuIcon,
  School as SchoolIcon,
  Dashboard as DashboardIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'admin':
        return '/admin';
      case 'instructor':
        return '/instructor/dashboard';
      default:
        return '/dashboard';
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <SchoolIcon />
          SkillshareHub
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Courses link - visible to everyone */}
          <Button
            color="inherit"
            component={RouterLink}
            to="/courses"
            startIcon={<SchoolIcon />}
            sx={{
              backgroundColor: location.pathname === '/courses' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            }}
          >
            Courses
          </Button>

          {user ? (
            <>
              {/* Dashboard link - visible to logged-in users */}
              <Button
                color="inherit"
                component={RouterLink}
                to={getDashboardPath()}
                startIcon={<DashboardIcon />}
                sx={{
                  backgroundColor: location.pathname === getDashboardPath() ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                }}
              >
                {user.role === 'admin' ? 'Admin Dashboard' :
                 user.role === 'instructor' ? 'Instructor Dashboard' :
                 'My Dashboard'}
              </Button>

              {/* User menu */}
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              {/* Login/Register buttons - visible to non-logged-in users */}
              <Button
                color="inherit"
                component={RouterLink}
                to="/login"
                sx={{
                  backgroundColor: location.pathname === '/login' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                }}
              >
                Login
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/register"
                sx={{
                  backgroundColor: location.pathname === '/register' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                }}
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 