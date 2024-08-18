import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import Loader from '../loader/Loader';
import { useSelector } from 'react-redux';

const SingleBook = () => {
  const { id } = useParams(); 
  const [book, setBook] = useState(null);
  const navigate = useNavigate();
  const token = useSelector(state => state.auth.authToken); 
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/books/${id}`,{
         
        });
        setBook(response.data.singleBook);
      } catch (error) {
        console.error('Error fetching book:', error);
      }
    };

    fetchBook();
  }, [id]); // Add id as a dependency to re-fetch data when id changes

  useEffect(() => {
    if (book) {
      console.log(book);
    }
  }, [book]); // Log book data after it has been fetched and set

  // Function to delete a book
  const handleDelete = async () => { // No need to pass bookId, we can use id directly from useParams
    console.log(id)
    try {
      await axios.delete(`http://localhost:3000/books/delete/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`
      },
      });
      
      setBook(null); // Clear the book state after deletion
      alert(`Deleted book ${book.book_name} successfully`);
      navigate('/books'); // Navigate to books list after deletion
    } catch (error) {
      console.log('Error deleting book:', error);
    }
  };

  return (
    <Box p={3} mb={2} textAlign="center" bgcolor="#f9f7f3">
      {book ? (
        <Card variant="outlined" sx={{ maxWidth: 600, margin: 'auto', padding: 3 }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {book.book_name}
            </Typography>
            <Typography variant="subtitle1" paragraph>
              Author: {book.author}
            </Typography>
            <Typography variant="subtitle1" paragraph>
              Category: {book.category}
            </Typography>
            <Typography variant="subtitle1" paragraph>
              Release: {book.release_year}
            </Typography>

            <Box textAlign="center" mt={2}>
              <Button
                component={Link}
                to={`/books/edit/${id}`}
                variant="outlined"
                sx={{
                  width: "30%",
                  borderRadius: "0px",
                  backgroundColor: "#000000",
                  color: "white", // Set text color to white
                  "&:hover": {
                    color: "black", // Set text color to black on hover
                  },
                }}
                color="inherit"
              >
                Edit
              </Button>
              <Button
                onClick={handleDelete}
                variant="outlined"
                sx={{
                  width: "30%",
                  borderRadius: "0px",
                  backgroundColor: "#000000",
                  color: "white", // Set text color to white
                  "&:hover": {
                    backgroundColor: 'red' // Set background color to red on hover
                  },
                }}
                color="inherit"
              >
                Delete
              </Button>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Loader />
      )}
    </Box>
  );
};

export default SingleBook;
