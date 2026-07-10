const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(protect, getCart)
  .post(protect, addToCart)
  .put(protect, updateCartQuantity)
  .delete(protect, clearCart);

router.route('/:bookId').delete(protect, removeFromCart);

module.exports = router;
