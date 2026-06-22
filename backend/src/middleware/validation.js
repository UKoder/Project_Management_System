const { body, param, query, validationResult } = require('express-validator');

// Middleware to check validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: errors.array().map((err) => ({
          field: err.path,
          message: err.msg,
        })),
      },
    });
  }
  next();
};

// Auth validations
const registerValidation = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  validate,
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

// Project validations
const createProjectValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Project name is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Project name must be between 1 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters'),
  body('status')
    .optional()
    .isIn(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'])
    .withMessage('Status must be NOT_STARTED, IN_PROGRESS, or COMPLETED'),
  body('priority')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH'])
    .withMessage('Priority must be LOW, MEDIUM, or HIGH'),
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date'),
  validate,
];

const updateProjectValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Project name cannot be empty')
    .isLength({ min: 1, max: 200 })
    .withMessage('Project name must be between 1 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters'),
  body('status')
    .optional()
    .isIn(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'])
    .withMessage('Status must be NOT_STARTED, IN_PROGRESS, or COMPLETED'),
  body('priority')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH'])
    .withMessage('Priority must be LOW, MEDIUM, or HIGH'),
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date'),
  validate,
];

// Task validations
const createTaskValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Task name is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Task name must be between 1 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters'),
  body('priority')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH'])
    .withMessage('Priority must be LOW, MEDIUM, or HIGH'),
  body('status')
    .optional()
    .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED'])
    .withMessage('Status must be PENDING, IN_PROGRESS, or COMPLETED'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),
  body('projectId')
    .notEmpty()
    .withMessage('Project ID is required')
    .isUUID()
    .withMessage('Project ID must be a valid UUID'),
  validate,
];

const updateTaskValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Task name cannot be empty')
    .isLength({ min: 1, max: 200 })
    .withMessage('Task name must be between 1 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must not exceed 2000 characters'),
  body('priority')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH'])
    .withMessage('Priority must be LOW, MEDIUM, or HIGH'),
  body('status')
    .optional()
    .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED'])
    .withMessage('Status must be PENDING, IN_PROGRESS, or COMPLETED'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),
  validate,
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  createProjectValidation,
  updateProjectValidation,
  createTaskValidation,
  updateTaskValidation,
};
