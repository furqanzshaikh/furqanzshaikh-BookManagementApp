import React, { useState, useEffect } from 'react';
import { Button, Grid, Card, CardContent, Typography, TextField, Box, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';
import {jwtDecode} from 'jwt-decode';

const MatchMaking = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [userId, setUserId] = useState(null);
  const token = useSelector(state => state.auth.authToken);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/all-books', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBooks(response.data.allBooks || []);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [token]);

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

  const handleRequestExchange = async (bookId) => {
    try {
      if (!userId) {
        throw new Error('User ID is not available');
      }

      await axios.post(`http://localhost:3000/api/create-request/${bookId}`, { bookListingId: bookId, requesterId: userId }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Exchange request sent successfully');
    } catch (error) {
      console.error('Error sending exchange request:', error.response?.data || error.message);
      alert('Error sending exchange request. Please try again later.');
    }
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ padding: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h4" mb={3} textAlign="center" fontWeight="bold">
        All Books
      </Typography>
      
      <Box mb={3} display="flex" justifyContent="center">
        <TextField
          label="Search Books"
          variant="outlined"
          fullWidth
          sx={{ maxWidth: 600 }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>
      
      <Grid container spacing={3}>
        {filteredBooks.length > 0 ? (
          filteredBooks.map(book => (
            <Grid item xs={12} sm={6} md={4} key={book.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 3 }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {book.title}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    Author: {book.author}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Category: {book.category}
                  </Typography>
                </CardContent>
                <Box sx={{ textAlign: 'center', padding: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleRequestExchange(book.id)}
                  >
                    Request Exchange
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="h6" color="textSecondary" textAlign="center" sx={{ width: '100%' }}>
            No books found
          </Typography>
        )}
      </Grid>
    </Box>
  );
};

export default MatchMaking;
