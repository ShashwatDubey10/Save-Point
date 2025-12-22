import { useState, useEffect } from 'react';
import Button from './Button';

// Pre-generated particle positions for consistent renders
const PARTICLES = [
  { left: 12, top: 8, delay: 0.2, duration: 5.2 },
  { left: 87, top: 15, delay: 1.5, duration: 6.8 },
  { left: 45, top: 22, delay: 3.1, duration: 4.5 },
  { left: 23, top: 67, delay: 0.8, duration: 7.2 },
  { left: 78, top: 45, delay: 2.4, duration: 5.9 },
  { left: 56, top: 89, delay: 4.2, duration: 6.1 },
  { left: 34, top: 34, delay: 1.9, duration: 4.8 },
  { left: 91, top: 72, delay: 0.5, duration: 7.5 },
  { left: 8, top: 56, delay: 3.7, duration: 5.4 },
  { left: 67, top: 12, delay: 2.1, duration: 6.3 },
  { left: 19, top: 91, delay: 4.8, duration: 4.2 },
  { left: 82, top: 28, delay: 1.2, duration: 7.8 },
  { left: 41, top: 78, delay: 0.9, duration: 5.7 },
  { left: 95, top: 95, delay: 3.4, duration: 6.6 },
  { left: 5, top: 42, delay: 2.8, duration: 4.9 },
  { left: 73, top: 61, delay: 1.6, duration: 7.1 },
  { left: 28, top: 19, delay: 4.5, duration: 5.3 },
  { left: 59, top: 85, delay: 0.3, duration: 6.9 },
  { left: 16, top: 73, delay: 3.9, duration: 4.6 },
  { left: 84, top: 38, delay: 2.6, duration: 7.4 },
];

const HeroSection = () => {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollIndicator(window.scrollY < 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-dark-900 dark:to-dark-900">
      {/* Animated background orbs */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 dark:bg-primary-600/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary-500/8 dark:bg-primary-500/15 rounded-full blur-3xl animate-pulse-glow animation-delay-200" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-700/5 dark:bg-primary-700/10 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />
      <div
        className="absolute inset-0 z-0 opacity-0 dark:opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {PARTICLES.map((particle, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gray-400/30 dark:bg-white/20 rounded-full animate-float"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24">
        {/* Logo */}
        <div className="animate-fade-in-up mb-8">
          <img
            src="/SavePointLogo.png"
            alt="Save Point"
            className="h-32 sm:h-40 lg:h-48 mx-auto drop-shadow-2xl"
          />
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold text-gray-900 dark:text-white mb-8 leading-[1.1] tracking-tight animate-fade-in-up animation-delay-200">
          Turn Daily Actions Into{' '}
          <span className="gradient-text">
            Lasting Change
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-400">
          The gamified habit tracker that makes building routines feel like an adventure.
          Track progress, earn rewards, and watch yourself level up.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up animation-delay-600">
          <Button variant="primary" size="lg" href="/register" className="group">
            <span>Start Free Today</span>
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Button>
          <Button variant="secondary" size="lg" href="#features">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Watch Demo
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-3xl mx-auto animate-fade-in-up animation-delay-800">
          <div className="glass rounded-2xl p-6 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
            <div className="text-3xl sm:text-5xl font-bold gradient-text mb-2">10K+</div>
            <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Active Users</div>
          </div>
          <div className="glass rounded-2xl p-6 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
            <div className="text-3xl sm:text-5xl font-bold gradient-text mb-2">1M+</div>
            <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Habits Tracked</div>
          </div>
          <div className="glass rounded-2xl p-6 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
            <div className="text-3xl sm:text-5xl font-bold gradient-text mb-2">95%</div>
            <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Success Rate</div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      {showScrollIndicator && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 transition-opacity duration-500">
          <a href="#showcase" className="flex flex-col items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-white transition-colors">
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <div className="w-6 h-10 border-2 border-current rounded-full flex justify-center pt-2">
              <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" />
            </div>
          </a>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
