import URL from './server_url.js';
import { getToken, isTokenExpired, tokenRefresh } from './token.js';

const instance = axios.create({
  baseURL: URL,
  timeout: 1000,
});

instance.interceptors.request.use(
  (config) => {
    const token = getToken();

    config.headers['Content-Type'] = 'application/json; charset=utf-8';
    config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      if (isTokenExpired()) await tokenRefresh();

      const token = getToken();

      error.config.headers = {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.request(error.config);
      return response;
    }
    return Promise.reject(error);
  }
);

export default instance;
