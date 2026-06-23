const { verifyToken } = require('../utils/token');
const prisma = require('../config/db');

const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Try httpOnly cookie first
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // 2. Fallback to Authorization header (for API compatibility)
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        error: { message: 'Not authorized, no token provided', code: 'NO_TOKEN' },
      });
    }

    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, fullName: true },
    });

    if (!user) {
      return res.status(401).json({
        error: { message: 'Not authorized, user not found', code: 'USER_NOT_FOUND' },
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      error: { message: 'Not authorized, token is invalid', code: 'INVALID_TOKEN' },
    });
  }
};

module.exports = { protect };
