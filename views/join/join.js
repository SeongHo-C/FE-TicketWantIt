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
] = document.querySelectorAll('.dn');

const joinButton = document.querySelector('#join_btn');

function emailCheck(email) {
  var emailRegExp = /^[a-zA-Z0-9]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegExp.test(email)) {
    emailError.style.visibility = 'visible';
  } else {
    emailError.style.visibility = 'hidden';
  }
}

const hideError = () => {
  if (nameInput.value.length > 0) {
    nameError.style.visibility = 'hidden';
  }
  else if (password.value.length > 0) {
    passwordError.style.visibility = 'hidden';
  }
  else if (confirmPassword.value === password.value) {
    confirmPasswordError.style.visibility = 'hidden';
  }
}

[ nameError, passwordError, confirmPasswordError ].forEach(input => {
  input.addEventListener('input', hideError);
})

const joinFunction = (e) => {
  e.preventDefault();

  emailCheck(email.value);

  if (nameInput.value.length < 2) {
    nameError.style.visibility = 'visible';
    return false;
  }
  else if (password.value.length < 6) {
    passwordError.style.visibility = 'visible';
    return false;
  }
  else if (confirmPassword.value !== password.value) {
    confirmPasswordError.style.visibility = 'visible';
    return false;
  }

  axios.post('/api/users', {
      email : email.value,
      name : nameInput.value,
      password : password.value,
  })
  .then((res) => {
    if (res) {
        alert('회원가입이 완료되었습니다!');
        window.location.href = 'login.html';
    } else {
        alert('회원가입에 실패했습니다.');
        return;
    }
  })
}

joinButton.addEventListener('click', joinFunction);