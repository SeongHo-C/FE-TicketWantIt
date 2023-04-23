import { logout } from '../modules/logout.js';
import { handleMyPageClick } from '../modules/goToMypage.js';
import { addInterceptor, getToken } from '../modules/interceptor.js';

addInterceptor();

const [
  currentPassword,
  password,
  confirmPassword,
] = document.querySelectorAll('.password_inputText');

const [
  currentPasswordError,
  passwordError,
  confirmPasswordError,
] = document.querySelectorAll('.error')

const passwordChangeButton = document.querySelector('#passwordChangeButton');

const changePassword = (e) => {
  e.preventDefault();

  if (currentPassword.value.length < 6) {
    currentPasswordError.style.display = 'block';
    return false;
  }
  else if (password.value.length < 6 ) {
    passwordError.style.display = 'block';
    return false;
  } 
  else if (password !== confirmPassword) {
    confirmPasswordError.style.display = 'block';
    return false;
  }

   axios.post('/api/user/change-password', {
     currentPassword: currentPassword.value,
     password: password.value
   }, 
   {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
    })
   .then((res) => {
     if (res.status === 400 ) {
       currentPasswordError.style.display = 'block';
     } else {
       alert('비밀번호 변경이 완료되었습니다.');
       window.location.href = '../login/login.js'
     }
   })
   .catch((err) => {
     console.log(err);
     alert('')
   })
}

document.querySelector('.mypage').addEventListener('click', handleMyPageClick);
document.querySelector('.logout').addEventListener('click', logout);
passwordChangeButton.addEventListener('click', changePassword)