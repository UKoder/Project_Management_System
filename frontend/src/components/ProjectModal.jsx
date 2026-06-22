import { useState, useEffect } from 'react';

const ProjectModal = ({ isOpen, onClose, onSubmit, project = null, loading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'NOT_STARTED',
    priority: 'MEDIUM',
    startDate: '',
    endDate: '',
  });
  const [errors, setErrors] = useState({});

  const isEdit = !!project;

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        status: project.status || 'NOT_STARTED',
        priority: project.priority || 'MEDIUM',
        startDate: project.startDate ? project.startDate.split('T')[0] : '',
        endDate: project.endDate ? project.endDate.split('T')[0] : '',
      });
    } else {
      setFormData({ name: '', description: '', status: 'NOT_STARTED', priority: 'MEDIUM', startDate: '', endDate: '' });
    }
    setErrors({});
  }, [project, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Project name is required';
    if (formData.startDate && formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = { ...formData };
    if (!data.startDate) delete data.startDate;
    if (!data.endDate) delete data.endDate;

    onSubmit(data);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} id="project-modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} id="project-modal">
        <div className="modal-header">
          <h2>{isEdit ? 'Edit Project' : 'Create Project'}</h2>
          <button className="btn btn-icon btn-secondary" onClick={onClose} id="close-project-modal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label" htmlFor="project-name">Project Name *</label>
              <input
                id="project-name"
                className="form-input"
                type="text"
                placeholder="Enter project name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="project-description">Description</label>
              <textarea
                id="project-description"
                className="form-textarea"
                placeholder="Describe your project..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="project-status">Status</label>
                <select
                  id="project-status"
                  className="form-select"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="NOT_STARTED">Not Started</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="project-priority">Priority</label>
                <select
                  id="project-priority"
                  className="form-select"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="project-start-date">Start Date</label>
                <input
                  id="project-start-date"
                  className="form-input"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="project-end-date">End Date</label>
                <input
                  id="project-end-date"
                  className="form-input"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
                {errors.endDate && <span className="form-error">{errors.endDate}</span>}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading} id="submit-project">
              {loading && <span className="spinner spinner-sm"></span>}
              {isEdit ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;
