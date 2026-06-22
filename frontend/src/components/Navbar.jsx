import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
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
          <span className="navbar-title">ProjectFlow</span>
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
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-color);
        }
        .navbar-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 4rem;
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
          width: 2rem;
          height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
          border-radius: var(--radius-sm);
          color: white;
        }
        .navbar-logo svg {
          width: 1.1rem;
          height: 1.1rem;
        }
        .navbar-title {
          font-size: 1.25rem;
          font-weight: 700;
          background: linear-gradient(135deg, var(--text-primary), var(--color-primary-light));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .navbar-links {
          display: flex;
          gap: 0.25rem;
        }
        .navbar-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s;
        }
        .navbar-link:hover {
          color: var(--text-primary);
          background: var(--bg-glass);
        }
        .navbar-link.active {
          color: var(--color-primary-light);
          background: rgba(99, 102, 241, 0.1);
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
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 700;
          color: white;
        }
        .navbar-username {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-secondary);
        }
        @media (max-width: 768px) {
          .navbar-username { display: none; }
          .navbar-link span { display: none; }
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
