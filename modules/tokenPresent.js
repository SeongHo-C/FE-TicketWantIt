import { getToken, removeToken } from './token.mjs';
import URL from './server_url.mjs';

const tokenPresent = () => {
  const token = getToken();
  if (!token) {
    document.querySelector('.login').classList.remove('dn');
    document.querySelector('.logout').classList.add('dn');
  } else {
    document.querySelector('.login').classList.add('dn');
    document.querySelector('.logout').classList.remove('dn');
  }
} 

const login = () => {
  window.location.href = '/views/login/login.html';
}

const myPage = () => {
  const token = getToken();
  if (!token) {
    alert('로그인 후 이용해주시기 바랍니다.')
    window.location.href = '/views/login/login.html';
  } else {
    window.location.href = '/views/mypage/userInfo/userInfo.html';
  }
}

const cart = () => {
  window.location.href = '/views/cart/cart.html';
}

const logout = () => {
  axios.get(`${URL}/api/auth/logout`)
  .then(() => {
    const token = getToken();
    removeToken(token);
    window.location.href = '/views/home/index.html';
    tokenPresent();
  })
  .catch((err) =>{
    console.log(err);
  });
}

window.addEventListener('load', tokenPresent);
document.querySelector('.login').addEventListener('click', login);
document.querySelector('.logout').addEventListener('click', logout);
document.querySelector('.mypage').addEventListener('click', myPage);
document.querySelector('.cart').addEventListener('click', cart);