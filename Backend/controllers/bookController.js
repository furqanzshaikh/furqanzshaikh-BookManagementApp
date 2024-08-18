const Book = require("../models/bookSchema.js");

const test = (req, res) => {
  res.status(200).json({
    message: "Server is running",
    success: true,
  });
};

const getAllBooks = async (req, res) => {
  try {
    const allBooks = await Book.find({});
    res.status(200).json({allBooks, success: true,message:"All Books Fetched "});
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching books",
        success: false,
        error: error.message,
      });
  }
};

const getSingleBook = async (req, res) => {
  try {
    const { id } = req.params;
    const singleBook = await Book.findById(id);
    if (!singleBook) {
      return res
        .status(404)
        .json({ message: "Book not found", success: false });
    }
    res.status(200).json({singleBook, success: true,message:"Book fetched"});
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching the book",
        success: false,
        error: error.message,
      });
  }
};

const addBook = async (req, res) => {
  try {
    const { book_name, author, release_year, category, cover_photo } = req.body;
    const createBook = await Book.create({
      book_name,
      author,
      release_year,
      category,
      cover_photo,
    });
    res.status(201).json({createBook, success: true,message:"Book Added"});
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error adding the book",
        success: false,
        error: error.message,
      });
  }
};

const removeBook = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteBook = await Book.findByIdAndDelete(id);
    if (!deleteBook) {
      return res
        .status(404)
        .json({ message: "Book not found", success: false });
    }
    res.status(200).json({deleteBook, success: true,message:"Book Removed"});
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error deleting the book",
        success: false,
        error: error.message,
      });
  }
};

const editBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { book_name, author, release_year, category, cover_photo } = req.body;
    const updateBook = await Book.findByIdAndUpdate(
      id,
      { book_name, author, release_year, category, cover_photo },
      { new: true }
    );
    if (!updateBook) {
      return res
        .status(404)
        .json({ message: "Book not found", success: false });
    }
    res.status(200).json({updateBook, success: true,message:"Book Updated"});
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error updating the book",
        success: false,
        error: error.message,
      });
  }
};

module.exports = {
  test,
  getAllBooks,
  addBook,
  removeBook,
  editBook,
  getSingleBook,
};
