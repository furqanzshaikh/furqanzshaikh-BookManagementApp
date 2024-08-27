const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const { authenticateToken } = require("../controllers/userContoller");
const { PrismaClient } = require('@prisma/client');
const { body, param, validationResult,query } = require('express-validator');
const validator = require('validator');
const prisma = new PrismaClient();

router.post("/add-book", authenticateToken, bookController.addBook);
router.get("/all-books", authenticateToken, bookController.getAllBooks);
router.get("/get-book/:id", authenticateToken, bookController.getSingleBook);
router.patch("/edit-book/:id", authenticateToken, bookController.editBook);
router.delete("/delete-book/:id", authenticateToken, bookController.removeBook);
router.post('/create-request/:id', bookController.createExchangeRequest);
router.patch('/update-request/:id', bookController.updateExchangeRequest);
router.get('/related-books', authenticateToken, async (req, res) => {
    try {
        const { category } = req.query;

        if (!category) {
            return res.status(400).json({ message: 'Category is required' });
        }

        const relatedBooks = await prisma.bookListing.findMany({
            where: {
                category: {
                    contains: category,
                    mode: 'insensitive',
                },
            },
            take: 5, // Limit to 5 related books
        });

        res.status(200).json({ relatedBooks });
    } catch (error) {
        console.error('Error fetching related books:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
module.exports = router;
