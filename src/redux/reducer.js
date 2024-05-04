import { combineReducers } from '@reduxjs/toolkit';
import bookReducer from '../redux/bookSlice';
import authReducer from '../redux/authSlice';

const rootReducer = combineReducers({
  books: bookReducer,
  auth: authReducer 
});

export default rootReducer;