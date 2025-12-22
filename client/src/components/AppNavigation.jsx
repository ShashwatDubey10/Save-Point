import { Link, useLocation } from 'react-router-dom';

const AppNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: '/dashboard', icon: '🏠', label: 'Dashboard' },
    { path: '/habits', icon: '📚', label: 'Habits' },
    { path: '/tasks', icon: '📋', label: 'Tasks' },
    { path: '/notes', icon: '📝', label: 'Notes' },
    { path: '/calendar', icon: '📅', label: 'Calendar' },
    { path: '/levels', icon: '🏆', label: 'Levels' },
    { path: '/streaks', icon: '🔥', label: 'Streaks' },
  ];

  // Filter out the current page
  const filteredNavItems = navItems.filter(item => item.path !== currentPath);

  return (
<<<<<<< Updated upstream
    <div className="fixed top-20 left-0 right-0 z-40 bg-dark-800/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-1 py-1.5 overflow-x-auto">
          {filteredNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="px-3 py-1.5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap text-xs font-medium cursor-pointer"
            >
              <span className="text-sm">{item.icon}</span>
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          ))}
=======
    <>
      {/* Mobile Bottom Navigation - Touch-friendly */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/98 dark:bg-dark-900/98 backdrop-blur-lg border-t border-gray-200 dark:border-white/10 safe-padding-bottom">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.slice(0, 5).map((item) => {
            const isActive = currentPath === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex flex-col items-center justify-center gap-1
                  touch-target rounded-xl transition-all duration-200
                  ${isActive
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-500/10'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                  }
                `}
              >
                <span className={`text-xl ${isActive ? 'scale-110' : ''} transition-transform`}>
                  {item.icon}
                </span>
                <span className={`text-[10px] sm:text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop Top Navigation - Horizontal scroll */}
      <div className="hidden lg:block fixed top-14 sm:top-16 lg:top-20 left-0 right-0 z-40 bg-gray-100/90 dark:bg-dark-800/90 backdrop-blur-md border-b border-gray-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-1 py-1.5 overflow-x-auto">
            {desktopNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="px-3 py-1.5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap text-xs font-medium"
              >
                <span className="text-sm">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
>>>>>>> Stashed changes
        </div>
      </div>
    </div>
  );
};

export default AppNavigation;
