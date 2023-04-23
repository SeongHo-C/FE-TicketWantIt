import jwt_decode from "jwt-decode";
import { handleMyPageClick } from '../modules/goToMypage.js';

const [
  email,
  password,
] = document.querySelectorAll('.login_inputText');

const [
  emailError,
  passwordError,
] = document.querySelectorAll('.error');

const logInButton = document.querySelector('#login_btn');

//E-mail(id) & 비밀번호 Error 숨기기
const deleteEmailErrorMessage = () => {
  if (email.value !== '') {
    emailError.style.display = 'none';
  }
}

const deletePasswordErrorMessage = () => {
  if (password.value !== '') {
    passwordError.style.display = 'none';
  }
}

//로그인
// 토큰을 받아와서 localStorage에 저장하는 함수
function saveToken(token) {
  localStorage.setItem('token', token);
}

const logInFunction = (e) => {
  e.preventDefault();

  if (email.value === '') {
    emailError.style.display = 'block';
    return false;
  }
  else if (password.value === '') {
    passwordError.style.display = 'block';
    return false;
  }

   axios.post('/api/auth', {
       email: email.value,
       password: password.value,
     })
     .then((res) => { 
       if (res.status === 200) {
        const token = response.data.token;
        const decodedToken = jwt_decode(token); //토큰을 해석
        console.log(decodedToken.name); //로그인한 유저의 이름
        console.log(decodedToken.isAdmin); //로그인한 유저의 관리자 여부
        console.log(decodedToken.isTempPassword); //로그인한 유저의 임시패스워드 여부
        saveToken(token);
        window.location.href = '../../home/index.html';
       } else {
        throw new Error('로그인에 실패했습니다.');
       }
     })
     .catch((error) => {
      console.log(error);
      alert('로그인에 실패했습니다.');
     })
  };


document.querySelector('.mypage').addEventListener('click', handleMyPageClick);

email.addEventListener('input', deleteEmailErrorMessage);
password.addEventListener('input', deletePasswordErrorMessage);

logInButton.addEventListener('click', logInFunction);
