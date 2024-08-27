import React, { useState, useEffect } from 'react';
import { Button, Grid, Paper, TextField, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addBook } from '../../redux/bookSlice';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';

// Validation schema
const schema = yup.object().shape({
  title: yup.string().trim().required('Title is required'),
  author: yup.string().trim().required('Author is required'),
  releaseYear: yup.string().matches(/^\d{4}$/, 'Invalid Release Year').required('Release Year is required'),
  category: yup.string().trim().required('Category is required'),
  imgUrl: yup.string().optional(),
});

const AddBook = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector(state => state.auth.authToken);
  const [userId, setUserId] = useState('');

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      author: '',
      releaseYear: '',
      category: '',
      imgUrl: ''
    }
  });

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.id);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, [token]);

  const onSubmit = async (data) => {
    const newBook = {
      ...data,
      userId,
    };

    try {
      const response = await axios.post('http://localhost:3000/api/add-book', newBook, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.status === 201) {
        console.log('Book added successfully');
        navigate('/books');
        dispatch(addBook(newBook));
        reset();
      } else {
        throw new Error('Failed to add book');
      }
    } catch (error) {
      console.error('Error adding book:', error.message);
    }
  };

  return (
    <Grid mt={3} mb={4} container justifyContent="center" spacing={2}>
      <Grid item xs={12} md={10} xl={8}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant="h3" mb={2} gutterBottom>
            Add New Book
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Book Name"
                  fullWidth
                  margin="normal"
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
              )}
            />
            <Controller
              name="author"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Author"
                  fullWidth
                  margin="normal"
                  error={!!errors.author}
                  helperText={errors.author?.message}
                />
              )}
            />
            <Controller
              name="releaseYear"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Release Year"
                  fullWidth
                  margin="normal"
                  error={!!errors.releaseYear}
                  helperText={errors.releaseYear?.message}
                />
              )}
            />
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Category"
                  fullWidth
                  margin="normal"
                  error={!!errors.category}
                  helperText={errors.category?.message}
                />
              )}
            />
            <Controller
              name="imgUrl"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Cover Photo URL"
                  fullWidth
                  margin="normal"
                  error={!!errors.imgUrl}
                  helperText={errors.imgUrl?.message}
                />
              )}
            />
            <Button
              type="submit"
              variant="outlined"
              sx={{
                width: "100%",
                borderRadius: "7px",
                padding: '1vw 2vw',
                margin: '20px 0 0 0',
                backgroundColor: "#000000",
                color: "white",
                "&:hover": {
                  color: "black",
                },
              }}
              color="inherit"
              fullWidth
            >
              Add Book
            </Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default AddBook;
