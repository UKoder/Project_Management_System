const express = require('express');
const router = express.Router();
const { register, login, logout, getMe } = require('../controllers/auth.controller');
const { registerValidation, loginValidation } = require('../middleware/validation');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../config/rateLimiter');

router.post('/register', authLimiter, registerValidation, register);
router.post('/login', authLimiter, loginValidation, login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router;
