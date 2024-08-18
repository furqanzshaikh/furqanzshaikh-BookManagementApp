const User = require("../models/userSchema.js");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

const createUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password: hashedPassword });
    res.status(201).json({ newUser, success: true, message: "User created successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error while creating user",
      success: false,
      error: error.message,
    });
  }
};
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ success: true, message: "Logged in successfully", token });
  } catch (error) {
    res.status(500).json({
      message: "Error while logging in",
      success: false,
      error: error.message,
    });
  }
};
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

  if (token == null) return res.sendStatus(401); // If no token, return Unauthorized

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // If token is invalid, return Forbidden

    req.user = user; // Attach user to request object
    next(); // Continue to the next middleware or route handler
  });
};
module.exports = {
  createUser,
  login,
  authenticateToken
};
