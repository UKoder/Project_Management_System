import { useState, useEffect, useCallback } from 'react';
import { getProjects, createProject, updateProject, deleteProject } from '../api/projects.api';

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProjects(params);
      setProjects(data.projects);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  }, []);

  const addProject = async (projectData) => {
    const data = await createProject(projectData);
    setProjects((prev) => [data.project, ...prev]);
    return data.project;
  };

  const editProject = async (id, projectData) => {
    const data = await updateProject(id, projectData);
    setProjects((prev) => prev.map((p) => (p.id === id ? data.project : p)));
    return data.project;
  };

  const removeProject = async (id) => {
    await deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, loading, error, fetchProjects, addProject, editProject, removeProject };
};
