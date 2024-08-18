const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    book_name: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    release_year: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    cover_photo:{
        type: String,
       
    }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
