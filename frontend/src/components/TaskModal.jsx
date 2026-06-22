import { useState, useEffect } from 'react';

const TaskModal = ({ isOpen, onClose, onSubmit, task = null, projectId = null, projects = [], loading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priority: 'MEDIUM',
    status: 'PENDING',
    dueDate: '',
    projectId: projectId || '',
  });
  const [errors, setErrors] = useState({});

  const isEdit = !!task;

  useEffect(() => {
    if (task) {
      setFormData({
        name: task.name || '',
        description: task.description || '',
        priority: task.priority || 'MEDIUM',
        status: task.status || 'PENDING',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        projectId: task.projectId || projectId || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        priority: 'MEDIUM',
        status: 'PENDING',
        dueDate: '',
        projectId: projectId || '',
      });
    }
    setErrors({});
  }, [task, isOpen, projectId]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Task name is required';
    if (!formData.projectId) newErrors.projectId = 'Project is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = { ...formData };
    if (!data.dueDate) delete data.dueDate;
    if (isEdit) delete data.projectId;

    onSubmit(data);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} id="task-modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} id="task-modal">
        <div className="modal-header">
          <h2>{isEdit ? 'Edit Task' : 'Add Task'}</h2>
          <button className="btn btn-icon btn-secondary" onClick={onClose} id="close-task-modal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {!projectId && projects && projects.length > 0 && (
              <div className="form-group">
                <label className="form-label" htmlFor="task-project">Project *</label>
                <select
                  id="task-project"
                  className="form-select"
                  value={formData.projectId}
                  disabled={isEdit}
                  onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                >
                  <option value="">Select a project</option>
                  {projects.map((proj) => (
                    <option key={proj.id} value={proj.id}>
                      {proj.name}
                    </option>
                  ))}
                </select>
                {errors.projectId && <span className="form-error">{errors.projectId}</span>}
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="task-name">Task Name *</label>
              <input
                id="task-name"
                className="form-input"
                type="text"
                placeholder="Enter task name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="task-description">Description</label>
              <textarea
                id="task-description"
                className="form-textarea"
                placeholder="Describe the task..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="task-priority">Priority</label>
                <select
                  id="task-priority"
                  className="form-select"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="task-status">Status</label>
                <select
                  id="task-status"
                  className="form-select"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="task-due-date">Due Date</label>
              <input
                id="task-due-date"
                className="form-input"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading} id="submit-task">
              {loading && <span className="spinner spinner-sm"></span>}
              {isEdit ? 'Update Task' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
