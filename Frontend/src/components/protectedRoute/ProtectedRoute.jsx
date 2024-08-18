import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Import useSelector to access isAuthenticated state
import { Dialog, DialogActions, DialogContent, DialogContentText, Button } from '@mui/material';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated); // Get isAuthenticated from Redux state
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    // Check if token exists in local storage
    const token = localStorage.getItem('authToken');

    if (!token) {
      // If token does not exist, show alert dialog and redirect to login page
      setOpen(true);
      navigate('/'); // Redirect to login page
    }
  }, [navigate]);

  const handleClose = () => {
    setOpen(false);
    navigate('/');
  };

  // If user is authenticated, render the children components
  return isAuthenticated ? (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <DialogContentText>
            Please log in to access this page.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
      {children}
    </>
  ) : navigate('/'); 
};

export default ProtectedRoute;
