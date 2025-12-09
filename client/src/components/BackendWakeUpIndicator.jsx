import { useState, useEffect } from 'react';

const BackendWakeUpIndicator = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [dots, setDots] = useState('');

  useEffect(() => {
    // Listen for backend wake-up events
    const handleWaking = (event) => {
      setVisible(true);
      setMessage(event.detail?.message || 'Backend is waking up...');
    };

    const handleAwake = () => {
      setVisible(false);
      setMessage('');
    };

    window.addEventListener('backend:waking', handleWaking);
    window.addEventListener('backend:awake', handleAwake);

    return () => {
      window.removeEventListener('backend:waking', handleWaking);
      window.removeEventListener('backend:awake', handleAwake);
    };
  }, []);

  // Animated dots effect
  useEffect(() => {
    if (!visible) return;

    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-fadeIn">
      <div className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3">
        <div className="relative">
          <div className="w-5 h-5 bg-white rounded-full animate-pulse"></div>
          <div className="absolute inset-0 w-5 h-5 bg-white rounded-full animate-ping opacity-75"></div>
        </div>
        <span className="font-medium">
          {message}<span className="inline-block w-6 text-left">{dots}</span>
        </span>
      </div>
    </div>
  );
};

export default BackendWakeUpIndicator;
