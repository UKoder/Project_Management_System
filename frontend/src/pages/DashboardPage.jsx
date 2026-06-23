import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../api/dashboard.api';
import StatCard from '../components/StatCard';
import Navbar from '../components/Navbar';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        setError(err.response?.data?.error?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const statusConfig = {
    NOT_STARTED: { label: 'Not Started', class: 'badge-not-started' },
    IN_PROGRESS: { label: 'In Progress', class: 'badge-in-progress' },
    COMPLETED: { label: 'Completed', class: 'badge-completed' },
    PENDING: { label: 'Pending', class: 'badge-pending' },
  };

  const priorityConfig = {
    LOW: { label: 'Low', class: 'badge-low' },
    MEDIUM: { label: 'Medium', class: 'badge-medium' },
    HIGH: { label: 'High', class: 'badge-high' },
  };

  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: '2rem 1.5rem' }} id="dashboard-page">
        <div className="page-header">
          <h1 className="page-title">Dashboard</h1>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading dashboard...</p>
          </div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : stats ? (
          <div className="animate-fade-in">
            {/* Stats Grid */}
            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
              <StatCard
                label="Total Projects"
                value={stats.projects.total}
                color="primary"
                icon={<FolderIcon />}
              />
              <StatCard
                label="In Progress"
                value={stats.projects.inProgress}
                color="accent"
                icon={<TrendingIcon />}
              />
              <StatCard
                label="Total Tasks"
                value={stats.tasks.total}
                color="purple"
                icon={<TaskIcon />}
              />
              <StatCard
                label="Completed Tasks"
                value={stats.tasks.completed}
                color="success"
                icon={<CheckIcon />}
              />
              <StatCard
                label="Pending Tasks"
                value={stats.tasks.pending}
                color="warning"
                icon={<ClockIcon />}
              />
              <StatCard
                label="Completed Projects"
                value={stats.projects.completed}
                color="success"
                icon={<AwardIcon />}
              />
            </div>

            {/* Two-column layout */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 20rem), 1fr))', gap: '1.5rem' }}>
              {/* Recent Projects */}
              <div className="neu-card" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                  background: 'var(--gradient-primary)', opacity: 0.6,
                  borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
                }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Recent Projects</h2>
                  <Link to="/projects" className="btn btn-secondary btn-sm" id="view-all-projects">
                    View All
                  </Link>
                </div>
                {stats.recentProjects.length === 0 ? (
                  <div className="empty-state" style={{ padding: '2rem' }}>
                    <p>No projects yet</p>
                    <Link to="/projects" className="btn btn-primary btn-sm">Create your first project</Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {stats.recentProjects.map((project) => {
                      const s = statusConfig[project.status] || statusConfig.NOT_STARTED;
                      return (
                        <Link
                          key={project.id}
                          to={`/projects/${project.id}`}
                          className="neu-card-inset"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.75rem 1rem',
                            textDecoration: 'none',
                            color: 'var(--text-primary)',
                            transition: 'all 0.25s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = 'var(--neu-convex-sm)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = 'var(--neu-concave)';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          <div>
                            <p style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{project.name}</p>
                            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                              {project._count?.tasks || 0} tasks
                            </p>
                          </div>
                          <span className={`badge ${s.class}`}>{s.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Upcoming Tasks */}
              <div className="neu-card" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                  background: 'var(--gradient-accent)', opacity: 0.6,
                  borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
                }} />
                <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem' }}>Upcoming Tasks</h2>
                {stats.upcomingTasks.length === 0 ? (
                  <div className="empty-state" style={{ padding: '2rem' }}>
                    <p>No upcoming tasks</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {stats.upcomingTasks.map((task) => {
                      const p = priorityConfig[task.priority] || priorityConfig.MEDIUM;
                      return (
                        <div
                          key={task.id}
                          className="neu-card-inset"
                          style={{
                            padding: '0.75rem 1rem',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{task.name}</span>
                            <span className={`badge ${p.class}`}>{p.label}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.375rem' }}>
                            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                              {task.project?.name}
                            </span>
                            {task.dueDate && (
                              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                                Due {formatDate(task.dueDate)}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </>
  );
};

// SVG Icon components
const FolderIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
  </svg>
);

const TrendingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
  </svg>
);

const TaskIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
  </svg>
);

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

const AwardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
);

export default DashboardPage;
