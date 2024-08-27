import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Typography, Card, CardContent, Button } from '@mui/material';
import { useSelector } from 'react-redux';

const ViewRequests = () => {
  const [requests, setRequests] = useState([]);
  const token = useSelector(state => state.auth.authToken); 

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/exchange-requests/1', { // Replace 1 with actual user ID
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setRequests(response.data.requests);
      } catch (error) {
        console.error('Error fetching exchange requests:', error);
      }
    };

    fetchRequests();
  }, [token]);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        My Exchange Requests
      </Typography>
      {requests.map((request) => (
        <Card key={request.id} variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">
              Book: {request.bookListing.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Status: {request.status}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              // Add handler for accepting/rejecting requests
            >
              Accept
            </Button>
            <Button
              variant="contained"
              color="secondary"
              sx={{ mt: 2 }}
              // Add handler for accepting/rejecting requests
            >
              Reject
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ViewRequests;
