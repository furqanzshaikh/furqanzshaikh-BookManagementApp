import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import Loader from '../loader/Loader';

const SingleBook = () => {
  const { id } = useParams(); // Get the id parameter from the URL
  const [book, setBook] = useState(null);
  const navigate = useNavigate();

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

    // Cleanup function
    return () => {
      // Cleanup code if needed
    };
  }, [id]); // Add id as a dependency to re-fetch data when id changes

  // Function to delete a book
  const handleDelete = async (bookId) => {
    try {
      await axios.delete(`https://todo-server-9bjp.onrender.com/books/${bookId}`);
      setBook(null); // Clear the book state after deletion
      alert(`Deleted book ${bookId} successfully`);
      navigate('/books');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box p={3} mb={2}  textAlign="center" bgcolor="#f9f7f3">
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
            <Typography variant="subtitle1" paragraph>
              Number of Chapters: {book.no_of_chapters}
            </Typography>

            <Box textAlign="center" mt={2} >
              <Button
                component={Link}
                to={`/books/${id}/edit`}
                variant="outlined" sx={{
                  width: "30%",
                  borderRadius: "0px",
                  backgroundColor: "#000000",
                  color: "white", // Set text color to white
                  "&:hover": {
                    color: "black", // Set text color to black on hover
                  },
                }} color="inherit"
                >
                Edit
              </Button>
              <Button
              onClick={()=>handleDelete(book.id)}
              variant="outlined" sx={{
                width: "30%",
                borderRadius: "0px",
                backgroundColor: "#000000",
                color: "white", // Set text color to white
                "&:hover": {
                  backgroundColor:'red' // Set text color to black on hover
                },
              }} color="inherit">
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
