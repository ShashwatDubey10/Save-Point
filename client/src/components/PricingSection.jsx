import useScrollAnimation from '../hooks/useScrollAnimation';

const PricingSection = () => {
  const [sectionRef, isVisible] = useScrollAnimation({ threshold: 0.1 });

  const plans = [
    {
      name: 'Free Forever',
      price: '$0',
      period: 'forever',
      description: 'All features included, completely free',
      features: [
        'Unlimited habits',
        'Advanced analytics',
        'Task management',
        'Notes & Calendar',
        'Gamification & XP system',
        'Achievement badges',
        'Dark & Light modes',
        'Cloud sync',
        'Export your data',
        'Mobile responsive',
      ],
      cta: 'Get Started',
      popular: true,
      gradient: 'from-primary-500 to-primary-700',
    },
  ];

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className={`py-24 relative overflow-hidden transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gray-100 dark:bg-dark-800" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary-600/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 glass rounded-full text-primary-400 text-sm font-medium mb-4">
            Pricing
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Simple, <span className="gradient-text">Free</span> Pricing
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            No hidden fees, no subscriptions, no credit card required. Everything is completely free, forever.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="max-w-xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="relative group"
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                  <span className="inline-block px-4 py-1 bg-gradient-to-r from-primary-500 to-primary-700 text-white text-sm font-semibold rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div
                className={`relative glass rounded-2xl p-8 h-full flex flex-col ${
                  plan.popular
                    ? 'ring-2 ring-primary-500 bg-gray-50 dark:bg-white/5'
                    : 'hover:bg-gray-50 dark:hover:bg-white/5'
                } transition-all duration-300`}
              >
                {/* Glow effect for popular plan */}
                {plan.popular && (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-primary-700/10 rounded-2xl" />
                )}

                {/* Plan name */}
                <div className="relative mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="relative mb-6">
                  <div className="flex items-end gap-2">
                    <span className="text-5xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                    <span className="text-gray-600 dark:text-gray-400 pb-2">/ {plan.period}</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="relative space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <svg
                        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          plan.popular ? 'text-primary-400' : 'text-green-400'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <a
                  href="/register"
                  className={`relative block text-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-primary-500 to-primary-700 text-white hover:shadow-lg hover:shadow-primary-500/50 hover:scale-105'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            <span className="text-gray-900 dark:text-white font-semibold">100% Free.</span> No trials, no subscriptions, no surprises.
            Start building better habits today!
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
