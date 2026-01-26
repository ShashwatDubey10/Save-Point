import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const AppHeader = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const level = user?.gamification?.level || 1;
  const totalXP = user?.gamification?.points || 0;
  const xpForNextLevel = Math.pow(level, 2) * 100 - Math.pow(level - 1, 2) * 100;
  const pointsInLevel = totalXP - Math.pow(level - 1, 2) * 100;
  const xpProgress = (pointsInLevel / xpForNextLevel) * 100;
  const xpToNextLevel = Math.max(0, xpForNextLevel - pointsInLevel);

  return (
    <>
      {/* Mobile-first header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-900/95 backdrop-blur-lg border-b border-white/10 safe-padding-top">
        <div className="mx-auto px-3 sm:px-4 lg:px-6 max-w-7xl">
          {/* Mobile Layout (default) */}
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">

            {/* Logo - Smaller on mobile */}
            <Link to="/dashboard" className="flex items-center hover:opacity-80 transition-opacity touch-target">
              <img
                src="/SavePointLogoHeader.png"
                alt="Save Point"
                className="h-8 sm:h-10 lg:h-12 w-auto"
                loading="eager"
                fetchpriority="high"
              />
            </Link>

            {/* Mobile: User Avatar + Menu Button */}
            <div className="flex items-center gap-2 lg:hidden">
              {/* User Avatar - Touch friendly */}
              <Link to="/profile" className="touch-target flex items-center justify-center">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
              </Link>

              {/* Hamburger Menu Button - Touch friendly */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="touch-target flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-lg glass hover:bg-white/10 transition-colors"
                aria-label="Menu"
              >
                <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {showMobileMenu ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

            {/* Desktop: Full stats & controls */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Level & XP Progress */}
              <div className="glass px-4 py-2.5 rounded-xl h-[45px] cursor-pointer" title={`${xpToNextLevel} XP to Level ${level + 1}`}>
                <div className="flex items-center gap-2 min-w-[180px]">
                  <span className="text-yellow-400 text-lg">⭐</span>
                  <div className="flex-1">
                    <div className="text-xs text-gray-400 mb-1">Level {level} • {xpToNextLevel} XP to next</div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500"
                        style={{ width: `${Math.min(xpProgress, 100)}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs font-bold text-yellow-400">{totalXP}</span>
                </div>
              </div>

              {/* User Avatar & Info */}
              <Link to="/profile" className="flex items-center gap-3 glass px-3 py-2.5 rounded-xl hover:bg-white/10 transition-all h-[45px]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <div className="text-sm font-medium text-white leading-none">{user?.username || 'User'}</div>
                </div>
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 glass px-4 py-2.5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition-colors h-[45px]"
                title="Logout"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          {showMobileMenu && (
            <div className="lg:hidden pb-3 pt-2 border-t border-white/10 mt-2 animate-fade-in-up">
              {/* Level & XP - Mobile */}
              <div className="glass rounded-xl p-3 mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-yellow-400 text-lg">⭐</span>
                  <div className="text-sm font-semibold text-white">Level {level}</div>
                  <span className="text-xs text-gray-400">• {totalXP} XP</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500"
                    style={{ width: `${Math.min(xpProgress, 100)}%` }}
                  />
                </div>
                <div className="text-xs text-gray-400 mt-1.5">{xpToNextLevel} XP to Level {level + 1}</div>
              </div>

              {/* User Info - Mobile */}
              <Link
                to="/profile"
                className="flex items-center gap-3 glass rounded-xl p-3 mb-2 hover:bg-white/10 transition-colors touch-target"
                onClick={() => setShowMobileMenu(false)}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{user?.username || 'User'}</div>
                  <div className="text-xs text-gray-400">View Profile</div>
                </div>
              </Link>

              {/* Logout - Mobile */}
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 glass rounded-xl p-3 hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors touch-target"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default AppHeader;
