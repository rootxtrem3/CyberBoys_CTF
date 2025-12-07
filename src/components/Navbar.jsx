import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, Trophy, User, Shield, LogOut, Code, Home } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, userData, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { path: '/arena', label: 'Arena', icon: Code },
    { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  if (userData?.isAdmin) {
    navItems.push({ path: '/admin', label: 'Admin', icon: Shield });
  }

  return (
    <nav className="bg-cyber-800 border-b border-neon-cyan/20 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={user ? '/arena' : '/'} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-neon-cyan to-neon-yellow rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-cyber-900" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-neon-cyan to-neon-yellow bg-clip-text text-transparent">
              Gelan CyberBoys
            </span>
          </Link>

          {/* Desktop Navigation */}
          {user && (
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      location.pathname === item.path
                        ? 'text-neon-cyan bg-neon-cyan/10'
                        : 'text-gray-300 hover:text-neon-cyan hover:bg-neon-cyan/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          )}

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {user && userData && (
              <div className="hidden md:flex items-center space-x-4">
                <div className="text-sm">
                  <span className="text-neon-yellow">Score: </span>
                  <span className="font-bold text-neon-cyan">{userData.score}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-300">Welcome, </span>
                  <span className="font-semibold text-neon-cyan">{userData.username}</span>
                </div>
              </div>
            )}

            {user && (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Logout</span>
              </button>
            )}

            {/* Mobile menu button */}
            {user && (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-300 hover:text-neon-cyan hover:bg-neon-cyan/10 transition-all duration-200"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && user && (
        <div className="md:hidden bg-cyber-800 border-t border-neon-cyan/20">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                    location.pathname === item.path
                      ? 'text-neon-cyan bg-neon-cyan/10'
                      : 'text-gray-300 hover:text-neon-cyan hover:bg-neon-cyan/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="px-3 py-2 text-sm">
              <div className="text-neon-yellow">Score: <span className="font-bold text-neon-cyan">{userData?.score || 0}</span></div>
              <div className="text-gray-300">Welcome, <span className="font-semibold text-neon-cyan">{userData?.username || 'User'}</span></div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;