import axios from 'axios';
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
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
