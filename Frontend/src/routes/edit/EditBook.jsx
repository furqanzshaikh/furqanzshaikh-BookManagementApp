import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, TextField, Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { updateBook } from '../../redux/bookSlice';
import Loader from '../../components/loader/Loader';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// Validation schema
const schema = yup.object().shape({
  title: yup.string().trim().required('Title is required'),
  author: yup.string().trim().required('Author is required'),
  releaseYear: yup.string().matches(/^\d{4}$/, 'Release Year must be a 4-digit number').required('Release Year is required'),
  category: yup.string().trim().required('Category is required'),
  imgUrl: yup.string().optional(),
});

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.authToken);

  const {
    control,
    handleSubmit,
    setValue,
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

  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/get-book/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { singleBook } = response.data;
        setBook(singleBook);
        setValue('title', singleBook.title);
        setValue('author', singleBook.author);
        setValue('releaseYear', singleBook.releaseYear.toString());
        setValue('category', singleBook.category);
        setValue('imgUrl', singleBook.imgUrl || '');
      } catch (error) {
        console.error('Error fetching book:', error);
      }
    };

    fetchBook();
  }, [id, token, setValue]);

  const onSubmit = async (data) => {
    const updatedBook = {
      ...data,
      releaseYear: data.releaseYear.trim(), // Ensure no extra spaces
    };

    try {
      await axios.patch(`http://localhost:3000/api/edit-book/${id}`, updatedBook, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      dispatch(updateBook({ id, ...updatedBook }));
      navigate('/books');
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  if (!book) return <Loader />;

  return (
    <Box sx={{ maxWidth: 800, margin: '2vw auto', padding: 2 }}>
      <Typography variant='h3' mb={2}>Edit Book</Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
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
            width: '100%',
            borderRadius: '7px',
            padding: '12px 24px',
            margin: '20px 0 0 0',
            backgroundColor: '#000000',
            color: 'white',
            '&:hover': {
              backgroundColor: 'gray',
            },
          }} 
          color="inherit" 
          fullWidth>
          Update Book
        </Button>
      </Box>
    </Box>
  );
};

export default EditBook;
