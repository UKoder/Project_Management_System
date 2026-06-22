const express = require('express');
const router = express.Router();
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/task.controller');
const { createTaskValidation, updateTaskValidation } = require('../middleware/validation');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.get('/', getAllTasks);
router.get('/:id', getTaskById);
router.post('/', createTaskValidation, createTask);
router.put('/:id', updateTaskValidation, updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
