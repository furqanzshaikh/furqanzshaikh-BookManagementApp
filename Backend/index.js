const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 4000;
const connectDb = require("./connection/connectDb.js");
const {
  test,
  getAllBooks,
  addBook,
  removeBook,
  editBook,
  getSingleBook,
} = require("./controllers/bookController.js");
const { createUser, login,authenticateToken } = require("./controllers/userContoller.js");

const app = express();
app.use(express.json());
app.use(cors());
connectDb().catch((error) => {
  console.error("Error connecting to the database:", error);
  process.exit(1);
});

app.get("/", test);

app.get("/books",authenticateToken, getAllBooks);

app.get("/books/:id", getSingleBook);

app.post("/books/add",authenticateToken, addBook);

app.delete("/books/delete/:id", authenticateToken,removeBook);

app.put("/books/edit/:id",authenticateToken, editBook);

app.post('/users/create',createUser)
app.post('/login',login)

app.listen(port, () => {
  console.log(`server is started on ${port}`);
});


