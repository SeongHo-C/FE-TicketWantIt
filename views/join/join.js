import { saveToken } from '../../modules/token.js';
import URL from '../../modules/server_url.js';
import {
  togglePasswordVisibility,
  togglePasswordInvisibility,
} from '../../modules/passwordVisibility.js';

const [id, email, nameInput, password, confirmPassword] =
  document.querySelectorAll('.join_inputText');

const [emailError, nameError, passwordError, confirmPasswordError] =
  document.querySelectorAll('.error');

const [passwordCheckEyesClose, confirmPasswordCheckEyesClose] =
  document.querySelectorAll('.ri-eye-close-line');

const [passwordCheckEyesOpen, confirmPasswordCheckEyesOpen] =
  document.querySelectorAll('.ri-eye-2-line');

const joinButton = document.querySelector('#join_btn');
const modal = document.querySelector('#modal');
const closeModalButton = document.querySelector('.close_area > button');
const emailConfirmButton = document.querySelector('#emailConfirmButton');
const confirmInput = document.querySelector('#confirmInput');
const confirmButton = document.querySelector('#confirmButton');
const timer = document.querySelector('#timer');

//email select box
function emailSelection() {
  var selectEmail = document.getElementById('selectEmail');

  if (selectEmail.value === '') {
    email.removeAttribute('readonly');
    email.value = '';
    email.focus();
  } else {
    email.setAttribute('readonly', true);
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
  axios
    .post(`${URL}/api/user/emailAuth`, {
      email: id.value + '@' + email.value,
    })
    .then((response) => {
      const token = response.data;
      localStorage.setItem('authCode', token);
      alert('인증번호를 발송했습니다.');
    })
    .catch((error) => {
      console.log(error);
      alert(`${error.response.data.message}`);
      modal.style.display = 'none';
      clearInterval(tokenTimer);
    });
};

let isAuth = false;
//이메일 인증번호 일치여부
const matchEmailConfirm = () => {
  axios
    .post(`${URL}/api/user/emailAuth`, {
      email: id.value + '@' + email.value,
    })
    .then((response) => {
      const token = localStorage.getItem('authCode');
      const decodedToken = jwt_decode(token);
      if (decodedToken.authCode === confirmInput.value) {
        isAuth = true;
        alert('인증에 성공했습니다.');
        modal.style.display = 'none';
        clearInterval(tokenTimer);
        id.setAttribute('readonly', true);
        email.setAttribute('readonly', true);
        selectEmail.style.display = 'none';
        id.setAttribute('readonly', true);
        email.setAttribute('readonly', true);
        nameInput.setAttribute('readonly', true);
        password.setAttribute('readonly', true);
        confirmPassword.setAttribute('readonly', true);
      } else {
        alert('인증번호가 일치하지 않습니다. 다시 시도해주세요.');
        modal.style.display = 'none';
        clearInterval(tokenTimer);
      }
    })
    .catch((error) => {
      console.log(error);
      alert(`${error.response.data.message}`);
    });
};

//회원가입
const joinFunction = (e) => {
  if (isAuth) {
    e.preventDefault();
    const authToken = localStorage.getItem('authCode');
    if (!authToken) {
      alert('이메일 인증을 먼저 진행해주세요.');
      return false;
    }
    const decodedToken = jwt_decode(authToken);
    if (decodedToken.authCode === confirmInput.value) {
      axios
      .post(
        `${URL}/api/user`,
        {
          email: id.value + '@' + email.value,
          name: nameInput.value,
          password: password.value,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .then((response) => {
          alert('회원가입이 완료되었습니다!');
          localStorage.removeItem('authCode', authToken);
          const token = response.data;
          saveToken(token);
          window.location.href = '../../index.html';
      })
      .catch((error) => {
        alert(`${error.response.data.message}`);
    });
  } else {
      alert('이메일 인증을 먼저 진행해주세요.');
      return;
    }
  } else {
    alert('이메일 인증을 먼저 진행해주세요.')
  }
}

document
  .querySelector('#selectEmail')
  .addEventListener('change', emailSelection);
let tokenTimer;
emailConfirmButton.addEventListener('click', (e) => {
  e.preventDefault();

  emailCheck(email.value);

  if (nameInput.value.length < 2) {
    nameError.style.display = 'block';
    return false;
  } else if (password.value.length < 6) {
    passwordError.style.display = 'block';
    return false;
  } else if (confirmPassword.value !== password.value) {
    confirmPasswordError.style.display = 'block';
    return false;
  } else {
    emailConfirm();

    modal.style.display = 'block';
    let leftTime = 180;
    tokenTimer = setInterval(() => {
      const minute = Math.floor(leftTime / 60);
      const seconds = leftTime % 60;
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
  }
});

closeModalButton.addEventListener('click', (e) => {
  clearInterval(tokenTimer);
  modal.style.display = 'none';
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
confirmButton.addEventListener('click', matchEmailConfirm);
joinButton.addEventListener('click', joinFunction);