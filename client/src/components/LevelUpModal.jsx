import { useEffect, useState } from 'react';

const LevelUpModal = ({ isOpen, onClose, newLevel, previousLevel }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      // Auto-close after 4 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-300 ${
        show ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
    >
      {/* Animated Background Overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-pulse-slow" />

      {/* Particle Effects Container */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-float-up"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div
        className={`relative z-10 transform transition-all duration-500 ${
          show ? 'scale-100 rotate-0' : 'scale-50 rotate-45'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 rounded-3xl blur-2xl opacity-50 animate-pulse" />

        {/* Card */}
        <div className="relative bg-gradient-to-br from-dark-800 to-dark-900 rounded-3xl border-2 border-yellow-400/50 p-12 text-center shadow-2xl min-w-[500px]">
          {/* Star Burst Animation */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full animate-ping" />
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Trophy Icon */}
            <div className="mb-6 animate-bounce-slow">
              <div className="text-8xl mb-4">🏆</div>
            </div>

            {/* Level Up Text */}
            <h2 className="text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 bg-clip-text text-transparent animate-shimmer">
              LEVEL UP!
            </h2>

            {/* Level Display */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="text-4xl font-bold text-gray-400">
                {previousLevel}
              </div>
              <div className="text-4xl text-yellow-400 animate-pulse">→</div>
              <div className="text-6xl font-bold text-yellow-400 animate-scale-up">
                {newLevel}
              </div>
            </div>

            {/* Subtitle */}
            <p className="text-xl text-gray-300 mb-8">
              You've reached Level {newLevel}!
            </p>

            {/* Stats Burst */}
            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="glass px-4 py-2 rounded-xl border border-yellow-400/30 animate-slide-in-left">
                <div className="text-sm text-gray-400">XP Boost</div>
                <div className="text-xl font-bold text-yellow-400">+10%</div>
              </div>
              <div className="glass px-4 py-2 rounded-xl border border-orange-400/30 animate-slide-in-right">
                <div className="text-sm text-gray-400">New Unlocks</div>
                <div className="text-xl font-bold text-orange-400">Available</div>
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={handleClose}
              className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-dark-900 font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-yellow-400/50"
            >
              Continue
            </button>

            {/* Tap to continue hint */}
            <p className="text-sm text-gray-500 mt-4 animate-pulse">
              Click anywhere to continue
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-4 -left-4 text-6xl animate-spin-slow">⭐</div>
          <div className="absolute -top-4 -right-4 text-6xl animate-spin-slow" style={{ animationDirection: 'reverse' }}>⭐</div>
          <div className="absolute -bottom-4 -left-4 text-6xl animate-spin-slow" style={{ animationDelay: '1s' }}>⭐</div>
          <div className="absolute -bottom-4 -right-4 text-6xl animate-spin-slow" style={{ animationDelay: '1s', animationDirection: 'reverse' }}>⭐</div>
        </div>
      </div>

      {/* Custom CSS Animations */}
      <style>{`
        @keyframes float-up {
          0% {
            transform: translateY(100vh);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh);
            opacity: 0;
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes scale-up {
          0% {
            transform: scale(0.5);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes slide-in-left {
          0% {
            transform: translateX(-100px);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slide-in-right {
          0% {
            transform: translateX(100px);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }

        .animate-float-up {
          animation: float-up linear infinite;
        }

        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animate-scale-up {
          animation: scale-up 0.6s ease-out;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.6s ease-out;
          animation-delay: 0.3s;
          animation-fill-mode: both;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.6s ease-out;
          animation-delay: 0.3s;
          animation-fill-mode: both;
        }

        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LevelUpModal;
