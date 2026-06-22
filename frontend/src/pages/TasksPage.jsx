import { useState, useEffect, useCallback } from 'react';
import { useTasks } from '../hooks/useTasks';
import { getProjects } from '../api/projects.api';
import Navbar from '../components/Navbar';
import TaskItem from '../components/TaskItem';
import TaskModal from '../components/TaskModal';
import SearchFilterBar from '../components/SearchFilterBar';

const TasksPage = () => {
  const { tasks, loading: tasksLoading, error: tasksError, fetchTasks, addTask, editTask, removeTask } = useTasks();
  const [projects, setProjects] = useState([]);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskModalLoading, setTaskModalLoading] = useState(false);
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Fetch projects list for task creation modal and filtering
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data.projects || []);
      } catch (err) {
        console.error('Failed to fetch projects list', err);
      }
    };
    fetchProjects();
  }, []);

  const loadTasks = useCallback(
    (paramsUpdate = {}) => {
      const params = {};
      const searchVal = paramsUpdate.search !== undefined ? paramsUpdate.search : search;
      const statusVal = paramsUpdate.status !== undefined ? paramsUpdate.status : statusFilter;
      const priorityVal = paramsUpdate.priority !== undefined ? paramsUpdate.priority : priorityFilter;
      const projectVal = paramsUpdate.projectId !== undefined ? paramsUpdate.projectId : projectFilter;
      const sortVal = paramsUpdate.sortBy !== undefined ? paramsUpdate.sortBy : sortBy;
      const orderVal = paramsUpdate.sortOrder !== undefined ? paramsUpdate.sortOrder : sortOrder;

      if (searchVal) params.name = searchVal;
      if (statusVal) params.status = statusVal;
      if (priorityVal) params.priority = priorityVal;
      if (projectVal) params.projectId = projectVal;
      if (sortVal) {
        params.sortBy = sortVal;
        params.sortOrder = orderVal;
      }
      fetchTasks(params);
    },
    [fetchTasks, search, statusFilter, priorityFilter, projectFilter, sortBy, sortOrder]
  );

  const handleSearchTasks = (value) => {
    setSearch(value);
    loadTasks({ search: value });
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    loadTasks({ status: value });
  };

  const handlePriorityFilter = (value) => {
    setPriorityFilter(value);
    loadTasks({ priority: value });
  };

  const handleProjectFilter = (value) => {
    setProjectFilter(value);
    loadTasks({ projectId: value });
  };

  const handleSortChange = (value) => {
    const [field, order] = value.split('-');
    setSortBy(field);
    setSortOrder(order);
    loadTasks({ sortBy: field, sortOrder: order });
  };

  const handleTaskSubmit = async (data) => {
    try {
      setTaskModalLoading(true);
      if (editingTask) {
        await editTask(editingTask.id, data);
      } else {
        await addTask(data);
      }
      setTaskModalOpen(false);
      setEditingTask(null);
      // Reload task list with current params
      loadTasks();
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Operation failed');
    } finally {
      setTaskModalLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await editTask(taskId, { status: newStatus });
    } catch (err) {
      alert('Failed to update task status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await removeTask(taskId);
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: '2rem 1.5rem' }} id="tasks-page">
        <div className="page-header">
          <h1 className="page-title">Tasks</h1>
          <button
            className="btn btn-primary"
            onClick={() => { setEditingTask(null); setTaskModalOpen(true); }}
            disabled={projects.length === 0}
            id="add-task-btn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Task
          </button>
        </div>

        {projects.length === 0 && (
          <div className="alert alert-warning" style={{ marginBottom: '1.5rem' }}>
            You need to create a project first before you can manage or add tasks.
          </div>
        )}

        <SearchFilterBar
          searchValue={search}
          onSearchChange={handleSearchTasks}
          filters={[
            {
              name: 'task-status',
              value: statusFilter,
              onChange: handleStatusFilter,
              placeholder: 'All Statuses',
              options: [
                { value: 'PENDING', label: 'Pending' },
                { value: 'IN_PROGRESS', label: 'In Progress' },
                { value: 'COMPLETED', label: 'Completed' },
              ],
            },
            {
              name: 'priority',
              value: priorityFilter,
              onChange: handlePriorityFilter,
              placeholder: 'All Priorities',
              options: [
                { value: 'LOW', label: 'Low' },
                { value: 'MEDIUM', label: 'Medium' },
                { value: 'HIGH', label: 'High' },
              ],
            },
            {
              name: 'project',
              value: projectFilter,
              onChange: handleProjectFilter,
              placeholder: 'All Projects',
              options: projects.map((p) => ({ value: p.id, label: p.name })),
            },
            {
              name: 'sort',
              value: `${sortBy}-${sortOrder}`,
              onChange: handleSortChange,
              placeholder: 'Sort By',
              options: [
                { value: 'createdAt-desc', label: 'Newest First' },
                { value: 'createdAt-asc', label: 'Oldest First' },
                { value: 'name-asc', label: 'Name (A-Z)' },
                { value: 'name-desc', label: 'Name (Z-A)' },
                { value: 'dueDate-asc', label: 'Due Date' },
                { value: 'priority-desc', label: 'Priority (High to Low)' },
                { value: 'priority-asc', label: 'Priority (Low to High)' },
              ],
            },
          ]}
        />

        {tasksLoading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading tasks...</p>
          </div>
        ) : tasksError ? (
          <div className="alert alert-error">{tasksError}</div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              {search || statusFilter || priorityFilter || projectFilter ? 'No tasks match your filters' : 'No tasks yet'}
            </h3>
            <p>{search || statusFilter || priorityFilter || projectFilter ? 'Try adjusting your filters' : 'Create your first task to get started'}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onEdit={(t) => { setEditingTask(t); setTaskModalOpen(true); }}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}

        <TaskModal
          isOpen={taskModalOpen}
          onClose={() => { setTaskModalOpen(false); setEditingTask(null); }}
          onSubmit={handleTaskSubmit}
          task={editingTask}
          projects={projects}
          loading={taskModalLoading}
        />
      </main>
    </>
  );
};

export default TasksPage;
