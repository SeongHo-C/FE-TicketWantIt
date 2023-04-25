import { getToken } from './getToken.js';
import { saveToken } from './saveToken.js';

//토큰 만료 여부를 확인하는 함수
export const isTokenExpired = () => {
  const token = getToken();
  const decodedToken = jwt_decode(token);
  const currentTime = Date.now() / 1000;
  if (decodedToken.exp > currentTime) {
    axios.post('http://34.64.112.166/api/auth', {
       email: email.value,
       password: password.value,
     })
     .then((response) => {
        const token = response.data;
        saveToken(token);  
      }) 
     .catch((error) => {
      console.log(error);
     })
  } else {
    return;
  }
};