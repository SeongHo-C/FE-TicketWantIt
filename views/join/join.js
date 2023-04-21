
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

//E-mail 형식 유효성 검사
function emailCheck(email) {
  var emailRegExp = /^[a-zA-Z0-9]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegExp.test(email)) {
    emailError.style.display = 'block';
  } else {
    emailError.style.display = 'none';
  }
}

//정보 재입력 시 Error 숨기기
const hideError = () => {
  if (nameInput.value.length > 0) {
    nameError.style.display = 'none';
  }
  else if (password.value.length > 0) {
    passwordError.style.display = 'none';
  }
  else if (confirmPassword.value === password.value) {
    confirmPasswordError.style.display = 'none';
  }
}

[ nameError, passwordError, confirmPasswordError ].forEach(input => {
  input.addEventListener('input', hideError);
})

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

  axios.post('/api/users', {
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
  .catch((error) => {
    console.log(error);
    alert('회원가입에 실패했습니다. 잠시 뒤 다시 시도해주세요.');
   })
}

joinButton.addEventListener('click', joinFunction);