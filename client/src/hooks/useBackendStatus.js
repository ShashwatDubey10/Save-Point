import { useState, useEffect } from 'react';
import api from '../services/api';

// Custom hook to monitor backend status
export const useBackendStatus = () => {
  const [isBackendAwake, setIsBackendAwake] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState(null);

  const checkBackendStatus = async () => {
    setIsChecking(true);

    try {
      const startTime = Date.now();
      await api.get('/health', { timeout: 5000 });
      const responseTime = Date.now() - startTime;

      setIsBackendAwake(true);
      setLastCheckTime(new Date());

      // If response took > 3 seconds, backend was likely sleeping
      if (responseTime > 3000) {
        console.log('[Backend] Backend was sleeping, now awake');
        return { wasAsleep: true, responseTime };
      }

      return { wasAsleep: false, responseTime };
    } catch (error) {
      setIsBackendAwake(false);
      console.error('[Backend] Health check failed:', error);
      return { wasAsleep: false, error };
    } finally {
      setIsChecking(false);
    }
  };

  // Check backend status on mount
  useEffect(() => {
    checkBackendStatus();
  }, []);

  return {
    isBackendAwake,
    isChecking,
    lastCheckTime,
    checkBackendStatus,
  };
};

// Hook to detect slow API calls (backend waking up)
export const useBackendWakeDetection = () => {
  const [isWaking, setIsWaking] = useState(false);
  const [wakingMessage, setWakingMessage] = useState('');

  useEffect(() => {
    // Listen for slow requests (created by axios interceptor)
    const handleSlowRequest = () => {
      setIsWaking(true);
      setWakingMessage('Backend is waking up, please wait...');

      // Auto-hide after 10 seconds
      setTimeout(() => {
        setIsWaking(false);
        setWakingMessage('');
      }, 10000);
    };

    // Listen for request completion
    const handleRequestComplete = () => {
      setIsWaking(false);
      setWakingMessage('');
    };

    window.addEventListener('backend:waking', handleSlowRequest);
    window.addEventListener('backend:awake', handleRequestComplete);

    return () => {
      window.removeEventListener('backend:waking', handleSlowRequest);
      window.removeEventListener('backend:awake', handleRequestComplete);
    };
  }, []);

  return {
    isWaking,
    wakingMessage,
  };
};
