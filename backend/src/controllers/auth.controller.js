const authService = require('../services/auth.service');
const { jwtExpiresIn } = require('../config/env');

// Parse JWT_EXPIRES_IN string (e.g. '7d', '24h', '60m') to milliseconds
const parseExpiresIn = (expiresIn) => {
  const match = expiresIn.match(/^(\d+)([dhms])$/);
  if (!match) return 7 * 24 * 60 * 60 * 1000; // default 7 days
  const value = parseInt(match[1]);
  const unit = match[2];
  switch (unit) {
    case 'd': return value * 24 * 60 * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    case 'm': return value * 60 * 1000;
    case 's': return value * 1000;
    default: return 7 * 24 * 60 * 60 * 1000;
  }
};

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: parseExpiresIn(jwtExpiresIn),
  path: '/',
};

const register = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;
    const result = await authService.register({ fullName, email, password });

    // Set token as httpOnly cookie
    res.cookie('token', result.token, cookieOptions);

    // Return user only (no token in body)
    res.status(201).json({ user: result.user });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });

    // Set token as httpOnly cookie
    res.cookie('token', result.token, cookieOptions);

    // Return user only (no token in body)
    res.status(200).json({ user: result.user });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

const getMe = async (req, res) => {
  res.status(200).json({ user: req.user });
};

module.exports = { register, login, logout, getMe };
