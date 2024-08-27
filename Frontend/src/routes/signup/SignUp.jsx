// src/components/SignUp.js
import React, { useState } from 'react';
import { Box, Button, TextField, Typography, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/register', {
        email,
        password,
      });

      console.log('Sign-up successful:', response.data);
      navigate('/'); 
    } catch (error) {
      console.error('Sign-up failed:', error.response ? error.response.data : error.message);
      setError('Sign-up failed. Please try again.');
    }
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
        mt: 8,
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
        Sign Up
      </Typography>
      {error && <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>{error}</Typography>}
      <TextField
        required
        fullWidth
        type="email"
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
      <TextField
        required
        fullWidth
        type={showPassword ? 'text' : 'password'}
        label="Confirm Password"
        variant="outlined"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
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
          mt: 2,
        }}
      >
        Sign Up
      </Button>
      <Typography variant="body2" sx={{ mt: 2 }}>
        Already have an account?{' '}
        <Link to="/" style={{ textDecoration: 'none', color: '#1976d2' }}>
          Login
        </Link>
      </Typography>
    </Box>
  );
};

export default SignUp;
