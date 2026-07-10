const express = require('express');
const router = express.Router();

const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
} = require('../controllers/authController');