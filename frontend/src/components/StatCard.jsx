const StatCard = ({ label, value, icon, color = 'primary', delay = 0 }) => {
  const colorMap = {
    primary: { gradient: 'linear-gradient(135deg, rgba(108, 92, 231, 0.15), rgba(108, 92, 231, 0.05))', border: 'rgba(108, 92, 231, 0.2)', text: '#a29bfe', glow: 'rgba(108, 92, 231, 0.15)' },
    success: { gradient: 'linear-gradient(135deg, rgba(0, 184, 148, 0.15), rgba(0, 184, 148, 0.05))', border: 'rgba(0, 184, 148, 0.2)', text: '#55efc4', glow: 'rgba(0, 184, 148, 0.15)' },
    warning: { gradient: 'linear-gradient(135deg, rgba(253, 203, 110, 0.15), rgba(253, 203, 110, 0.05))', border: 'rgba(253, 203, 110, 0.2)', text: '#fdcb6e', glow: 'rgba(253, 203, 110, 0.15)' },
    danger: { gradient: 'linear-gradient(135deg, rgba(255, 118, 117, 0.15), rgba(255, 118, 117, 0.05))', border: 'rgba(255, 118, 117, 0.2)', text: '#ff7675', glow: 'rgba(255, 118, 117, 0.15)' },
    accent: { gradient: 'linear-gradient(135deg, rgba(0, 206, 201, 0.15), rgba(0, 206, 201, 0.05))', border: 'rgba(0, 206, 201, 0.2)', text: '#00cec9', glow: 'rgba(0, 206, 201, 0.15)' },
    purple: { gradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(139, 92, 246, 0.05))', border: 'rgba(139, 92, 246, 0.2)', text: '#a78bfa', glow: 'rgba(139, 92, 246, 0.15)' },
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
