import URL from './server_url.mjs';

function getToken() {
  return localStorage.getItem('token');
}

function saveToken(token) {
  localStorage.setItem('token', token);
}

function removeToken() {
  localStorage.removeItem('token');
}

const isTokenExpired = () => {
  const token = getToken();
  const decodedToken = jwt_decode(token);
  const currentTime = Date.now() / 1000;

  if (decodedToken.exp > currentTime) {
    axios
      .post(`${URL}/api/auth`, {
        email: email.value,
        password: password.value,
      })
      .then((response) => {
        const token = response.data;
        saveToken(token);
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

export { getToken, saveToken, removeToken, isTokenExpired };
