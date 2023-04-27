import { getToken, saveToken } from '../../modules/token.mjs';
import URL from '../../modules/server_url.mjs';
import { togglePasswordVisibility, togglePasswordInvisibility } from '../../modules/passwordVisibility.mjs';

const [
  id,
  email,
  nameInput,
  password,
  confirmPassword,
] = document.querySelectorAll('.join_inputText');

const [
  emailError,
  nameError,
  passwordError,
  confirmPasswordError,
] = document.querySelectorAll('.error');

const [
  passwordCheckEyesClose,
  confirmPasswordCheckEyesClose
] = document.querySelectorAll('.ri-eye-close-line')

const [
  passwordCheckEyesOpen,
  confirmPasswordCheckEyesOpen
] = document.querySelectorAll('.ri-eye-2-line')

const joinButton = document.querySelector('#join_btn');
const modal = document.querySelector('#modal');
const closeModalButton = document.querySelector('.close_area > button');
const emailConfirmButton = document.querySelector('#emailConfirmButton');
const confirmInput = document.querySelector('#confirmInput');
const confirmButton = document.querySelector('#confirmButton');
const timer = document.querySelector('#timer');

//email select box
function emailSelection() {
  var selectEmail = document.getElementById("selectEmail");

  if (selectEmail.value === "") {
    email.removeAttribute("readonly");
    email.value = "";
    email.focus();
  } else {
    email.setAttribute("readonly", true);
    email.value = selectEmail.value;
  }
}

//E-mail 형식 유효성 검사
function emailCheck(email) {
  var emailRegExp = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegExp.test(email)) {
    emailError.style.display = 'block';
  } else {
    emailError.style.display = 'none';
  }
}

//정보 재입력 시 Error 숨기기
email.addEventListener('input', () => {
  if (email.value.length > 0) {
    emailError.style.display = 'none';
  }
});
nameInput.addEventListener('input', () => {
  if (nameInput.value.length > 0) {
    nameError.style.display = 'none';
  }
});
password.addEventListener('input', () => {
  if (password.value.length > 0) {
    passwordError.style.display = 'none';
  }
});
confirmPassword.addEventListener('input', () => {
  if (confirmPassword.value === password.value) {
    confirmPasswordError.style.display = 'none';
  }
});

//이메일 인증번호요청
const emailConfirm = () => {
  axios.post(`${URL}/api/user/emailAuth`, 
  {
    email: id.value + '@' + email.value
  })
  .then((response) => {
    const token = response.data;
    localStorage.setItem('authCode', token);
    alert('인증번호를 발송했습니다.');
  })
  .catch((err) => {
    console.log(err);
    alert('E-MAIL 인증 요청에 실패했습니다. 잠시 뒤 다시 시도해주세요.');
    modal.style.display = 'none';
    clearInterval(tokenTimer);
  })
}

//이메일 인증번호 일치여부
const matchEmailConfirm = () => {
  axios.post(`${URL}/api/user/emailAuth`, 
  {
    email: id.value + '@' + email.value
  })
  .then((response) => {
    const token = localStorage.getItem('authCode');
    const decodedToken = jwt_decode(token);
    if (decodedToken.authCode == confirmInput.value) {
      localStorage.removeItem('authCode', token);
      alert('인증에 성공했습니다.');
      modal.style.display = 'none';
      clearInterval(tokenTimer);
      id.setAttribute("readonly", true);
      email.setAttribute("readonly", true);
      selectEmail.style.display = 'none';
    } else {
      alert('인증번호가 틀립니다. 다시 시도해주세요.');
      modal.style.display = 'none';
      clearInterval(tokenTimer);
      return false;
    }
  })
  .catch((err) => {
    console.log(err);
    alert('E-MAIL 인증 요청에 실패했습니다. E-MAIL을 확인해주세요.')
  })
}

//회원가입
const joinFunction = (e) => {
  e.preventDefault();

  emailCheck(email.value);

  if (nameInput.value.length < 2) {
    nameError.style.display = 'block';
    return false;
  }
  else if (password.value.length < 6) {
    passwordError.style.display = 'block';
    return false;
  }
  else if (confirmPassword.value !== password.value) {
    confirmPasswordError.style.display = 'block';
    return false;
  }

if (!localStorage.getItem('authCode')) {
    alert('이메일 인증을 먼저 진행해주세요.');
    return false;
  } else {
  axios.post(`${URL}/api/user`, {
      email : id.value + '@' + email.value,
      name : nameInput.value,
      password : password.value,
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then((response) => {
    if (response) {
        alert('회원가입이 완료되었습니다!');
        const token = response.data;
        saveToken(token);
        window.location.href = '../../index.html';
    } else {
        alert('회원가입에 실패했습니다.');
        return;
    }
  })
  .catch((error) => {
    console.log(error);
    alert('중복된 이메일입니다. 다른 이메일로 다시 시도해주세요.');
  })
  }
}

document.querySelector('#selectEmail').addEventListener('change', emailSelection);
let tokenTimer;
emailConfirmButton.addEventListener('click', (e) => {
  e.preventDefault();
  emailConfirm();
  modal.style.display = 'block';
  let leftTime = 180;
  tokenTimer = setInterval(() => {
  const minute = Math.floor(leftTime / 60);
  const seconds = (leftTime % 60);
  if (seconds < 10) {
    timer.textContent = `${minute} :0${seconds}`;
  } else {
    timer.textContent = `${minute} :${seconds}`;
  }
  leftTime--;

  if (leftTime < 0) {
    clearInterval(tokenTimer);
    timer.textContent = `0 :00`;
    alert('인증번호 유효기간이 끝났습니다. 다시 시도해주세요.');
  }
}, 1000);
});

closeModalButton.addEventListener('click', (e) => {
  clearInterval(tokenTimer);
  modal.style.display = 'none';
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
confirmButton.addEventListener('click', matchEmailConfirm);
joinButton.addEventListener('click', joinFunction);