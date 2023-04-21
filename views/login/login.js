const [
  email,
  password,
] = document.querySelectorAll('.login_inputText');

const [
  emailError,
  passwordError,
] = document.querySelectorAll('.error');

const logInButton = document.querySelector('#login_btn');

//E-mail(id) & 비밀번호 Error 숨기기
const deleteEmailErrorMessage = () => {
  if (email.value !== '') {
    emailError.style.display = 'none';
  }
}

const deletePasswordErrorMessage = () => {
  if (password.value !== '') {
    passwordError.style.display = 'none';
  }
}

//로그인
const logInFunction = (e) => {
  e.preventDefault();

  if (email.value === '') {
    emailError.style.display = 'block';
    return false;
  }
  else if (password.value === '') {
    passwordError.style.display = 'block';
    return false;
  }

   axios.post('/api/auth', {
       email: email.value,
       password: password.value,
     }, {
      withCredentials: true
     })
     .then((res) => {
       if (res.status === 200) {
        window.location.href = '../../home/index.html';
       } else {
        throw new Error('로그인에 실패했습니다.');
       }
     })
     .catch((error) => {
      console.log(error);
      alert('로그인에 실패했습니다.');
     })
  };


email.addEventListener('input', deleteEmailErrorMessage);
password.addEventListener('input', deletePasswordErrorMessage);

logInButton.addEventListener('click', logInFunction);