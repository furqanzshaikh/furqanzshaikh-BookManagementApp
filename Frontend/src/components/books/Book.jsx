import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Checkbox,
  Popover,
  FormControlLabel,
  Avatar,
} from "@mui/material";
import Loader from "../loader/Loader";
import { Link } from "react-router-dom";

const Book = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    science_fiction: false,
    novel: false,
    thriller: false,
    motivational: false,
  });
  const [anchorEl, setAnchorEl] = useState(null);

  const sortOption = useSelector(state => state.auth.sortOption);
  const token = useSelector(state => state.auth.authToken); 
  useEffect(() => {
    fetchData();
  }, []); 

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/books", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the Bearer token in the Authorization header
        },
      });
      if (Array.isArray(response.data.allBooks)) {
        setData(response.data.allBooks);
        
      } else {
        console.error("Data is not an array:", response.data);
       
        setData([]); // Set to an empty array if the data format is not as expected
      }
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
      console.error("Error fetching data:", error);
     
    }
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: checked,
    }));
  };

  const handleButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const filteredBooks = Array.isArray(data) ? data.filter((book) => {
    if (
      !filters.novel &&
      !filters.science_fiction &&
      !filters.thriller &&
      !filters.motivational
    ) {
      return true;
    }
    if (filters.novel && book.category === "Novel") {
      return true;
    }
    if (filters.science_fiction && book.category === "Science_Fiction") {
      return true;
    }
    if (filters.thriller && book.category === "Thriller") {
      return true;
    }
    if (filters.motivational && book.category === "Motivational") {
      return true;
    }
    return false;
  }) : [];

  const sortedBooks = Array.isArray(filteredBooks) ? [...filteredBooks].sort((a, b) => {
    if (sortOption === 'asc') {
      return a.release_year - b.release_year;
    } else if (sortOption === 'desc') {
      return b.release_year - a.release_year;
    }
    return 0;
  }) : [];

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Box>Error: {error.message}</Box>;
  }

  return (
    <Box p={3} bgcolor="#f9f7f3">
      <Box mb={2} sx={{ display: 'flex', justifyContent: 'start' }}>
        <Button onClick={handleButtonClick} sx={{color:'#000000'}}>Filters</Button>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <Box p={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.novel}
                  onChange={handleCheckboxChange}
                  name="novel"
                />
              }
              label="Novel"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.science_fiction}
                  onChange={handleCheckboxChange}
                  name="science_fiction"
                />
              }
              label="Science Fiction"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.thriller}
                  onChange={handleCheckboxChange}
                  name="thriller"
                />
              }
              label="Thriller"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.motivational}
                  onChange={handleCheckboxChange}
                  name="motivational"
                />
              }
              label="Motivational"
            />
          </Box>
        </Popover>
      </Box>
      <Grid container spacing={3}>
        {sortedBooks.length > 0 ? (
          sortedBooks.map((book) => (
            <Grid item key={book._id} xs={12} sm={6} md={4} lg={4}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  borderRadius: "8px",
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Avatar 
                    sx={{
                      width: '100%', 
                      height: { xs: '300px', sm: '400px', md: '500px' }, 
                      objectFit: 'contain',
                      borderRadius: 0,
                      margin: '1vw auto',
                    }} 
                    src={book.cover_photo} 
                    alt="book_cover" 
                    loading="lazy"
                  />
                  <Typography variant="h5" textAlign={'center'} component="p" gutterBottom>
                    {book.book_name}
                  </Typography>
                  <Typography variant="h6" textAlign={'center'} color="textSecondary" gutterBottom>
                    Author: {book.author}
                  </Typography>
                  <Typography variant="body1" textAlign={'center'} component="p" gutterBottom>
                    Year: {book.release_year}
                  </Typography>
                  <Typography variant="body1" textAlign={'center'} component="p" gutterBottom>
                    Category: {book.category}
                  </Typography>
                </CardContent>
                <Link style={{ width: '90%', margin: '0 auto', padding: '1rem' }} to={`/books/${book._id}`}>
                  <Button
                    variant="outlined"
                    color="inherit"
                    sx={{
                      width: "100%",
                      borderRadius: "0px",
                      backgroundColor: "#000000",
                      color: "white",
                      "&:hover": {
                        color: "black",
                      },
                    }}
                  >
                    Show
                  </Button>
                </Link>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="h6" color="textSecondary" textAlign="center" sx={{ width: '100%' }}>
            No books found matching the selected filters.
          </Typography>
        )}
      </Grid>
    </Box>
  );
};

export default Book;
