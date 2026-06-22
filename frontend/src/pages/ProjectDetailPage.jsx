import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProjectById, updateProject, deleteProject } from '../api/projects.api';
import { useTasks } from '../hooks/useTasks';
import Navbar from '../components/Navbar';
import TaskItem from '../components/TaskItem';
import TaskModal from '../components/TaskModal';
import SearchFilterBar from '../components/SearchFilterBar';

const statusConfig = {
  NOT_STARTED: { label: 'Not Started', class: 'badge-not-started' },
  IN_PROGRESS: { label: 'In Progress', class: 'badge-in-progress' },
  COMPLETED: { label: 'Completed', class: 'badge-completed' },
};

const priorityConfig = {
  LOW: { label: 'Low', class: 'badge-low' },
  MEDIUM: { label: 'Medium', class: 'badge-medium' },
  HIGH: { label: 'High', class: 'badge-high' },
};

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [projectLoading, setProjectLoading] = useState(true);
  const [projectError, setProjectError] = useState(null);
  const { tasks, loading: tasksLoading, fetchTasks, addTask, editTask, removeTask } = useTasks(id);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskModalLoading, setTaskModalLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setProjectLoading(true);
        const data = await getProjectById(id);
        setProject(data.project);
      } catch (err) {
        setProjectError(err.response?.data?.error?.message || 'Failed to load project');
      } finally {
        setProjectLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleDeleteProject = async () => {
    if (!window.confirm('Are you sure you want to delete this project and all its tasks?')) return;
    try {
      await deleteProject(id);
      navigate('/projects');
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Failed to delete project');
    }
  };

  const loadTasks = (paramsUpdate = {}) => {
    const params = {};
    const searchVal = paramsUpdate.search !== undefined ? paramsUpdate.search : search;
    const statusVal = paramsUpdate.status !== undefined ? paramsUpdate.status : statusFilter;
    const priorityVal = paramsUpdate.priority !== undefined ? paramsUpdate.priority : priorityFilter;
    const sortVal = paramsUpdate.sortBy !== undefined ? paramsUpdate.sortBy : sortBy;
    const orderVal = paramsUpdate.sortOrder !== undefined ? paramsUpdate.sortOrder : sortOrder;

    if (searchVal) params.name = searchVal;
    if (statusVal) params.status = statusVal;
    if (priorityVal) params.priority = priorityVal;
    if (sortVal) {
      params.sortBy = sortVal;
      params.sortOrder = orderVal;
    }
    fetchTasks(params);
  };

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

  const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  if (projectLoading) {
    return (
      <>
        <Navbar />
        <div className="loading-container" style={{ minHeight: '50vh' }}>
          <div className="spinner"></div>
          <p>Loading project...</p>
        </div>
      </>
    );
  }

  if (projectError) {
    return (
      <>
        <Navbar />
        <main className="container" style={{ padding: '2rem 1.5rem' }}>
          <div className="alert alert-error">{projectError}</div>
          <Link to="/projects" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
            ← Back to Projects
          </Link>
        </main>
      </>
    );
  }

  const status = statusConfig[project?.status] || statusConfig.NOT_STARTED;
  const projectPriority = priorityConfig[project?.priority] || priorityConfig.MEDIUM;

  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: '2rem 1.5rem' }} id="project-detail-page">
        {/* Breadcrumb */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/projects" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to Projects
          </Link>
        </div>

        {/* Project Header */}
        <div className="glass-card animate-fade-in" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{project.name}</h1>
                <span className={`badge ${status.class}`}>{status.label}</span>
                <span className={`badge ${projectPriority.class}`}>{projectPriority.label}</span>
              </div>
              {project.description && (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginBottom: '1rem', maxWidth: '48rem' }}>
                  {project.description}
                </p>
              )}
              <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                <span>
                  <strong style={{ color: 'var(--text-secondary)' }}>Start:</strong> {formatDate(project.startDate)}
                </span>
                <span>
                  <strong style={{ color: 'var(--text-secondary)' }}>End:</strong> {formatDate(project.endDate)}
                </span>
                <span>
                  <strong style={{ color: 'var(--text-secondary)' }}>Tasks:</strong> {tasks.length}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-danger btn-sm" onClick={handleDeleteProject} id="delete-project-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div className="page-header">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>Tasks</h2>
            <button
              className="btn btn-primary"
              onClick={() => { setEditingTask(null); setTaskModalOpen(true); }}
              id="add-task-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Task
            </button>
          </div>

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
        </div>

        {tasksLoading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              {search || statusFilter || priorityFilter ? 'No tasks match your filters' : 'No tasks yet'}
            </h3>
            <p>{search || statusFilter || priorityFilter ? 'Try adjusting your filters' : 'Add your first task to this project'}</p>
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
          projectId={id}
          loading={taskModalLoading}
        />
      </main>
    </>
  );
};

export default ProjectDetailPage;
