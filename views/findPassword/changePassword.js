import { getToken, removeToken } from '../../modules/token.mjs';
import URL from '../../modules/server_url.mjs';
import { togglePasswordVisibility, togglePasswordInvisibility } from '../../modules/passwordVisibility.mjs';

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

const [
  currentPasswordCheckEyesClose,
  passwordCheckEyesClose,
  confirmPasswordCheckEyesClose
] = document.querySelectorAll('.ri-eye-close-line')

const [
  currentPasswordCheckEyesOpen,
  passwordCheckEyesOpen,
  confirmPasswordCheckEyesOpen
] = document.querySelectorAll('.ri-eye-2-line')

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

   axios.post(`${URL}/api/user/change-password`, {
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

currentPasswordCheckEyesClose.addEventListener('click', () => {
  togglePasswordVisibility(currentPassword, currentPasswordCheckEyesOpen, currentPasswordCheckEyesClose);
});
currentPasswordCheckEyesOpen.addEventListener('click', () => {
  togglePasswordInvisibility(currentPassword, currentPasswordCheckEyesOpen, currentPasswordCheckEyesClose);
});
passwordCheckEyesClose.addEventListener('click', () => {
  togglePasswordVisibility(password, passwordCheckEyesOpen, passwordCheckEyesClose);
});
passwordCheckEyesOpen.addEventListener('click', () => {
  togglePasswordInvisibility(password, passwordCheckEyesOpen, passwordCheckEyesClose);
});
confirmPasswordCheckEyesClose.addEventListener('click', () => {
  togglePasswordVisibility(confirmPassword, confirmPasswordCheckEyesOpen, confirmPasswordCheckEyesClose);
});
confirmPasswordCheckEyesOpen.addEventListener('click', () => {
  togglePasswordInvisibility(confirmPassword, confirmPasswordCheckEyesOpen, confirmPasswordCheckEyesClose);
});
passwordChangeButton.addEventListener('click', changePassword)