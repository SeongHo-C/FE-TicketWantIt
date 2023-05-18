import URL from './server_url.js';
import { logout } from './tokenPresent.js';

function getToken() {
  return localStorage.getItem('token');
}

function getRefreshToken() {
  return localStorage.getItem('refreshToken');
}

function saveToken(accessToken) {
  localStorage.setItem('token', accessToken);
}

function saveRefreshToken(refreshToken) {
  localStorage.setItem('refreshToken', refreshToken);
}

function removeToken() {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
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
    const refreshToken = getRefreshToken();

    const response = await axios.get(`${URL}/api/auth`, {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    const { accessToken } = response.data;
    saveToken(accessToken);
  } catch (error) {
    if (error.response.status === 403) {
      alert('다시 로그인 후 이용해주시기 바랍니다.');
      logout();
    }
  }
}

export {
  getToken,
  getRefreshToken,
  saveToken,
  saveRefreshToken,
  removeToken,
  isTokenExpired,
  tokenRefresh,
};
