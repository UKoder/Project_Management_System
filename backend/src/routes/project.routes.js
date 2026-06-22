const express = require('express');
const router = express.Router();
const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/project.controller');
const { createProjectValidation, updateProjectValidation } = require('../middleware/validation');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.post('/', createProjectValidation, createProject);
router.put('/:id', updateProjectValidation, updateProject);
router.delete('/:id', deleteProject);

module.exports = router;
