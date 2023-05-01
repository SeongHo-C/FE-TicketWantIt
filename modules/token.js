import instance from './axios_interceptor.js';

function getToken() {
  return localStorage.getItem('token');
}

function saveToken(accessToken, refreshToken) {
  localStorage.setItem('token', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
}

function removeToken() {
  localStorage.removeItem('token');
}

function isTokenExpired() {
  const token = getToken();
  const decodedToken = jwt_decode(token);
  const currentTime = Date.now() / 1000;

  if (decodedToken.exp < currentTime) return true;
  return false;
}

async function tokenRefresh() {
  try {
    const response = await instance.get('/api/auth');
    const token = response.data;

    saveToken(token);
  } catch (error) {
    console.log(error);
  }
}

export { getToken, saveToken, removeToken, isTokenExpired, tokenRefresh };
