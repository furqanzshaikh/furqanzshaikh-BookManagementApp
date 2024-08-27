import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Button, CardMedia } from '@mui/material';
import Loader from '../../components/loader/Loader';
import { useSelector } from 'react-redux';

const SingleBook = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const navigate = useNavigate();
  const token = useSelector(state => state.auth.authToken);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        // Fetch the current book details
        const response = await axios.get(`http://localhost:3000/api/get-book/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const fetchedBook = response.data.singleBook;
        setBook(fetchedBook);

        // Fetch related books based on the book's category
        const relatedResponse = await axios.get(`http://localhost:3000/api/related-books`, {
          params: { category: fetchedBook.category },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Filter out the current book based on title
        const filteredRelatedBooks = relatedResponse.data.relatedBooks.filter(relatedBook => relatedBook.title !== fetchedBook.title);
        setRelatedBooks(filteredRelatedBooks);

      } catch (error) {
        console.error('Error fetching book or related books:', error);
      }
    };

    fetchBook();
  }, [id, token]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/delete-book/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });

      setBook(null);
      alert(`Deleted book ${book.title} successfully`);
      navigate('/books');
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  return (
    <Box p={3} mb={2} textAlign="center" bgcolor="#f9f7f3">
      {book ? (
        <Card variant="outlined" sx={{ maxWidth: 600, margin: 'auto', padding: 3 }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {book.title}
            </Typography>
            <Typography variant="subtitle1" paragraph>
              Author: {book.author}
            </Typography>
            <Typography variant="subtitle1" paragraph>
              Category: {book.category}
            </Typography>
            <Typography variant="subtitle1" paragraph>
              Release: {new Date(book.releaseYear).getFullYear()}
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
                  color: "white",
                  "&:hover": {
                    color: "black",
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
                  color: "white",
                  "&:hover": {
                    backgroundColor: 'red',
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

      {/* Related Books Section */}
      <Box mt={4}>
        <Typography variant="h5" mb={2}>
          Related Books
        </Typography>
        {relatedBooks && relatedBooks.length > 0 ? (
          relatedBooks.map((relatedBook) => (
            <Card key={relatedBook.id} sx={{ mb: 2, maxWidth: 600, margin: 'auto' }}>
              <CardMedia
                component="img"
                height="140"
                image={relatedBook.imgUrl || 'default-image-url'}
                alt={relatedBook.title}
              />
              <CardContent>
                <Typography variant="h6">{relatedBook.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  By {relatedBook.author}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Category: {relatedBook.category}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 1 }}
                  component={Link}
                  to={`/books/${relatedBook.id}`}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography>No related books found</Typography>
        )}
      </Box>
    </Box>
  );
};

export default SingleBook;
