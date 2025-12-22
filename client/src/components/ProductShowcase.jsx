import useScrollAnimation from '../hooks/useScrollAnimation';

const ProductShowcase = () => {
  const [sectionRef, isVisible] = useScrollAnimation({ threshold: 0.1 });
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const currentDay = 23;

  const habits = [
    { name: 'Morning Exercise', icon: '🏃', completions: [1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0] },
    { name: 'Read 30 mins', icon: '📚', completions: [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    { name: 'Drink Water', icon: '💧', completions: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0] },
    { name: 'Meditate', icon: '🧘', completions: [0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    { name: 'No Social Media', icon: '📵', completions: [1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  ];

  const getStatusColor = (status, dayIndex) => {
    if (dayIndex >= currentDay) return 'bg-gray-300 dark:bg-dark-700/50';
    if (status === 1) return 'bg-emerald-500 shadow-emerald-500/50 shadow-sm';
    return 'bg-rose-500/70';
  };

  const stats = [
    { value: '87%', label: 'Completion', color: 'text-emerald-400', icon: '📈' },
    { value: '12', label: 'Day Streak', color: 'text-orange-400', icon: '🔥' },
    { value: '2,450', label: 'XP Earned', color: 'text-primary-400', icon: '⭐' },
    { value: '5', label: 'Badges', color: 'text-purple-400', icon: '🏆' },
  ];

  return (
    <section
      id="showcase"
      ref={sectionRef}
      className={`py-24 relative overflow-hidden transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 glass rounded-full text-primary-400 text-sm font-medium mb-4">
            Product Preview
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Your Progress,{' '}
            <span className="gradient-text">Visualized</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            See your entire month at a glance. Track patterns, build streaks, and celebrate every win.
          </p>
        </div>

        {/* Main Showcase Card */}
        <div className="relative max-w-5xl mx-auto">
          {/* Glow effect behind card */}
          <div className="absolute -inset-4 bg-gradient-to-r from-primary-600/20 via-primary-500/10 to-primary-600/20 rounded-3xl blur-2xl" />

          {/* Card */}
          <div className="relative glass rounded-3xl p-8 glow-primary">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">November 2024</h3>
                <p className="text-gray-600 dark:text-gray-400">Your habit tracking dashboard</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Done</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/70" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Missed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-dark-700/50" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Upcoming</span>
                </div>
              </div>
            </div>

            {/* Habit Grid */}
            <div className="overflow-x-auto -mx-2 px-2">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left text-sm font-semibold text-gray-700 dark:text-gray-300 pb-4 pr-4 min-w-[160px]">
                      Habit
                    </th>
                    {days.map((day) => (
                      <th
                        key={day}
                        className={`text-center text-xs font-medium pb-4 w-7 ${day === currentDay ? 'text-primary-400' : 'text-gray-500 dark:text-gray-500'}`}
                      >
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {habits.map((habit, habitIndex) => (
                    <tr key={habitIndex} className="group">
                      <td className="py-2 pr-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{habit.icon}</span>
                          <span className="text-sm text-gray-900 dark:text-white font-medium group-hover:text-primary-400 transition-colors">
                            {habit.name}
                          </span>
                        </div>
                      </td>
                      {habit.completions.map((status, dayIndex) => (
                        <td key={dayIndex} className="py-2">
                          <div
                            className={`w-5 h-5 rounded-md mx-auto ${getStatusColor(status, dayIndex)}
                              transition-all duration-200 hover:scale-125 cursor-pointer
                              ${dayIndex === currentDay - 1 ? 'ring-2 ring-primary-400 ring-offset-2 ring-offset-dark-800' : ''}`}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Stats Row */}
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="glass rounded-xl p-4 text-center hover:bg-gray-100 dark:hover:bg-white/10 transition-colors group cursor-pointer"
                >
                  <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{stat.icon}</div>
                  <div className={`text-2xl sm:text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature highlights below */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { icon: '🎯', title: 'Visual Tracking', desc: 'See your progress at a glance with intuitive color coding' },
            { icon: '🔥', title: 'Streak System', desc: 'Build momentum with consecutive day tracking' },
            { icon: '🏆', title: 'Earn Rewards', desc: 'Unlock badges and XP as you hit your goals' },
          ].map((item, i) => (
            <div key={i} className="text-center p-6 glass rounded-2xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
