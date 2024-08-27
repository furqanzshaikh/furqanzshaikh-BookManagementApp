import React, { useState } from 'react';
import { Box, Button, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/authSlice';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await axios.post('http://localhost:3000/api/login', {
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

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        mt: 10,
        width: '90%',
        maxWidth: 400,
        mx: 'auto',
        p: 4,
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: '#ffffff',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
      <TextField
        type="email"
        required
        fullWidth
        label="Email"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        required
        fullWidth
        type={showPassword ? 'text' : 'password'}
        label="Password"
        variant="outlined"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ mb: 2 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleClickShowPassword}
                edge="end"
                aria-label="toggle password visibility"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        sx={{
          backgroundColor: '#000000',
          color: 'white',
          '&:hover': {
            backgroundColor: '#333333',
          },
          mb: 2
        }}
      >
        Login
      </Button>
      <Typography variant="body2">
        Don't have an account? <Link to="/register" style={{ textDecoration: 'none', color: '#1976d2' }}>Register</Link>
      </Typography>
    </Box>
  );
};

export default Login;
