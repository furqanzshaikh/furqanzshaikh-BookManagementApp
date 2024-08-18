import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Input, Box, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { updateBook } from '../../redux/bookSlice';
import Loader from '../loader/Loader';
import axios from 'axios';
import { useSelector } from 'react-redux';

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [book, setBook] = useState(null);
  const [author, setAuthor] = useState('');
  const [cover, setCover] = useState('');
  const [bookName, setBookName] = useState('');
  const [year, setYear] = useState('');
  const [category, setCategory] = useState('');
  const token = useSelector(state => state.auth.authToken); 
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/books/${id}`,{
      
        }
          
        );
        console.log('hello from',response.data.singleBook)
        setBook(response.data);
        setAuthor(response.data.singleBook.author);
        setCover(response.data.singleBook.cover_photo);
        setBookName(response.data.singleBook.book_name);
        setYear(response.data.singleBook.release_year);
        setCategory(response.data.singleBook.category);
      } catch (error) {
        console.error('Error fetching book:', error);
      }
    };

    fetchBook();

    return () => {
      // Cleanup code if needed
    };
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedBook = {
      book_name: bookName,
      author: author,
      release_year: year,
      category: category,
      cover_photo: cover
    };

    try {
      // Making the PUT request to update the book data
      await axios.put(`http://localhost:3000/books/edit/${id}`, updatedBook,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Dispatching the updateBook action with the updated book data
      dispatch(updateBook({ id, ...updatedBook }));
  
      // Navigate to the homepage after updating the book
      navigate('/books');
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  if (!book) return <Loader />;

  return (
    <Box sx={{ maxWidth: 800, margin: '2vw auto', padding: 2 }}>
      <Typography variant='h3' mb={2}>Edit Book</Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Input
          name="book_name"
          placeholder="Book Name"
          fullWidth
          value={bookName}
          onChange={(e) => setBookName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Input
          name="author"
          placeholder="Author"
          fullWidth
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Input
          name="release_year"
          placeholder="Release Year"
          fullWidth
          value={year}
          onChange={(e) => setYear(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Input
          name="category"
          placeholder="Category"
          fullWidth
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Input
          name="cover_photo"
          placeholder="Cover Photo URL"
          fullWidth
          value={cover}
          onChange={(e) => setCover(e.target.value)}
          sx={{ mb: 2 }}
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
