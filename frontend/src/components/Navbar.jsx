import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: DashboardIcon },
    { to: '/projects', label: 'Projects', icon: ProjectsIcon },
    { to: '/tasks', label: 'Tasks', icon: TasksIcon },
  ];

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-container container">
        <Link to="/" className="navbar-brand">
          <div className="navbar-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />
            </svg>
          </div>
          <span className="navbar-title">AeroPlan</span>
        </Link>

        <div className="navbar-links">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`navbar-link ${location.pathname === to ? 'active' : ''}`}
              id={`nav-${label.toLowerCase()}`}
            >
              <Icon />
              <span>{label}</span>
            </Link>
          ))}
        </div>

        <div className="navbar-user">
          <div className="navbar-avatar" id="user-avatar">
            {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <span className="navbar-username">{user?.fullName || 'User'}</span>
          <button
            onClick={handleLogout}
            className="btn btn-secondary btn-sm"
            id="logout-btn"
          >
            <LogoutIcon />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <style>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 40;
          background: var(--neu-surface);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25), 0 1px 0 var(--border-color);
        }
        .navbar-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 4rem;
          height: auto;
          padding: 0.5rem 1.5rem;
          gap: 2rem;
        }
        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          color: var(--text-primary);
        }
        .navbar-logo {
          width: 2.25rem;
          height: 2.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--gradient-primary);
          border-radius: var(--radius-sm);
          color: white;
          box-shadow: 0 4px 12px rgba(var(--color-primary-rgb), 0.25);
        }
        .navbar-logo svg {
          width: 1.15rem;
          height: 1.15rem;
        }
        .navbar-title {
          font-size: 1.25rem;
          font-weight: 800;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.02em;
        }
        .navbar-links {
          display: flex;
          gap: 0.375rem;
        }
        .navbar-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-md);
          color: var(--text-muted);
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 600;
          transition: all 0.25s;
        }
        .navbar-link:hover {
          color: var(--text-primary);
          background: var(--neu-surface-alt);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
        .navbar-link.active {
          color: var(--color-primary-light);
          background: rgba(var(--color-primary-rgb), 0.12);
        }
        .navbar-link svg {
          width: 1.125rem;
          height: 1.125rem;
        }
        .navbar-user {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .navbar-avatar {
          width: 2.125rem;
          height: 2.125rem;
          border-radius: 50%;
          background: var(--gradient-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 700;
          color: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        .navbar-username {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-secondary);
        }
        @media (max-width: 768px) {
          .navbar-username { display: none; }
          .navbar-link span { display: none; }
          .navbar-container {
            gap: 1rem;
            padding: 0.5rem 1rem;
          }
        }
        @media (max-width: 480px) {
          .navbar-container {
            gap: 0.5rem;
          }
          .navbar-logo {
            width: 2rem;
            height: 2rem;
          }
          .navbar-logo svg {
            width: 1rem;
            height: 1rem;
          }
          .navbar-link {
            padding: 0.5rem 0.75rem;
          }
        }
        @media (max-width: 400px) {
          .navbar-title { display: none; }
        }
      `}</style>
    </nav>
  );
};

const DashboardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const ProjectsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const TasksIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 11l3 3L22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);

export default Navbar;
