import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux'; // Import useSelector to read from Redux state
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
    // Add more categories as needed
  });
  const [anchorEl, setAnchorEl] = useState(null);

  const sortOption = useSelector(state => state.auth.sortOption); // Read sorting option from Redux state

  useEffect(() => {
    fetchData();
  }, []); 

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://todo-server-9bjp.onrender.com/books"
      );
      setData(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
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

  const filteredBooks = data.filter((book) => {
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
  });


  const sortedBooks = [...filteredBooks]; // Create a copy of filteredBooks array
  if (sortOption === 'asc') {
    sortedBooks.sort((a, b) => a.release_year - b.release_year);
  } else if (sortOption === 'desc') {
    sortedBooks.sort((a, b) => b.release_year - a.release_year);
  }

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Box>Error: {error.message}</Box>;
  }

  return (
    <Box p={3} bgcolor="#f9f7f3"> {/* Changed bgcolor to #f9f7f3 */}
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
        {sortedBooks.map((book) => (
          <Grid item key={book.id} xs={12} sm={6} md={4} lg={4}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Add shadow for depth
                borderRadius: "8px", // Add border radius for rounded corners
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
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
              <Link style={{ width: '90%', margin: '0 auto', padding: '1rem' }} to={`/books/${book.id}`}>
                <Button
                  variant="outlined"
                  color="inherit"
                  sx={{
                    width: "100%",
                    borderRadius: "0px",
                    backgroundColor: "#000000",
                    color: "white", // Set text color to white
                    "&:hover": {
                      color: "black", // Set text color to black on hover
                    },
                  }}
                >
                  Show
                </Button>
              </Link>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Book;
