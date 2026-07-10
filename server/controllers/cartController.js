const Cart = require('../models/cart');
const Book = require('../models/book');

// Helper to get or create cart
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }
  return cart;
};

// @desc    Get logged in user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate({
      path: 'items.bookId',
      model: 'Book',
    });

    if (!cart) {
      return res.json({ items: [] });
    }

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error retrieving cart' });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { bookId, quantity } = req.body;
    const qty = Number(quantity) || 1;

    if (!bookId) {
      return res.status(400).json({ message: 'Book ID required' });
    }

    // Verify book exists and has stock
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.stock < qty) {
      return res.status(400).json({ message: `Only ${book.stock} items available in stock` });
    }

    const cart = await getOrCreateCart(req.user._id);

    // Check if book already exists in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.bookId.toString() === bookId
    );

    if (itemIndex > -1) {
      // Item exists, update quantity
      const newQty = cart.items[itemIndex].quantity + qty;
      if (book.stock < newQty) {
        return res.status(400).json({
          message: `Cannot add more. Max stock available is ${book.stock}. Cart currently has ${cart.items[itemIndex].quantity}.`,
        });
      }
      cart.items[itemIndex].quantity = newQty;
    } else {
      // New item
      cart.items.push({ bookId, quantity: qty });
    }

    await cart.save();

    // Populate and return updated cart
    const updatedCart = await Cart.findOne({ userId: req.user._id }).populate('items.bookId');
    res.json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error adding to cart' });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart
// @access  Private
const updateCartQuantity = async (req, res) => {
  try {
    const { bookId, quantity } = req.body;
    const qty = Number(quantity);

    if (!bookId || qty === undefined) {
      return res.status(400).json({ message: 'Book ID and quantity required' });
    }

    if (qty < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    // Verify stock
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.stock < qty) {
      return res.status(400).json({ message: `Only ${book.stock} items available in stock` });
    }

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.bookId.toString() === bookId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = qty;
      await cart.save();

      const updatedCart = await Cart.findOne({ userId: req.user._id }).populate('items.bookId');
      res.json(updatedCart);
    } else {
      res.status(404).json({ message: 'Item not found in cart' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating quantity' });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:bookId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      (item) => item.bookId.toString() !== req.params.bookId
    );

    await cart.save();

    const updatedCart = await Cart.findOne({ userId: req.user._id }).populate('items.bookId');
    res.json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error removing item from cart' });
  }
};

// @desc    Clear user cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ message: 'Cart cleared', items: [] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error clearing cart' });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
};
