import { getToken } from '../../modules/getToken.js';
import { removeToken } from '../../modules/removeToken.js';

const tokenStatus = () => {
  const token = getToken();
  if (!token) {
    alert('로그인 후 이용해주시기 바랍니다.')
    window.location.href = '/views/login/login.html';
  }
}

tokenStatus();

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
   else if (password.value !== confirmPassword.value) {
     confirmPasswordError.style.display = 'block';
     return false;
   }

   axios.post('http://34.64.112.166/api/user/change-password', {
     currentPassword: currentPassword.value,
     password: password.value
   }, 
   {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
    })
   .then((response) => {
     if (response.status === 400) {
       currentPasswordError.style.display = 'block';
     } else {
       alert('비밀번호 변경이 완료되었습니다.');
       removeToken(token);
       window.location.href = '../login/login.html'
     }
   })
   .catch((err) => {
     console.log(err);
     alert('비밀번호 변경에 실패했습니다. 잠시 후 다시 시도해주세요.');
   })
}

passwordChangeButton.addEventListener('click', changePassword)