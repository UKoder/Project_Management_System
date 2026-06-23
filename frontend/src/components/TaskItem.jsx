const statusConfig = {
  PENDING: { label: 'Pending', class: 'badge-pending' },
  IN_PROGRESS: { label: 'In Progress', class: 'badge-in-progress' },
  COMPLETED: { label: 'Completed', class: 'badge-completed' },
};

const priorityConfig = {
  LOW: { label: 'Low', class: 'badge-low' },
  MEDIUM: { label: 'Medium', class: 'badge-medium' },
  HIGH: { label: 'High', class: 'badge-high' },
};

const TaskItem = ({ task, onEdit, onDelete, onStatusChange }) => {
  const status = statusConfig[task.status] || statusConfig.PENDING;
  const priority = priorityConfig[task.priority] || priorityConfig.MEDIUM;

  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED';

  return (
    <div
      className="neu-card-flat animate-fade-in"
      style={{
        padding: '1rem 1.25rem',
        opacity: task.status === 'COMPLETED' ? 0.65 : 1,
      }}
      id={`task-item-${task.id}`}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Complete checkbox */}
        <button
          onClick={() => onStatusChange(task.id, task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED')}
          style={{
            width: '1.375rem',
            height: '1.375rem',
            borderRadius: '50%',
            border: task.status === 'COMPLETED'
              ? '2px solid var(--color-success)'
              : '2px solid var(--text-muted)',
            background: task.status === 'COMPLETED'
              ? 'var(--color-success)'
              : 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'all 0.25s',
            boxShadow: task.status === 'COMPLETED'
              ? '0 2px 8px rgba(0, 184, 148, 0.3)'
              : 'var(--neu-convex-sm)',
          }}
          title={task.status === 'COMPLETED' ? 'Mark as pending' : 'Mark as completed'}
          id={`complete-task-${task.id}`}
        >
          {task.status === 'COMPLETED' && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{
              fontWeight: 600,
              fontSize: '0.9375rem',
              color: 'var(--text-primary)',
              textDecoration: task.status === 'COMPLETED' ? 'line-through' : 'none',
            }}>
              {task.name}
            </span>
            <span className={`badge ${priority.class}`}>{priority.label}</span>
            <span className={`badge ${status.class}`}>{status.label}</span>
          </div>

          {task.description && (
            <p style={{
              fontSize: '0.8125rem',
              color: 'var(--text-muted)',
              marginTop: '0.25rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {task.description}
            </p>
          )}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.375rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>Created: {formatDate(task.createdAt)}</span>
          </div>
        </div>

        {/* Due date */}
        {task.dueDate && (
          <span style={{
            fontSize: '0.8125rem',
            color: isOverdue ? 'var(--color-danger)' : 'var(--text-muted)',
            fontWeight: isOverdue ? 700 : 500,
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {formatDate(task.dueDate)}
          </span>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }}>
          <button
            className="btn btn-icon btn-secondary"
            onClick={() => onEdit(task)}
            title="Edit task"
            id={`edit-task-${task.id}`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            className="btn btn-icon btn-danger"
            onClick={() => onDelete(task.id)}
            title="Delete task"
            id={`delete-task-${task.id}`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
