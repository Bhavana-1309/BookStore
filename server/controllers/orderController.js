const Order = require('../models/order');
const Cart = require('../models/cart');
const Book = require('../models/book');

// @desc    Place a new order (Cash on Delivery)
// @route   POST /api/orders
// @access  Private
const placeOrder = async (req, res) => {
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ message: 'Shipping address is required' });
    }

    const { fullName, mobileNumber, address: streetAddress, city, state, pincode } = address;
    if (!fullName || !mobileNumber || !streetAddress || !city || !state || !pincode) {
      return res.status(400).json({ message: 'All address fields are required' });
    }

    // Retrieve user's cart
    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.bookId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty' });
    }

    const orderBooks = [];
    let totalAmount = 0;

    // Validate stock and prepare order items
    for (const item of cart.items) {
      const book = item.bookId;
      if (!book) {
        return res.status(404).json({ message: 'One of the books in your cart no longer exists' });
      }

      if (book.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for "${book.title}". Available: ${book.stock}, Requested: ${item.quantity}`,
        });
      }

      orderBooks.push({
        bookId: book._id,
        title: book.title,
        quantity: item.quantity,
        price: book.price,
      });

      totalAmount += book.price * item.quantity;
    }

    // Deduct stock from books
    for (const item of cart.items) {
      const book = await Book.findById(item.bookId._id);
      book.stock -= item.quantity;
      await book.save();
    }

    // Create the order
    const order = new Order({
      userId: req.user._id,
      books: orderBooks,
      totalAmount,
      address: {
        fullName,
        mobileNumber,
        address: streetAddress,
        city,
        state,
        pincode,
      },
      phone: mobileNumber,
      status: 'Pending',
    });

    const createdOrder = await order.save();

    // Clear user's cart
    cart.items = [];
    await cart.save();

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error placing order' });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error retrieving user orders' });
  }
};

// @desc    Get all orders (Admin Only)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('userId', 'name email')
      .sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error retrieving all orders' });
  }
};

// @desc    Update order status (Admin Only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const validStatuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(500).json({ message: 'Server error updating order status' });
  }
};

module.exports = {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
};
