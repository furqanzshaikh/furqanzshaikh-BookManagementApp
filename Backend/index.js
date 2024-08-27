const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 4000;;
const { test } = require("./controllers/bookController.js");
const userRoutes = require("./routes/usersRoutes.js");
const booksRoutes = require("./routes/booksRoutes.js");

const app = express();
app.use(express.json());
app.use(cors());


app.get("/", test);

app.use("/api", userRoutes);
app.use("/api", booksRoutes);

app.listen(port, () => {
  console.log(`server is started on ${port}`);
});
