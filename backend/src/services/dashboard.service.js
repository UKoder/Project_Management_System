const prisma = require('../config/db');

const getDashboardStats = async (userId) => {
  const [
    totalProjects,
    projectsNotStarted,
    projectsInProgress,
    projectsCompleted,
    totalTasks,
    tasksPending,
    tasksInProgress,
    tasksCompleted,
  ] = await Promise.all([
    prisma.project.count({ where: { userId } }),
    prisma.project.count({ where: { userId, status: 'NOT_STARTED' } }),
    prisma.project.count({ where: { userId, status: 'IN_PROGRESS' } }),
    prisma.project.count({ where: { userId, status: 'COMPLETED' } }),
    prisma.task.count({ where: { userId } }),
    prisma.task.count({ where: { userId, status: 'PENDING' } }),
    prisma.task.count({ where: { userId, status: 'IN_PROGRESS' } }),
    prisma.task.count({ where: { userId, status: 'COMPLETED' } }),
  ]);

  // Get recent projects
  const recentProjects = await prisma.project.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: {
      _count: {
        select: { tasks: true },
      },
    },
  });

  // Get upcoming tasks (tasks with due dates in the future, sorted by due date)
  const upcomingTasks = await prisma.task.findMany({
    where: {
      userId,
      status: { not: 'COMPLETED' },
      dueDate: { gte: new Date() },
    },
    orderBy: { dueDate: 'asc' },
    take: 5,
    include: {
      project: {
        select: { id: true, name: true },
      },
    },
  });

  return {
    projects: {
      total: totalProjects,
      notStarted: projectsNotStarted,
      inProgress: projectsInProgress,
      completed: projectsCompleted,
    },
    tasks: {
      total: totalTasks,
      pending: tasksPending,
      inProgress: tasksInProgress,
      completed: tasksCompleted,
    },
    recentProjects,
    upcomingTasks,
  };
};

module.exports = { getDashboardStats };
