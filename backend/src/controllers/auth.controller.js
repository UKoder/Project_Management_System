const authService = require('../services/auth.service');

const register = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;
    const result = await authService.register({ fullName, email, password });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
};

const getMe = async (req, res) => {
  res.status(200).json({ user: req.user });
};

module.exports = { register, login, logout, getMe };
