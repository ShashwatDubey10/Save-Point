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
        </div>
      </div>
    </div>
  );
};

export default AppNavigation;
