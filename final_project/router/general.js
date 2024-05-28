const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  res.json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:id', function (req, res) {
    const id = req.params.id;
  
    // Check if the book exists
    if (books[id]) {
      res.json(books[id]);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  });

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const matchingBooks = [];

  // Iterate through the books and find books by the author
  for (const key in books) {
    if (books[key].author === author) {
      matchingBooks.push(books[key]);
    }
  }

  // Check if any books were found
  if (matchingBooks.length > 0) {
    res.json(matchingBooks);
  } else {
    res.status(404).json({ message: "No books found by this author" });
  }
});
// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const matchingBooks = [];
  
    // Iterate through the books and find books by the title
    for (const key in books) {
      if (books[key].title === title) {
        matchingBooks.push(books[key]);
      }
    }
  
    // Check if any books were found
    if (matchingBooks.length > 0) {
      res.json(matchingBooks);
    } else {
      res.status(404).json({ message: "No books found with this title" });
    }
  });

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
  
    // Check if the book exists
    if (books[isbn]) {
      res.json(books[isbn].reviews);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  });

module.exports.general = public_users;
