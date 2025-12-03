import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AppHeader = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-900/95 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center hover:opacity-80 transition-opacity cursor-pointer">
            <img src="/SavePointLogoHeader.png" alt="Save Point" className="h-12 w-auto" />
          </Link>

          {/* Right Side - Stats & User Menu */}
          <div className="flex items-center gap-2">
            {/* Level & XP Progress - Desktop */}
            <div className="hidden lg:flex items-center glass px-4 py-2.5 rounded-xl h-[45px] cursor-pointer" title={`${xpToNextLevel} XP to Level ${level + 1}`}>
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
            <Link to="/profile" className="flex items-center gap-3 glass px-3 py-2.5 rounded-xl hover:bg-white/10 transition-all h-[45px] cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-medium text-white leading-none">{user?.username || 'User'}</div>
              </div>
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 glass px-4 py-2.5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition-colors h-[45px] cursor-pointer"
              title="Logout"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AppHeader;
