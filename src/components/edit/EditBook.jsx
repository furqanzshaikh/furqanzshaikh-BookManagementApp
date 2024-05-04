import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Input, Box, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { updateBook } from '../../redux/bookSlice';
import Loader from '../loader/Loader';
import axios from 'axios';

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`https://todo-server-9bjp.onrender.com/books/${id}`);
        setBook(response.data);
      } catch (error) {
        console.error('Error fetching book:', error);
      }
    };

    fetchBook();

    return () => {
      // Cleanup code if needed
    };
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook(prevBook => ({
      ...prevBook,
      [name]: value
    }));
  };

  const handleChangeChapterName = (index, value) => {
    const updatedChapters = [...book.chapters];
    updatedChapters[index].name = value;
    setBook(prevBook => ({
      ...prevBook,
      chapters: updatedChapters
    }));
  };

  const handleChangeChapterPages = (index, value) => {
    const updatedChapters = [...book.chapters];
    updatedChapters[index].pages = value;
    setBook(prevBook => ({
      ...prevBook,
      chapters: updatedChapters
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Making the PUT request to update the book data
      await axios.put(`https://todo-server-9bjp.onrender.com/books/${id}`, book);
      
      // Dispatching the updateBook action with the updated book data
      dispatch(updateBook(id, book));
  
      // Navigate to the homepage after updating the book
      navigate('/books');
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  if (!book) return <Loader/>;

  return (
    <Box item xs={12} md={10} xl={8} sx={{ maxWidth: 800, margin: '2vw auto', padding: 2 }}>
      <Typography variant='h3' mb={2}>Edit Book</Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Input
          name="book_name"
          placeholder="Book Name"
          fullWidth
          value={book.book_name}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <Input
          name="author"
          placeholder="Author"
          fullWidth
          value={book.author}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <Input
          name="release_year"
          placeholder="Release Year"
          fullWidth
          value={book.release_year}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <Input
          name="category"
          placeholder="Category"
          fullWidth
          value={book.category}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        {book.chapters.map((chapter, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Input
              name={`chapterName${index}`}
              placeholder={`Chapter ${index + 1} Name`}
              fullWidth
              value={chapter.name}
              onChange={(e) => handleChangeChapterName(index, e.target.value)}
            />
            <Input
              name={`chapterPages${index}`}
              placeholder={`Chapter ${index + 1} Pages`}
              fullWidth
              value={chapter.pages}
              onChange={(e) => handleChangeChapterPages(index, e.target.value)}
              sx={{ mt: 2 }}
            />
          </Box>
        ))}

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
