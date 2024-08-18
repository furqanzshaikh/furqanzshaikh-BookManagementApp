
import { createSlice } from '@reduxjs/toolkit';
const initialAuthToken = localStorage.getItem('authToken');

const initialState = {
  isAuthenticated: !!initialAuthToken, // Check if the token exists
  authToken: initialAuthToken, // Store the token
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.authToken = action.payload.authToken; 
      localStorage.setItem('authToken', action.payload.authToken); 
    },
    logout(state) {
      state.isAuthenticated = false;
      state.authToken = null;
      localStorage.removeItem('authToken'); 
    },
    setSortOption: (state, action) => { 
      state.sortOption = action.payload;
    },
  },
});

export const { login, logout ,setSortOption} = authSlice.actions;
export default authSlice.reducer;
