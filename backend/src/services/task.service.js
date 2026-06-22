const prisma = require('../config/db');

const getAllTasks = async (userId, { name, status, priority, projectId, sortBy, sortOrder }) => {
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

  if (projectId) {
    where.projectId = projectId;
  }

  const orderBy = {};
  if (sortBy) {
    orderBy[sortBy] = sortOrder || 'asc';
  } else {
    orderBy.createdAt = 'desc';
  }

  const tasks = await prisma.task.findMany({
    where,
    include: {
      project: {
        select: { id: true, name: true },
      },
    },
    orderBy,
  });

  return tasks;
};

const getTaskById = async (taskId, userId) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      project: {
        select: { id: true, name: true },
      },
    },
  });

  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }

  if (task.userId !== userId) {
    const error = new Error('Not authorized to access this task');
    error.statusCode = 403;
    error.code = 'FORBIDDEN';
    throw error;
  }

  return task;
};

const createTask = async (data, userId) => {
  // Verify project belongs to user
  const project = await prisma.project.findUnique({
    where: { id: data.projectId },
  });

  if (!project) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }

  if (project.userId !== userId) {
    const error = new Error('Not authorized to add tasks to this project');
    error.statusCode = 403;
    error.code = 'FORBIDDEN';
    throw error;
  }

  const task = await prisma.task.create({
    data: {
      name: data.name,
      description: data.description,
      priority: data.priority || 'MEDIUM',
      status: data.status || 'PENDING',
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      projectId: data.projectId,
      userId,
    },
    include: {
      project: {
        select: { id: true, name: true },
      },
    },
  });

  return task;
};

const updateTask = async (taskId, data, userId) => {
  // Verify ownership
  await getTaskById(taskId, userId);

  const updateData = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.priority !== undefined) updateData.priority = data.priority;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.dueDate !== undefined) updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;

  const task = await prisma.task.update({
    where: { id: taskId },
    data: updateData,
    include: {
      project: {
        select: { id: true, name: true },
      },
    },
  });

  return task;
};

const deleteTask = async (taskId, userId) => {
  // Verify ownership
  await getTaskById(taskId, userId);

  await prisma.task.delete({
    where: { id: taskId },
  });

  return { message: 'Task deleted successfully' };
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
