import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/features', label: 'Features' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 backdrop-blur-xl border-b border-white/5 h-20 flex items-center px-6 lg:px-12">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="text-3xl font-display font-bold gradient-text tracking-tight">
          Joblytic.
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(link => (
            <NavLink 
              key={link.to} 
              to={link.to}
              className={({ isActive }) => `text-sm font-medium transition-colors ${isActive ? 'text-brand-accent' : 'text-text-muted hover:text-text-main'}`}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <Link to="/dashboard" className="btn-primary text-sm py-2 px-6 shadow-glow">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-text-muted hover:text-text-main transition-colors">
                Log in
              </Link>
              <Link to="/register" className="btn-primary text-sm py-2 px-6 shadow-glow">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-text-muted hover:text-text-main"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-0 right-0 bg-dark-bg/95 backdrop-blur-xl border-b border-white/5 p-6 flex flex-col gap-4 md:hidden shadow-xl"
          >
            {links.map(link => (
              <NavLink 
                key={link.to} 
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => `text-lg font-medium transition-colors ${isActive ? 'text-brand-accent' : 'text-text-muted hover:text-text-main'}`}
              >
                {link.label}
              </NavLink>
            ))}
            <div className="h-px bg-white/10 my-2" />
            {user ? (
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="btn-primary text-center py-3">
                Go to Dashboard
              </Link>
            ) : (
              <div className="flex flex-col gap-3">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn-outline text-center py-3">
                  Log in
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn-primary text-center py-3">
                  Get Started
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
