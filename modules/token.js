import URL from './server_url.js';

function getToken() {
  return localStorage.getItem('token');
}

function getRefreshToken() {
  return localStorage.getItem('refreshToken');
}

function saveToken(accessToken, refreshToken) {
  localStorage.setItem('token', accessToken);
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
    const token = localStorage.getItem('refreshToken');

    const response = await axios.get(`${URL}/api/auth`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { accessToken, refreshToken } = response.data;
    saveToken(accessToken, refreshToken);
  } catch (error) {
    console.log(error);
  }
}

export {
  getToken,
  getRefreshToken,
  saveToken,
  removeToken,
  isTokenExpired,
  tokenRefresh,
};
