import useScrollAnimation from '../hooks/useScrollAnimation';

const CTASection = () => {
  const [sectionRef, isVisible] = useScrollAnimation({ threshold: 0.1 });

  return (
    <section
      ref={sectionRef}
      className={`py-24 relative overflow-hidden transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-dark-900" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main CTA Card */}
        <div className="relative">
          {/* Animated background glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 rounded-3xl blur-xl opacity-30 animate-gradient" />

          {/* Card content */}
          <div className="relative glass rounded-3xl p-8 sm:p-12 lg:p-16 text-center glow-primary-intense overflow-hidden">
            {/* Floating orbs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl animate-pulse-glow" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-600/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />

            {/* Content */}
            <div className="relative z-10">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-4xl mb-8 shadow-lg">
                🚀
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Ready to{' '}
                <span className="gradient-text">Level Up</span>
                {' '}Your Life?
              </h2>

              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join thousands who've transformed their habits. Start your journey today — completely free with access to all features, no credit card required.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
                <a
                  href="/register"
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-dark-900 font-bold text-lg rounded-xl hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                >
                  Start Free Today
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
                <a
                  href="/login"
                  className="inline-flex items-center gap-2 px-8 py-4 text-white font-semibold text-lg hover:text-primary-400 transition-colors"
                >
                  Already a member? Sign in
                </a>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center justify-center gap-8">
                {[
                  { icon: '✓', text: 'Free forever' },
                  { icon: '✓', text: 'All features included' },
                  { icon: '✓', text: 'No credit card needed' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-400">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">
                      {item.icon}
                    </span>
                    <span className="text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Social proof */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm mb-4">Trusted by habit builders worldwide</p>
          <div className="flex items-center justify-center gap-2">
            <div className="flex -space-x-3">
              {['😊', '🙂', '😄', '🤩', '😎'].map((emoji, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-dark-700 border-2 border-dark-900 flex items-center justify-center text-lg"
                >
                  {emoji}
                </div>
              ))}
            </div>
            <div className="ml-4 text-left">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-400 text-sm">4.9/5 from 2,000+ reviews</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
