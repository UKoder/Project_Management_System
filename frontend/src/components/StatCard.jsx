const StatCard = ({ label, value, icon, color = 'primary', delay = 0 }) => {
  const colorMap = {
    primary: { bg: 'rgba(99, 102, 241, 0.1)', border: 'rgba(99, 102, 241, 0.2)', text: '#818cf8' },
    success: { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.2)', text: '#34d399' },
    warning: { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.2)', text: '#fbbf24' },
    danger: { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.2)', text: '#f87171' },
    accent: { bg: 'rgba(6, 182, 212, 0.1)', border: 'rgba(6, 182, 212, 0.2)', text: '#22d3ee' },
    purple: { bg: 'rgba(139, 92, 246, 0.1)', border: 'rgba(139, 92, 246, 0.2)', text: '#a78bfa' },
  };

  const c = colorMap[color] || colorMap.primary;

  return (
    <div
      className="glass-card"
      style={{
        padding: '1.5rem',
        animationDelay: `${delay}ms`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {label}
          </p>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: c.text, lineHeight: 1 }}>
            {value}
          </p>
        </div>
        <div style={{
          width: '2.75rem',
          height: '2.75rem',
          borderRadius: 'var(--radius-md)',
          background: c.bg,
          border: `1px solid ${c.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: c.text,
        }}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
