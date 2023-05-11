import { getToken, removeToken } from '../../modules/token.js';
import {
  togglePasswordVisibility,
  togglePasswordInvisibility,
} from '../../modules/passwordVisibility.js';
import instance from '../../modules/axios_interceptor.js';

const [currentPassword, password, confirmPassword] = document.querySelectorAll(
  '.password_inputText'
);

const [currentPasswordError, passwordError, confirmPasswordError] =
  document.querySelectorAll('.error');

const [
  currentPasswordCheckEyesClose,
  passwordCheckEyesClose,
  confirmPasswordCheckEyesClose,
] = document.querySelectorAll('.ri-eye-close-line');

const [
  currentPasswordCheckEyesOpen,
  passwordCheckEyesOpen,
  confirmPasswordCheckEyesOpen,
] = document.querySelectorAll('.ri-eye-2-line');

const passwordChangeButton = document.querySelector('#passwordChangeButton');

const changePassword = async (e) => {
  e.preventDefault();

  if (currentPassword.value.length < 6) {
    currentPasswordError.style.display = 'block';
    return false;
  } else if (password.value.length < 6) {
    passwordError.style.display = 'block';
    return false;
  } else if (password.value !== confirmPassword.value) {
    confirmPasswordError.style.display = 'block';
    return false;
  }
  try {
  const response = await instance.post(`/api/user/change-password`,
      {
        currentPassword: currentPassword.value,
        password: password.value,
      }
    )
      if (response.status === 400) {
        currentPasswordError.style.display = 'block';
      } else {
        const token = getToken();
        removeToken(token);
        window.location.href = '../login/login.html';
        alert('비밀번호 변경이 완료되었습니다. 다시 로그인해주세요.');
      }
    }
    catch (error) {
      alert(`${error.response.data.message}`);
    };
};

currentPasswordCheckEyesClose.addEventListener('click', () => {
  togglePasswordVisibility(
    currentPassword,
    currentPasswordCheckEyesOpen,
    currentPasswordCheckEyesClose
  );
});
currentPasswordCheckEyesOpen.addEventListener('click', () => {
  togglePasswordInvisibility(
    currentPassword,
    currentPasswordCheckEyesOpen,
    currentPasswordCheckEyesClose
  );
});
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
confirmPasswordCheckEyesClose.addEventListener('click', () => {
  togglePasswordVisibility(
    confirmPassword,
    confirmPasswordCheckEyesOpen,
    confirmPasswordCheckEyesClose
  );
});
confirmPasswordCheckEyesOpen.addEventListener('click', () => {
  togglePasswordInvisibility(
    confirmPassword,
    confirmPasswordCheckEyesOpen,
    confirmPasswordCheckEyesClose
  );
});
passwordChangeButton.addEventListener('click', changePassword);
