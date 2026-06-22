import { useState, useEffect, useCallback } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../api/tasks.api';

export const useTasks = (projectId = null) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      if (projectId) {
        params.projectId = projectId;
      }
      const data = await getTasks(params);
      setTasks(data.tasks);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const addTask = async (taskData) => {
    const data = await createTask(taskData);
    setTasks((prev) => [data.task, ...prev]);
    return data.task;
  };

  const editTask = async (id, taskData) => {
    const data = await updateTask(id, taskData);
    setTasks((prev) => prev.map((t) => (t.id === id ? data.task : t)));
    return data.task;
  };

  const removeTask = async (id) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { tasks, loading, error, fetchTasks, addTask, editTask, removeTask };
};
