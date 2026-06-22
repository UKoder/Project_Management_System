import { Link } from 'react-router-dom';

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

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const status = statusConfig[project.status] || statusConfig.NOT_STARTED;
  const priority = priorityConfig[project.priority] || priorityConfig.MEDIUM;
  const taskCount = project._count?.tasks || 0;

  const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="glass-card animate-fade-in" id={`project-card-${project.id}`}>
      <div style={{ padding: '1.5rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ flex: 1 }}>
            <Link
              to={`/projects/${project.id}`}
              style={{ textDecoration: 'none', color: 'var(--text-primary)' }}
            >
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                marginBottom: '0.375rem',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--color-primary-light)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-primary)'}
              >
                {project.name}
              </h3>
            </Link>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className={`badge ${status.class}`}>{status.label}</span>
              <span className={`badge ${priority.class}`}>{priority.label}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        {project.description && (
          <p style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            marginBottom: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {project.description}
          </p>
        )}

        {/* Meta */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-color)',
          fontSize: '0.8125rem',
          color: 'var(--text-muted)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
              </svg>
              {taskCount} task{taskCount !== 1 ? 's' : ''}
            </span>
            {project.startDate && (
              <span>Start: {formatDate(project.startDate)}</span>
            )}
            {project.createdAt && (
              <span>Created: {formatDate(project.createdAt)}</span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button
              className="btn btn-icon btn-secondary"
              onClick={() => onEdit(project)}
              title="Edit project"
              id={`edit-project-${project.id}`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
            <button
              className="btn btn-icon btn-danger"
              onClick={() => onDelete(project.id)}
              title="Delete project"
              id={`delete-project-${project.id}`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
