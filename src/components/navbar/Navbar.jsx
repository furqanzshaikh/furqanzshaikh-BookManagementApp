import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, setSortOption } from '../../redux/authSlice'; // Import setSortOption action
import MenuIcon from '@mui/icons-material/Menu';

const NavBar = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const [sortAnchorEl, setSortAnchorEl] = useState(null); // State for sort dropdown
  const [drawerOpen, setDrawerOpen] = useState(false); // State for drawer

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleSortMenuOpen = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortMenuClose = () => {
    setSortAnchorEl(null);
  };

  const handleSortOption = (option) => {
    dispatch(setSortOption(option)); // Dispatch setSortOption action with the selected option
    handleSortMenuClose();
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#ffffff' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Logo */}
          <Link to={'/books'} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography variant="h6" component="div">
              Logo
            </Typography>
          </Link>
          
          {/* Hamburger Icon */}
       
        </Box>
        <IconButton
            color="inherit"
            onClick={() => setDrawerOpen(true)}
            sx={{ display: { xs: 'block', sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        {/* Links */}
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: '1rem' }}>
          <Link to='/addbook' style={{ textDecoration: 'none', color: 'inherit' }}>
            <Button color='inherit' sx={{ color: 'white', backgroundColor: '#000000', '&:hover': { color: 'black', backgroundColor: 'white' } }} variant="outlined">
              Add Book
            </Button>
          </Link>
          
          {/* Sort dropdown */}
          <Button color='inherit' sx={{ color: 'white', backgroundColor: '#000000', '&:hover': { color: 'black', backgroundColor: 'white' } }} onClick={handleSortMenuOpen} variant="outlined">
            Sort by Year
          </Button>
          <Menu
            anchorEl={sortAnchorEl}
            open={Boolean(sortAnchorEl)}
            onClose={handleSortMenuClose}
          >
            <MenuItem onClick={() => handleSortOption('asc')}>Ascending</MenuItem>
            <MenuItem onClick={() => handleSortOption('desc')}>Descending</MenuItem>
          </Menu>
          
          {/* Authentication buttons */}
          {isAuthenticated ? 
            <Button onClick={handleLogout}  sx={{ color: 'white', backgroundColor: '#000000', '&:hover': { color: 'black', backgroundColor: 'white' } }} variant='contained'>Logout</Button>
            :             
            <Link to={'/'}>
              <Button sx={{ color: 'white', backgroundColor: '#000000', '&:hover': { color: 'black', backgroundColor: 'white' } }} variant='contained'>Login</Button>
            </Link>
          }
        </Box>

        {/* Responsive Drawer */}
        <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerClose}>
          <List>
            <ListItem component={Link} to="/books" onClick={handleDrawerClose}>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem component={Link} to="/addbook" onClick={handleDrawerClose}>
              <ListItemText primary="Add Book" />
            </ListItem>
            {isAuthenticated ?
              <ListItem onClick={handleLogout}>
                <ListItemText primary="Logout" />
              </ListItem>
              :
              <ListItem component={Link} to="/" onClick={handleDrawerClose}>
                <ListItemText primary="Login" />
              </ListItem>
            }
          </List>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
