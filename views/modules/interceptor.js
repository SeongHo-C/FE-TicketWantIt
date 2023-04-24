// localStorage에서 토큰을 가져오는 함수
function getToken() {
  return localStorage.getItem('token');
}
function addInterceptor() {
  const interceptor = axios.interceptors.request.use((config) => {
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp < currentTime) {
      return;
    } else {
      axios.get('/api/auth',
    {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    })
    .then((response) => {
      const token = response.data.token;
      saveToken(token);
    })
    .catch((error) => {
      console.error(error);
    });
    }
  });
  return interceptor;
}

