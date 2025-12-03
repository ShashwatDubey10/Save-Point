import useScrollAnimation from '../hooks/useScrollAnimation';

const HowItWorks = () => {
  const [sectionRef, isVisible] = useScrollAnimation({ threshold: 0.1 });
  const steps = [
    {
      number: '01',
      title: 'Create Your Habits',
      description: 'Set up the habits you want to track. Choose daily, weekly, or custom schedules with personalized reminders.',
      icon: '➕',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      number: '02',
      title: 'Track Daily',
      description: 'Check off habits as you complete them. Add notes, log your mood, and watch your streaks grow day by day.',
      icon: '✓',
      color: 'from-primary-500 to-primary-700',
    },
    {
      number: '03',
      title: 'Earn Rewards',
      description: 'Get XP for consistency. Unlock achievements, collect badges, and level up your profile as you progress.',
      icon: '⭐',
      color: 'from-amber-500 to-orange-600',
    },
    {
      number: '04',
      title: 'Level Up',
      description: 'Review analytics, spot patterns, and optimize your routines. Watch yourself transform over time.',
      icon: '📈',
      color: 'from-rose-500 to-pink-600',
    },
  ];

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className={`py-24 relative overflow-hidden transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-dark-800" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-1.5 glass rounded-full text-primary-400 text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Start in{' '}
            <span className="gradient-text">4 Simple Steps</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Transform your daily routines into powerful habits with our proven system.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line - desktop */}
          <div className="hidden lg:block absolute top-24 left-[12.5%] right-[12.5%] h-1">
            <div className="h-full bg-gradient-to-r from-emerald-500 via-primary-500 via-amber-500 to-rose-500 rounded-full opacity-30" />
            <div className="absolute inset-0 h-full bg-gradient-to-r from-emerald-500 via-primary-500 via-amber-500 to-rose-500 rounded-full blur-sm opacity-50" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                {/* Step number - floating */}
                <div className="flex justify-center mb-6">
                  <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-4xl shadow-lg group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300`}>
                    {step.icon}
                    {/* Glow effect */}
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.color} blur-xl opacity-50 group-hover:opacity-75 transition-opacity`} />
                  </div>
                </div>

                {/* Card */}
                <div className="glass rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-300 group-hover:-translate-y-2">
                  {/* Step indicator */}
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-gray-400 text-sm font-bold mb-4">
                    {step.number}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary-400 transition-colors">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow connector for mobile */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center my-4 lg:hidden">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <p className="text-gray-400 mb-6">Ready to start your journey?</p>
          <a
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-500 hover:to-primary-600 transition-all shadow-lg shadow-primary-600/25 hover:shadow-primary-600/40 hover:-translate-y-1"
          >
            Get Started Free
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
