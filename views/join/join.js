import axios from 'axios';

const [
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

function emailCheck() {
  var emailRegExp = /^[a-zA-Z0-9]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegExp.test(email)) {
    emailError.innerHTML = '이메일을 확인해주세요.';
    return false;
  } else {
    emailError.innerHTML = '';
  }
}

const joinFunction = (e) => {
  e.preventDefault();

  emailCheck(email.value);

  if (nameInput.value.length < 2) {
    nameError.innerHTML = '이름은 2글자 이상 써주세요.';
    return false;
  }
  else if (password.value.length < 6) {
    passwordError.innerHTML = '비밀번호는 6글자 이상 써주세요.';
    return false;
  }
  else if (confirmPassword.value !== password.value) {
    confirmPasswordError.innerHTML = '비밀번호가 다릅니다.';
    return false;
  }

  axios.post('', {
      email : email.value,
      name : nameInput.value,
      password : password.value,
  })
  .then((res) => {
    if (res) {
        alert('회원가입이 완료되었습니다!');
        window.location.href = '../login/login.html';
    } else {
        alert('회원가입에 실패했습니다.');
        return;
      }
    })
    .catch(err => {
      console.log(err);
      alert('회원가입에 실패했습니다.');
    })
  }

joinButton.addEventListener('click', joinFunction);