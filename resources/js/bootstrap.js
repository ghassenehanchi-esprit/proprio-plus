import axios from 'axios';
import sweetAlert from '@/libs/sweetalert';

window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.withCredentials = true;

/**
 * Laravel Sanctum needs a CSRF token cookie in order to
 * authenticate stateful requests. Fetch it once on boot so
 * subsequent API calls include the required XSRF-TOKEN header.
 */
axios.get('/sanctum/csrf-cookie').catch(() => {
  // It's safe to ignore errors here as the request simply
  // ensures the cookie exists before any authenticated call.
});

// Redirect to the login page whenever an authenticated request
// receives a 401 response. This typically means the user's
// session has expired or they were never authenticated.
axios.interceptors.response.use(
  response => {
    const type = response.headers['content-type'] || '';
    if (type.includes('application/json') && response.data?.message) {
      sweetAlert(response.data.message, 'success');
    }
    return response;
  },
  error => {
    if (error.response && error.response.status === 401) {
      window.location.href = '/login';
    }
    const type = error.response?.headers['content-type'] || '';
    if (type.includes('application/json')) {
      const message = error.response?.data?.message || 'Erreur';
      sweetAlert(message, 'error');
    }
    return Promise.reject(error);
  }
);
