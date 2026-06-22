const prisma = require('../config/db');

const getAllProjects = async (userId, { name, status, priority, sortBy, sortOrder }) => {
  const where = { userId };

  if (name) {
    where.name = { contains: name };
  }

  if (status) {
    where.status = status;
  }

  if (priority) {
    where.priority = priority;
  }

  const orderBy = {};
  if (sortBy) {
    orderBy[sortBy] = sortOrder || 'asc';
  } else {
    orderBy.createdAt = 'desc';
  }

  const projects = await prisma.project.findMany({
    where,
    include: {
      _count: {
        select: { tasks: true },
      },
    },
    orderBy,
  });

  return projects;
};

const getProjectById = async (projectId, userId) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      tasks: {
        orderBy: { createdAt: 'desc' },
      },
      _count: {
        select: { tasks: true },
      },
    },
  });

  if (!project) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }

  if (project.userId !== userId) {
    const error = new Error('Not authorized to access this project');
    error.statusCode = 403;
    error.code = 'FORBIDDEN';
    throw error;
  }

  return project;
};

const createProject = async (data, userId) => {
  const project = await prisma.project.create({
    data: {
      name: data.name,
      description: data.description,
      status: data.status || 'NOT_STARTED',
      priority: data.priority || 'MEDIUM',
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      userId,
    },
    include: {
      _count: {
        select: { tasks: true },
      },
    },
  });

  return project;
};

const updateProject = async (projectId, data, userId) => {
  // Verify ownership
  await getProjectById(projectId, userId);

  const updateData = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.priority !== undefined) updateData.priority = data.priority;
  if (data.startDate !== undefined) updateData.startDate = data.startDate ? new Date(data.startDate) : null;
  if (data.endDate !== undefined) updateData.endDate = data.endDate ? new Date(data.endDate) : null;

  const project = await prisma.project.update({
    where: { id: projectId },
    data: updateData,
    include: {
      _count: {
        select: { tasks: true },
      },
    },
  });

  return project;
};

const deleteProject = async (projectId, userId) => {
  // Verify ownership
  await getProjectById(projectId, userId);

  await prisma.project.delete({
    where: { id: projectId },
  });

  return { message: 'Project deleted successfully' };
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
