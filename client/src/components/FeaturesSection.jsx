const FeaturesSection = () => {
  const features = [
    {
      icon: '⚡',
      title: 'Gamified Progress',
      description: 'Earn XP, unlock achievements, and level up as you build consistency. Make habit building feel like a game.',
      gradient: 'from-amber-500 to-orange-600',
    },
    {
      icon: '📅',
      title: 'Monthly Overview',
      description: 'See your entire month at a glance. Instantly spot patterns, streaks, and areas that need attention.',
      gradient: 'from-primary-500 to-primary-700',
    },
    {
      icon: '🔥',
      title: 'Streak Tracking',
      description: 'Build momentum with streak counters. Watch your consistency grow and earn bonus rewards for long streaks.',
      gradient: 'from-rose-500 to-pink-600',
    },
    {
      icon: '📊',
      title: 'Smart Analytics',
      description: 'Dive deep into your data with beautiful charts. Understand when you perform best and optimize your routines.',
      gradient: 'from-violet-500 to-purple-600',
    },
    {
      icon: '✍️',
      title: 'Daily Reflections',
      description: 'End each day with intention. Capture mood, wins, and thoughts to build a meaningful journal alongside habits.',
      gradient: 'from-cyan-500 to-teal-600',
    },
    {
      icon: '☁️',
      title: 'Cloud Sync',
      description: 'Your data syncs instantly across all devices. Start on your phone, continue on desktop, never lose progress.',
      gradient: 'from-sky-500 to-blue-600',
    },
  ];

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-dark-900" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-600/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-1.5 glass rounded-full text-primary-400 text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Everything You Need to{' '}
            <span className="gradient-text">Succeed</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Powerful tools designed to keep you motivated, track your progress, and turn goals into habits.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative glass rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2"
            >
              {/* Hover glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />

              {/* Icon */}
              <div className={`relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} text-3xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg`}>
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="relative text-xl font-bold text-white mb-3 group-hover:text-primary-400 transition-colors">
                {feature.title}
              </h3>
              <p className="relative text-gray-400 leading-relaxed">
                {feature.description}
              </p>

              {/* Arrow indicator */}
              <div className="relative mt-6 flex items-center text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm font-medium">Learn more</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom highlight */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-4 glass rounded-full px-6 py-3">
            <div className="flex -space-x-2">
              {['🧑‍💻', '👩‍🎨', '👨‍🔬', '👩‍💼'].map((emoji, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center text-sm border-2 border-dark-800">
                  {emoji}
                </div>
              ))}
            </div>
            <span className="text-gray-300">
              Join <span className="text-white font-semibold">10,000+</span> people building better habits
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
