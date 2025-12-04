import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const AchievementAnimation = ({ isOpen, onClose, achievement }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // Auto close after 5 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 500);
  };

  if (!isOpen && !isAnimating) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-500 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/95 via-dark-900/95 to-primary-900/95 backdrop-blur-md">
        {/* Particle Effects */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-primary-400/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>

        {/* Radial Glow */}
        <div className="absolute inset-0 bg-gradient-radial from-primary-500/20 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div
        className={`relative z-10 text-center px-8 transition-all duration-700 ${
          isAnimating
            ? 'scale-100 opacity-100 translate-y-0'
            : 'scale-50 opacity-0 translate-y-20'
        }`}
        style={{
          transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Trophy/Badge Container */}
        <div className="relative mb-8">
          {/* Rotating Rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 border-4 border-primary-500/30 rounded-full animate-spin-slow" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-48 h-48 border-4 border-purple-500/30 rounded-full animate-spin-slow-reverse"
              style={{ animationDelay: '0.5s' }}
            />
          </div>

          {/* Achievement Icon/Badge */}
          <div className="relative z-10 flex items-center justify-center">
            <div
              className={`w-40 h-40 rounded-full bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 flex items-center justify-center shadow-2xl shadow-primary-500/50 transition-all duration-1000 ${
                isAnimating ? 'animate-bounce-slow scale-100' : 'scale-0'
              }`}
            >
              <span className="text-7xl drop-shadow-lg animate-pulse-slow">
                {achievement?.icon || '🏆'}
              </span>
            </div>
          </div>

          {/* Sparkles */}
          {[...Array(12)].map((_, i) => (
            <div
              key={`sparkle-${i}`}
              className="absolute w-3 h-3 bg-yellow-300 rounded-full animate-sparkle"
              style={{
                left: `${50 + 40 * Math.cos((i * Math.PI * 2) / 12)}%`,
                top: `${50 + 40 * Math.sin((i * Math.PI * 2) / 12)}%`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>

        {/* Text Content */}
        <div
          className={`transition-all duration-700 delay-300 ${
            isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-5xl sm:text-6xl font-bold text-white mb-4 drop-shadow-lg animate-text-glow">
            Achievement Unlocked!
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-primary-300 mb-4">
            {achievement?.title || 'New Achievement'}
          </h3>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            {achievement?.description || 'You\'ve accomplished something amazing!'}
          </p>

          {/* XP/Reward Display */}
          {achievement?.xpReward && (
            <div className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm rounded-full border-2 border-primary-400/50 animate-pulse-glow">
              <span className="text-2xl">⭐</span>
              <span className="text-2xl font-bold text-yellow-300">
                +{achievement.xpReward} XP
              </span>
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className={`mt-12 px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 ${
            isAnimating ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '1s' }}
        >
          Continue
        </button>
      </div>
    </div>,
    document.body
  );
};

export default AchievementAnimation;
