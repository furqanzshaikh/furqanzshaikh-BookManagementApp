import React, { useState } from 'react';
import { Button, Grid, Paper, Input, Typography } from '@mui/material';
import { useDispatch } from 'react-redux'; // Importing useDispatch hook
import { addBook } from '../../redux/bookSlice'; // Importing the addBook action
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AddBook = () => {
  const dispatch = useDispatch(); // Initializing useDispatch hook
  const [book_name, setBook_name] = useState('');
  const [author, setAuthor] = useState('');
  const [chapterName, setChapterName] = useState('');
  const [chapterPages, setChapterPages] = useState('');
  const [category, setCategory] = useState('');
  const [release_year, setRelease_year] = useState('');
  const [coverPhoto, setCoverPhoto] = useState('');
  const navigate = useNavigate();
  const token = useSelector(state => state.auth.authToken); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newBook = {
      book_name,
      author,
      release_year,
      category,
      cover_photo: coverPhoto,
    };

    try {
      const response = await fetch('http://localhost:3000/books/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newBook),
      });

      if (!response.ok) {
        throw new Error('Failed to add book');
      }

      // Book added successfully
      console.log('Book added successfully');
      navigate('/books');

      // Dispatching the addBook action with the new book data
      dispatch(addBook(newBook));

      // Clearing input fields after successful submission
      setBook_name('');
      setAuthor('');
      setRelease_year('');
      setCategory('');
      setCoverPhoto('');
    } catch (error) {
      console.error('Error adding book:', error.message);
      // Handle error here
    }
  };

  return (
    <Grid mt={3} mb={4}  container justifyContent="center" spacing={2}>
      <Grid item xs={12} md={10} xl={8} >
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant="h3" mb={2} gutterBottom>
            Add New Book
          </Typography>
          <form onSubmit={handleSubmit}>
            <Input
              placeholder="Book Name"
              fullWidth
              value={book_name}
              onChange={(e) => setBook_name(e.target.value)}
              style={{ marginBottom: '15px' }}
            />
            <Input
              placeholder="Author"
              fullWidth
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              style={{ marginBottom: '15px' }}
            />
            <Input
              placeholder="Release Year"
              fullWidth
              value={release_year}
              onChange={(e) => setRelease_year(e.target.value)}
              style={{ marginBottom: '15px' }}
            />
            <Input
              placeholder="Category"
              fullWidth
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ marginBottom: '15px' }}
            />
 
            <Input
              placeholder="Cover Photo URL"
              fullWidth
              value={coverPhoto}
              onChange={(e) => setCoverPhoto(e.target.value)}
              style={{ marginBottom: '15px' }}
            />
            <Button  type="submit" variant="outlined" sx={{
                      width: "100%",
                      borderRadius: "7px",
                      padding:'1vw 2vw',
                      margin:'20px 0 0 0',
                      backgroundColor: "#000000",
                      color: "white", // Set text color to white
                      "&:hover": {
                        color: "black", // Set text color to black on hover
                      },
                    }} color="inherit" fullWidth>
              Add Book
            </Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default AddBook;
