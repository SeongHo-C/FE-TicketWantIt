import { saveToken } from '../../modules/saveToken.js';

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

const joinButton = document.querySelector('#join_btn');

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

axios.post('http://34.64.112.166/api/user', {
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
      window.location.href = '../home/index.html';
  } else {
      alert('회원가입에 실패했습니다.');
      return;
  }
})
.catch((error) => {
  console.log(error);
  alert('회원가입에 실패했습니다. 잠시 뒤 다시 시도해주세요.');
 })
}

document.querySelector('#selectEmail').addEventListener('change', emailSelection);
joinButton.addEventListener('click', joinFunction);