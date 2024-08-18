// src/components/Login.js
import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/authSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await axios.post('http://localhost:3000/login', {
        email,
        password,
      });

      console.log('Login successful:', response.data);
      localStorage.setItem('authToken', response.data.token);

      dispatch(login({ authToken: response.data.token }));

      navigate('/books');
    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data : error.message);
      setError('Invalid email or password.');
      setPassword('');
      setEmail('');
    }
  };

  return (
    <Box
      component="form"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        mt: 10,
      }}
      onSubmit={handleSubmit}
    >
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Box sx={{ width: '300px', marginBottom: '20px' }}>
        <TextField
          required
          fullWidth
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Box>
      <Box sx={{ width: '300px', marginBottom: '20px' }}>
        <TextField
          required
          fullWidth
          type="password"
          label="Password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Box>
      <Button 
        type="submit" 
        color='inherit'   
        sx={{ 
          color: 'white', 
          backgroundColor: '#000000',
          width: '23vw', 
          '&:hover': { 
            color: 'black', 
            backgroundColor: 'white' 
          } 
        }} 
        variant='outlined'
      >
        Login
      </Button>
    </Box>
  );
};

export default Login;
