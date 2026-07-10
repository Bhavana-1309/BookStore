const Book = require('../models/book');

// @desc    Get all books with optional search, filter, and sorting
// @route   GET /api/books
// @access  Public
const getBooks = async (req, res) => {
  try {
    const { search, genre, author, minPrice, maxPrice, sortBy } = req.query;
    const query = {};

    // Dynamic Search (Title, Author, Genre)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { genre: { $regex: search, $options: 'i' } },
      ];
    }

    // Genre Filter
    if (genre && genre !== 'All') {
      query.genre = genre;
    }

    // Author Filter
    if (author) {
      query.author = { $regex: author, $options: 'i' };
    }

    // Price Filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Sort configurations
    let sortOptions = {};
    if (sortBy) {
      if (sortBy === 'priceLowHigh') {
        sortOptions.price = 1;
      } else if (sortBy === 'priceHighLow') {
        sortOptions.price = -1;
      } else if (sortBy === 'rating') {
        sortOptions.rating = -1;
      } else {
        sortOptions.createdAt = -1;
      }
    } else {
      sortOptions.createdAt = -1; // Newest arrivals default
    }

    const books = await Book.find(query).sort(sortOptions);
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error retrieving books' });
  }
};

// @desc    Get single book by ID
// @route   GET /api/books/:id
// @access  Public
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(500).json({ message: 'Server error retrieving book' });
  }
};

// @desc    Create a new book (Admin Only)
// @route   POST /api/books
// @access  Private/Admin
const createBook = async (req, res) => {
  try {
    const { title, author, genre, description, price, rating, stock, image } = req.body;

    if (!title || !author || !genre || !description || price === undefined || stock === undefined) {
      return res.status(400).json({ message: 'Please add all required fields' });
    }

    if (price < 0 || stock < 0) {
      return res.status(400).json({ message: 'Price and stock must be positive numbers' });
    }

    const book = new Book({
      title,
      author,
      genre,
      description,
      price,
      rating: rating || 0,
      stock,
      image,
    });
    console.log(req.body);

    const createdBook = await book.save();
    res.status(201).json(createdBook);
  } catch (error) {
    console.error("CREATE BOOK ERROR");
    console.error(error);
    console.error(error.stack);

    res.status(500).json({
        message: error.message,
    });
}
};

// @desc    Update an existing book (Admin Only)
// @route   PUT /api/books/:id
// @access  Private/Admin
const updateBook = async (req, res) => {
  try {
    const { title, author, genre, description, price, rating, stock, image } = req.body;

    const book = await Book.findById(req.params.id);

    if (book) {
      if (price !== undefined && price < 0) {
        return res.status(400).json({ message: 'Price must be a positive number' });
      }
      if (stock !== undefined && stock < 0) {
        return res.status(400).json({ message: 'Stock must be a positive number' });
      }

      book.title = title || book.title;
      book.author = author || book.author;
      book.genre = genre || book.genre;
      book.description = description || book.description;
      book.price = price !== undefined ? price : book.price;
      book.rating = rating !== undefined ? rating : book.rating;
      book.stock = stock !== undefined ? stock : book.stock;
      book.image = image || book.image;

      const updatedBook = await book.save();
      res.json(updatedBook);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(500).json({ message: 'Server error updating book' });
  }
};

// @desc    Delete a book (Admin Only)
// @route   DELETE /api/books/:id
// @access  Private/Admin
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (book) {
      await Book.findByIdAndDelete(req.params.id);
      res.json({ message: 'Book removed' });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(500).json({ message: 'Server error deleting book' });
  }
};

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
