import { useState, useCallback } from 'react';
import Navbar from '../components/Navbar';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';
import SearchFilterBar from '../components/SearchFilterBar';
import { useProjects } from '../hooks/useProjects';

const ProjectsPage = () => {
  const { projects, loading, error, fetchProjects, addProject, editProject, removeProject } = useProjects();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const loadProjects = useCallback(
    ({ searchVal = search, statusVal = statusFilter, priorityVal = priorityFilter, sortVal = sortBy, orderVal = sortOrder } = {}) => {
      const params = {};
      if (searchVal) params.name = searchVal;
      if (statusVal) params.status = statusVal;
      if (priorityVal) params.priority = priorityVal;
      if (sortVal) {
        params.sortBy = sortVal;
        params.sortOrder = orderVal;
      }
      fetchProjects(params);
    },
    [fetchProjects, search, statusFilter, priorityFilter, sortBy, sortOrder]
  );

  const handleSearch = (value) => {
    setSearch(value);
    loadProjects({ searchVal: value });
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    loadProjects({ statusVal: value });
  };

  const handlePriorityFilter = (value) => {
    setPriorityFilter(value);
    loadProjects({ priorityVal: value });
  };

  const handleSortChange = (value) => {
    const [field, order] = value.split('-');
    setSortBy(field);
    setSortOrder(order);
    loadProjects({ sortVal: field, orderVal: order });
  };

  const openCreateModal = () => {
    setEditingProject(null);
    setModalError('');
    setModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setModalError('');
    setModalOpen(true);
  };

  const handleSubmit = async (data) => {
    try {
      setModalLoading(true);
      setModalError('');
      if (editingProject) {
        await editProject(editingProject.id, data);
      } else {
        await addProject(data);
      }
      setModalOpen(false);
      setEditingProject(null);
      // reload current list
      loadProjects();
    } catch (err) {
      setModalError(err.response?.data?.error?.message || 'Operation failed');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project? All tasks within it will also be deleted.')) return;
    try {
      await removeProject(id);
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Failed to delete project');
    }
  };

  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: '2rem 1.5rem' }} id="projects-page">
        <div className="page-header">
          <h1 className="page-title">Projects</h1>
          <button className="btn btn-primary" onClick={openCreateModal} id="create-project-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Project
          </button>
        </div>

        <SearchFilterBar
          searchValue={search}
          onSearchChange={handleSearch}
          filters={[
            {
              name: 'status',
              value: statusFilter,
              onChange: handleStatusFilter,
              placeholder: 'All Statuses',
              options: [
                { value: 'NOT_STARTED', label: 'Not Started' },
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
                { value: 'status-asc', label: 'Status' },
                { value: 'priority-desc', label: 'Priority (High to Low)' },
                { value: 'priority-asc', label: 'Priority (Low to High)' },
              ],
            },
          ]}
        />

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading projects...</p>
          </div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : projects.length === 0 ? (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
            </svg>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              {search || statusFilter ? 'No projects match your filters' : 'No projects yet'}
            </h3>
            <p>
              {search || statusFilter
                ? 'Try adjusting your search or filters'
                : 'Create your first project to get started'}
            </p>
            {!search && !statusFilter && (
              <button className="btn btn-primary" onClick={openCreateModal}>
                Create Project
              </button>
            )}
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        <ProjectModal
          isOpen={modalOpen}
          onClose={() => { setModalOpen(false); setEditingProject(null); }}
          onSubmit={handleSubmit}
          project={editingProject}
          loading={modalLoading}
        />

        {modalError && modalOpen && (
          <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 60 }}>
            <div className="alert alert-error animate-slide-up">{modalError}</div>
          </div>
        )}
      </main>
    </>
  );
};

export default ProjectsPage;
