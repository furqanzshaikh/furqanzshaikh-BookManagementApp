const { PrismaClient } = require('@prisma/client');
const { body, param, validationResult,query } = require('express-validator');
const validator = require('validator');
const prisma = new PrismaClient();

const validateAddBook = [
  body('title').isString().trim().notEmpty().withMessage('Title is required'),
  body('author').isString().trim().notEmpty().withMessage('Author is required'),
  body('releaseYear').isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('Invalid release year'),
  body('category').isString().trim().notEmpty().withMessage('Category is required'),
  body('userId').isInt().withMessage('Invalid user ID'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation error',
        success: false,
        errors: errors.array(),
      });
    }
    next();
  },
];

const validateMatchmaking = [
  query('userId').isInt().withMessage('Invalid user ID'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation error',
        success: false,
        errors: errors.array(),
      });
    }
    next();
  },
];

const validateGetBook = [
  param('id').isInt().withMessage('Invalid book ID'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation error',
        success: false,
        errors: errors.array(),
      });
    }
    next();
  },
];

const validateEditBook = [
  param('id').isInt().withMessage('Invalid book ID'),
  body('title').optional().isString().trim(),
  body('author').optional().isString().trim(),
  body('releaseYear').optional().isInt({ min: 1900, max: new Date().getFullYear() }),
  body('category').optional().isString().trim(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation error',
        success: false,
        errors: errors.array(),
      });
    }
    next();
  },
];

const test = (req, res) => {
  res.status(200).json({
    message: "Server is running",
    success: true,
  });
};

const getAllBooks = async (req, res) => {
  try {
    const allBooks = await prisma.bookListing.findMany();
    res.status(200).json({
      allBooks,
      success: true,
      message: "All Books Fetched",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching books",
      success: false,
      error: error.message,
    });
  }
};

const getSingleBook = [validateGetBook, async (req, res) => {
  try {
    const { id } = req.params;
    const singleBook = await prisma.bookListing.findUnique({
      where: { id: parseInt(id, 10) },
    });
    if (!singleBook) {
      return res.status(404).json({
        message: "Book not found",
        success: false,
      });
    }
    res.status(200).json({
      singleBook,
      success: true,
      message: "Book fetched",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching the book",
      success: false,
      error: error.message,
    });
  }
}];

const addBook = [validateAddBook, async (req, res) => {
  try {
    const { title, author, releaseYear, category, userId, imgUrl } = req.body;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    // Create the book listing
    const createBook = await prisma.bookListing.create({
      data: {
        title,
        author,
        releaseYear,
        category,
        imgUrl,
        userId,
      },
    });

    res.status(201).json({
      createBook,
      success: true,
      message: "Book Added",
    });
  } catch (error) {
    console.error('Error adding the book:', error);
    res.status(500).json({
      message: "Error adding the book",
      success: false,
      error: error.message,
    });
  }
}];

const removeBook = [validateGetBook, async (req, res) => {
  try {
    const { id } = req.params;
    const deleteBook = await prisma.bookListing.delete({
      where: { id: parseInt(id, 10) },
    });
    if (!deleteBook) {
      return res.status(404).json({
        message: "Book not found",
        success: false,
      });
    }
    res.status(200).json({
      deleteBook,
      success: true,
      message: "Book Removed",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting the book",
      success: false,
      error: error.message,
    });
  }
}];

const editBook = [validateEditBook, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, releaseYear, category } = req.body;
    const updateBook = await prisma.bookListing.update({
      where: { id: parseInt(id, 10) },
      data: {
        title,
        author,
        releaseYear,
        category,
      },
    });
    if (!updateBook) {
      return res.status(404).json({
        message: "Book not found",
        success: false,
      });
    }
    res.status(200).json({
      updateBook,
      success: true,
      message: "Book Updated",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating the book",
      success: false,
      error: error.message,
    });
  }
}];
const matchmaking = [validateMatchmaking, async (req, res) => {
  try {
    const { userId } = req.query;

    // Fetch user preferences
    const userPreferences = await prisma.user.findUnique({
      where: { id: parseInt(userId, 10) },
      include: { bookListings: true },
    });

    if (!userPreferences) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Find potential matches based on user preferences
    const potentialMatches = await prisma.bookListing.findMany({
      where: {
        AND: [
          { id: { notIn: userPreferences.bookListings.map(b => b.id) } },
          { category: { in: userPreferences.bookListings.map(b => b.category) } }
        ]
      }
    });

    res.status(200).json({
      potentialMatches,
      success: true,
      message: "Potential matches fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching potential matches",
      success: false,
      error: error.message,
    });
  }
}];

const validateExchangeRequest = [
  body('requesterId').isInt().withMessage('Invalid requester ID'),
  body('bookListingId').isInt().withMessage('Invalid book listing ID'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation error',
        success: false,
        errors: errors.array(),
      });
    }
    next();
  },
];

const createExchangeRequest = [ async (req, res) => {
  try {
   
    const { bookListingId,requesterId  } = req.body;
    console.log(bookListingId,requesterId)
    
    // Create the exchange request
    const newRequest = await prisma.exchangeRequest.create({
      data: {
        requesterId,
        bookListingId,
      },
    });

    res.status(201).json({
      newRequest,
      success: true,
      message: 'Exchange request created successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating exchange request',
      success: false,
      error: error.message,
    });
  }
}];
const validateUpdateRequest = [
  param('id').isInt().withMessage('Invalid request ID'),
  body('status').isIn(['accepted', 'rejected']).withMessage('Invalid status'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation error',
        success: false,
        errors: errors.array(),
      });
    }
    next();
  },
];

const updateExchangeRequest = [validateUpdateRequest, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Update the exchange request status
    const updatedRequest = await prisma.exchangeRequest.update({
      where: { id: parseInt(id, 10) },
      data: { status },
    });

    res.status(200).json({
      updatedRequest,
      success: true,
      message: 'Exchange request updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating exchange request',
      success: false,
      error: error.message,
    });
  }
}];




module.exports = {
  test,
  getAllBooks,
  addBook,
  removeBook,
  editBook,
  getSingleBook,
  matchmaking,
  createExchangeRequest,
  updateExchangeRequest
};
