// localStorage에서 토큰을 가져오는 함수
import jwt_decode from "jwt-decode";
import axios from 'axios';

export function getToken() {
  return localStorage.getItem('token');
}
export function addInterceptor() {
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
      const decodedToken = jwt_decode(token); //토큰을 해석
      console.log(decodedToken.name); //로그인한 유저의 이름
      console.log(decodedToken.isAdmin); //로그인한 유저의 관리자 여부
      console.log(decodedToken.isTempPassword); //로그인한 유저의 임시패스워드 여부
      saveToken(token);
    })
    .catch((error) => {
      console.error(error);
    });
    }
  });
  return interceptor;
}

