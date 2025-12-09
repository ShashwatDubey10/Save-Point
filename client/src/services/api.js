import axios from 'axios';

// Use environment variable for API URL in production, fallback to proxy in development
const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

// Sleep utility for delays
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Check if error is retryable (network errors, 5xx errors, timeouts)
const isRetryableError = (error) => {
  if (!error.response) {
    // Network error or timeout
    return true;
  }

  const status = error.response.status;
  // Retry on 5xx errors (server errors) and 429 (rate limit)
  return status >= 500 || status === 429;
};

// Exponential backoff retry logic
const retryRequest = async (error) => {
  const config = error.config;

  // Initialize retry count
  if (!config.__retryCount) {
    config.__retryCount = 0;
  }

  // Check if we should retry
  if (config.__retryCount >= MAX_RETRIES || !isRetryableError(error)) {
    return Promise.reject(error);
  }

  config.__retryCount += 1;

  // Calculate delay with exponential backoff
  const delay = INITIAL_RETRY_DELAY * Math.pow(2, config.__retryCount - 1);

  console.log(
    `[API] Retrying request (${config.__retryCount}/${MAX_RETRIES}) after ${delay}ms...`,
    config.url
  );

  // Show backend waking up message on first retry
  if (config.__retryCount === 1) {
    const isNetworkError = !error.response;
    const isTimeout = error.code === 'ECONNABORTED';

    if (isNetworkError || isTimeout) {
      console.log('[API] Backend might be sleeping, waking it up...');

      // Dispatch event for UI to show wake-up indicator
      window.dispatchEvent(new CustomEvent('backend:waking', {
        detail: { message: 'Waking up the backend, this may take a moment...' }
      }));
    }
  }

  // Wait before retrying
  await sleep(delay);

  // Retry the request
  return api(config);
};

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors and retries
api.interceptors.response.use(
  (response) => {
    // Dispatch event when backend responds successfully
    if (response.config.__retryCount > 0) {
      window.dispatchEvent(new CustomEvent('backend:awake'));
    }
    return response;
  },
  async (error) => {
    // Handle 401 Unauthorized - logout user
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Attempt retry for retryable errors
    return retryRequest(error);
  }
);

export default api;
