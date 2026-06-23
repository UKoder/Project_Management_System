const StatCard = ({ label, value, icon, color = 'primary', delay = 0 }) => {
  const colorMap = {
    primary: { gradient: 'linear-gradient(135deg, rgba(var(--color-primary-rgb), 0.15), rgba(var(--color-primary-rgb), 0.05))', border: 'rgba(var(--color-primary-rgb), 0.2)', text: 'var(--color-primary-light)', glow: 'rgba(var(--color-primary-rgb), 0.15)' },
    success: { gradient: 'linear-gradient(135deg, rgba(var(--color-success-rgb), 0.15), rgba(var(--color-success-rgb), 0.05))', border: 'rgba(var(--color-success-rgb), 0.2)', text: 'var(--color-success-light)', glow: 'rgba(var(--color-success-rgb), 0.15)' },
    warning: { gradient: 'linear-gradient(135deg, rgba(var(--color-warning-rgb), 0.15), rgba(var(--color-warning-rgb), 0.05))', border: 'rgba(var(--color-warning-rgb), 0.2)', text: 'var(--color-warning-light)', glow: 'rgba(var(--color-warning-rgb), 0.15)' },
    danger: { gradient: 'linear-gradient(135deg, rgba(var(--color-danger-rgb), 0.15), rgba(var(--color-danger-rgb), 0.05))', border: 'rgba(var(--color-danger-rgb), 0.2)', text: 'var(--color-danger-light)', glow: 'rgba(var(--color-danger-rgb), 0.15)' },
    accent: { gradient: 'linear-gradient(135deg, rgba(var(--color-accent-rgb), 0.15), rgba(var(--color-accent-rgb), 0.05))', border: 'rgba(var(--color-accent-rgb), 0.2)', text: 'var(--color-accent-light)', glow: 'rgba(var(--color-accent-rgb), 0.15)' },
    purple: { gradient: 'linear-gradient(135deg, rgba(var(--color-secondary-rgb), 0.15), rgba(var(--color-secondary-rgb), 0.05))', border: 'rgba(var(--color-secondary-rgb), 0.2)', text: 'var(--color-secondary-light)', glow: 'rgba(var(--color-secondary-rgb), 0.15)' },
  };

  const c = colorMap[color] || colorMap.primary;

  return (
    <div
      className="neu-card"
      style={{
        padding: '1.5rem',
        animationDelay: `${delay}ms`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle gradient overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: `linear-gradient(90deg, ${c.text}, transparent)`,
        opacity: 0.6,
        borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
      }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {label}
          </p>
          <p style={{ fontSize: '2rem', fontWeight: 800, color: c.text, lineHeight: 1, letterSpacing: '-0.02em' }}>
            {value}
          </p>
        </div>
        <div style={{
          width: '2.75rem',
          height: '2.75rem',
          borderRadius: 'var(--radius-md)',
          background: c.gradient,
          border: `1px solid ${c.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: c.text,
          boxShadow: `0 4px 12px ${c.glow}`,
        }}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
