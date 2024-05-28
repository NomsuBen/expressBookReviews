const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Helper function to check if a username is valid (e.g., does not already exist)
const isValid = (username) => {
  return users.some(user => user.username === username);
};

// Helper function to check if username and password match the ones we have in records
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// Route for user registration
regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Add new user
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Route for user login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Generate a JWT token
  const token = jwt.sign({ username }, "your_jwt_secret_key", { expiresIn: '1h' });

  // Save the token in the session
  req.session.token = token;

  return res.status(200).json({ message: "Login successful", token });
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;

  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).json({ message: "A token is required for authentication" });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, "your_jwt_secret_key");
    const username = decoded.username;

    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (!books[isbn].reviews) {
      books[isbn].reviews = {};
    }

    // Add or update the review
    books[isbn].reviews[username] = review;

    return res.status(200).json({ message: "Review added/updated successfully" });
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
