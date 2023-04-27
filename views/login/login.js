import { getToken, saveToken } from '../../modules/token.js';
import URL from '../../modules/server_url.js';
import {
  togglePasswordVisibility,
  togglePasswordInvisibility,
} from '../../modules/passwordVisibility.js';

window.onload = function tokenCheck() {
  const token = getToken();
  if (token) {
    alert('이미 로그인 한 상태입니다.');
    window.location.href = '/index.html';
  }
};

const [email, password] = document.querySelectorAll('.login_inputText');

const [emailError, passwordError] = document.querySelectorAll('.error');

const passwordCheckEyesClose = document.querySelector('.ri-eye-close-line');
const passwordCheckEyesOpen = document.querySelector('.ri-eye-2-line');
const logInButton = document.querySelector('#login_btn');

//E-mail(id) & 비밀번호 Error 숨기기
const deleteEmailErrorMessage = () => {
  if (email.value !== '') {
    emailError.style.display = 'none';
  }
};

const deletePasswordErrorMessage = () => {
  if (password.value !== '') {
    passwordError.style.display = 'none';
  }
};

//로그인
// 토큰을 받아와서 localStorage에 저장하는 함수
const logInFunction = (e) => {
  e.preventDefault();

  if (email.value === '') {
    emailError.style.display = 'block';
    return false;
  } else if (password.value === '') {
    passwordError.style.display = 'block';
    return false;
  }

  axios
    .post(`${URL}/api/auth`, {
      email: email.value,
      password: password.value,
    })
    .then((response) => {
      const token = response.data;
      if (jwt_decode(token).isAdmin) {
        if (confirm('관리자 페이지로 이동하시겠습니까?')) {
          saveToken(token);
          window.location.href = '../admin/goods.html';
        } else {
          return;
        }
      } else if (jwt_decode(token).isTempPassword) {
        alert(
          '임시 비밀번호로 로그인 했습니다. 비밀번호 변경창으로 이동합니다.'
        );
        saveToken(token);
        window.location.href = '../findPassword/changePassword.html';
      } else {
        saveToken(token);
        window.location.href = '../../index.html';
      }
    })
    .catch((error) => {
      alert(`${error.response.data.message}`);
    });
};

email.addEventListener('input', deleteEmailErrorMessage);
password.addEventListener('input', deletePasswordErrorMessage);
passwordCheckEyesClose.addEventListener('click', () => {
  togglePasswordVisibility(
    password,
    passwordCheckEyesOpen,
    passwordCheckEyesClose
  );
});
passwordCheckEyesOpen.addEventListener('click', () => {
  togglePasswordInvisibility(
    password,
    passwordCheckEyesOpen,
    passwordCheckEyesClose
  );
});
logInButton.addEventListener('click', logInFunction);
