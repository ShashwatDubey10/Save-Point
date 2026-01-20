/**
 * Shared Page Layout Components
 * Provides consistent structure, spacing, and styling across all pages
 */

import { Link } from 'react-router-dom';

/**
 * Standard Page Container
 * Provides consistent padding, max-width, and responsive behavior
 */
export const PageContainer = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen bg-dark-900`}>
      {children}
    </div>
  );
};

/**
 * Standard Main Content Area
 * Consistent padding and max-width across all pages
 */
export const MainContent = ({ children, className = '' }) => {
  return (
    <main className={`pt-14 sm:pt-20 lg:pt-32 pb-16 lg:pb-12 px-3 sm:px-4 lg:px-6 w-full sm:max-w-7xl sm:mx-auto ${className}`}>
      {children}
    </main>
  );
};

/**
 * Standard Page Header
 * Consistent title, description, and action button layout
 */
export const PageHeader = ({ 
  title, 
  description, 
  actionLabel, 
  actionLink, 
  actionOnClick,
  icon,
  className = '' 
}) => {
  return (
    <div className={`mb-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
            {icon && <span className="mr-2">{icon}</span>}
            {title}
          </h1>
          {description && (
            <p className="text-sm sm:text-base text-gray-400">
              {description}
            </p>
          )}
        </div>
        {(actionLabel && actionLink) && (
          <Link
            to={actionLink}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors text-sm sm:text-base"
          >
            {actionLabel} →
          </Link>
        )}
        {(actionLabel && actionOnClick) && (
          <button
            onClick={actionOnClick}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors text-sm sm:text-base"
          >
            {actionLabel} →
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * Standard Error Message
 * Consistent error display styling
 */
export const ErrorMessage = ({ message, className = '' }) => {
  if (!message) return null;
  
  return (
    <div className={`mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 ${className}`}>
      {message}
    </div>
  );
};

/**
 * Standard Loading Spinner
 * Consistent loading state
 */
export const LoadingSpinner = ({ className = '' }) => {
  return (
    <div className={`min-h-screen bg-dark-900 flex items-center justify-center ${className}`}>
      <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

/**
 * Standard Empty State
 * Consistent empty state display
 */
export const EmptyState = ({ 
  icon = '📅', 
  title, 
  description, 
  actionLabel, 
  actionLink,
  actionOnClick,
  className = '' 
}) => {
  return (
    <div className={`glass rounded-xl p-8 text-center ${className}`}>
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      {description && (
        <p className="text-gray-400 mb-4">{description}</p>
      )}
      {(actionLabel && actionLink) && (
        <Link
          to={actionLink}
          className="inline-block px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-colors"
        >
          {actionLabel}
        </Link>
      )}
      {(actionLabel && actionOnClick) && (
        <button
          onClick={actionOnClick}
          className="inline-block px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

/**
 * Standard Section Container
 * Consistent section styling with glass effect
 */
export const Section = ({ title, children, className = '' }) => {
  return (
    <div className={`glass rounded-xl p-4 sm:p-6 mb-6 ${className}`}>
      {title && (
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">{title}</h2>
      )}
      {children}
    </div>
  );
};

/**
 * Standard Card Component
 * Consistent card styling
 */
export const Card = ({ children, className = '', onClick, hover = true }) => {
  const baseClasses = 'glass rounded-xl p-4 sm:p-6';
  const hoverClasses = hover ? 'hover:bg-white/5 transition-colors' : '';
  
  if (onClick) {
    return (
      <div 
        className={`${baseClasses} ${hoverClasses} cursor-pointer ${className}`}
        onClick={onClick}
      >
        {children}
      </div>
    );
  }
  
  return (
    <div className={`${baseClasses} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
};

/**
 * Standard Button Styles
 */
export const Button = {
  primary: 'px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-colors text-sm sm:text-base',
  secondary: 'px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors text-sm sm:text-base',
  danger: 'px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl transition-colors text-sm sm:text-base',
  icon: 'w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors',
  small: 'px-3 py-1.5 text-xs bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors',
};

/**
 * Standard Filter/Control Bar
 * Consistent filter and control styling
 */
export const ControlBar = ({ children, className = '' }) => {
  return (
    <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6 ${className}`}>
      {children}
    </div>
  );
};

/**
 * Standard Grid Container
 * Responsive grid layout
 */
export const Grid = ({ children, cols = { mobile: 1, tablet: 2, desktop: 3 }, gap = 4, className = '' }) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };
  
  const gapClasses = {
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    6: 'gap-6',
  };
  
  const colsClass = gridCols[cols.desktop] || gridCols[3];
  const gapClass = gapClasses[gap] || gapClasses[4];
  
  return (
    <div className={`grid ${colsClass} ${gapClass} ${className}`}>
      {children}
    </div>
  );
};
