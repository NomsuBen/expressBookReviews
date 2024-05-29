const express = require('express');
const public_users = express.Router();
let books = require('./booksdb.js'); // Adjusted path



// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const result = Object.values(books).filter(book => book.author === author);
    if (result.length > 0) {
        res.json(result);
    } else {
        res.status(404).json({ message: "Author not found" });
    }
});

// Get book details based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const result = Object.values(books).filter(book => book.title === title);
    if (result.length > 0) {
        res.json(result);
    } else {
        res.status(404).json({ message: "Title not found" });
    }
});

// Get book reviews
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book && book.reviews) {
        res.json(book.reviews);
    } else {
        res.status(404).json({ message: "Reviews not found" });
    }
});

// Get the list of books available in the shop using Promise callbacks
public_users.get('/', function (req, res) {
    axios.get('https://benmilekantr-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/books') // Assuming the books are served at this endpoint
        .then(response => {
            res.json(response.data);
        })
        .catch(error => {
            res.status(500).json({ message: "Error fetching books", error: error.message });
        });
});

// Get book details based on ISBN using Promise callbacks
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    axios.get(`https://benmilekantr-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/books/${isbn}`)
        .then(response => {
            res.json(response.data);
        })
        .catch(error => {
            res.status(500).json({ message: "Error fetching book details", error: error.message });
        });
});

// Get book details based on author using async-await
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;
    try {
        const response = await axios.get('https://benmilekantr-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/books');
        const books = response.data;
        const filteredBooks = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());
        if (filteredBooks.length > 0) {
            res.json(filteredBooks);
        } else {
            res.status(404).json({ message: "No books found by this author" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by author", error: error.message });
    }
});

// Get book details based on title using Promise callbacks
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    axios.get('https://benmilekantr-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/books')
        .then(response => {
            const books = response.data;
            const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());
            if (filteredBooks.length > 0) {
                res.json(filteredBooks);
            } else {
                res.status(404).json({ message: "No books found with this title" });
            }
        })
        .catch(error => {
            res.status(500).json({ message: "Error fetching books by title", error: error.message });
        });
});


module.exports.general = public_users;
