const mongoose = require('mongoose');
const Book = require('../models/Book');

// CREATE: Add a new book
const createBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);

    res.status(201).json({
      message: 'Book created successfully',
      book
    });
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

// READ ALL: Get all books
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();

    res.status(200).json({
      count: books.length,
      books
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// READ ONE: Get a book by ID
const getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: 'Invalid book ID'
      });
    }

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        message: 'Book not found'
      });
    }

    res.status(200).json({ book });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// UPDATE: Update a book by ID
const updateBook = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: 'Invalid book ID'
      });
    }

    const book = await Book.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!book) {
      return res.status(404).json({
        message: 'Book not found'
      });
    }

    res.status(200).json({
      message: 'Book updated successfully',
      book
    });
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

// DELETE: Delete a book by ID
const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: 'Invalid book ID'
      });
    }

    const book = await Book.findByIdAndDelete(id);

    if (!book) {
      return res.status(404).json({
        message: 'Book not found'
      });
    }

    res.status(200).json({
      message: 'Book deleted successfully',
      book
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook
};