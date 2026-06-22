const projectService = require('../services/project.service');

const getAllProjects = async (req, res, next) => {
  try {
    const { name, status, priority, sortBy, sortOrder } = req.query;
    const projects = await projectService.getAllProjects(req.user.id, { name, status, priority, sortBy, sortOrder });
    res.status(200).json({ projects });
  } catch (error) {
    next(error);
  }
};

const getProjectById = async (req, res, next) => {
  try {
    const project = await projectService.getProjectById(req.params.id, req.user.id);
    res.status(200).json({ project });
  } catch (error) {
    next(error);
  }
};

const createProject = async (req, res, next) => {
  try {
    const project = await projectService.createProject(req.body, req.user.id);
    res.status(201).json({ project });
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const project = await projectService.updateProject(req.params.id, req.body, req.user.id);
    res.status(200).json({ project });
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const result = await projectService.deleteProject(req.params.id, req.user.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
