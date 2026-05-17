import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/jobs', label: 'Job Search', icon: '🔍' },
  { to: '/saved', label: 'Saved Jobs', icon: '⭐' },
  { to: '/interview-prep', label: 'Interview Prep', icon: '🎤' },
  { to: '/profile', label: 'Profile', icon: '👤' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="hidden lg:flex w-64 fixed top-20 bottom-0 left-0 bg-dark-bg border-r border-white/5 p-6 flex-col z-40">
      <div className="mb-10 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-widest text-text-muted">Menu</span>
      </div>

      <nav className="flex-1 space-y-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `relative flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'text-text-main font-medium'
                  : 'text-text-muted hover:text-text-main hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-brand-primary/10 border border-brand-primary/20 rounded-xl"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 text-lg">{item.icon}</span>
                <span className="relative z-10">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="pt-6 border-t border-white/5 mt-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-white font-bold font-display">
            {user?.name?.charAt(0) || user?.email?.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-text-main font-medium truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-text-muted truncate">{user?.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full btn-outline text-sm py-2 hover:border-red-500/50 hover:text-red-400 hover:bg-red-500/10"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
