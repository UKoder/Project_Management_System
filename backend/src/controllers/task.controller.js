const taskService = require('../services/task.service');

const getAllTasks = async (req, res, next) => {
  try {
    const { name, status, priority, projectId, sortBy, sortOrder } = req.query;
    const tasks = await taskService.getAllTasks(req.user.id, { name, status, priority, projectId, sortBy, sortOrder });
    res.status(200).json({ tasks });
  } catch (error) {
    next(error);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const task = await taskService.getTaskById(req.params.id, req.user.id);
    res.status(200).json({ task });
  } catch (error) {
    next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.body, req.user.id);
    res.status(201).json({ task });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.body, req.user.id);
    res.status(200).json({ task });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const result = await taskService.deleteTask(req.params.id, req.user.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
