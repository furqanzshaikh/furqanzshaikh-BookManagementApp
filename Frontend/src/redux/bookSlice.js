// bookSlice.js
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';


const getAllBooks = async ()=>{
const response = await axios.get('https://todo-server-9bjp.onrender.com/books')
const Books = response.data
console.log(Books) 
}
getAllBooks()

const initialState = {
  books: []
};

const bookSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    addBook(state, action) {
      state.books.push(action.payload);
    },
    removeBook(state, action) {
      state.books = state.books.filter(book => book.id !== action.payload);
    },
    updateBook(state, action) {
      const { id, updatedBook } = action.payload;
      const index = state.books.findIndex(book => book.id === id);
      if (index !== -1) {
        state.books[index] = updatedBook;
      }
    }
  }
});

export const { addBook, removeBook, updateBook } = bookSlice.actions;
export default bookSlice.reducer;
