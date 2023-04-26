import { getToken } from './token.mjs';

window.onload = function tokenCheck () {
  const token = getToken();
  if(!token) {
    alert('로그인 후 이용해주시기 바랍니다.')
    window.location.href = '/views/login/login.html';
  }
}