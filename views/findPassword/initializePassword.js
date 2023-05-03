import instance from '../../modules/axios_interceptor.js';

const [
  id,
  email
] =document.querySelectorAll('.email_inputText');

const sendMailButton = document.querySelector('#sendMail');

function emailSelection() {
  var selectEmail = document.getElementById("selectEmail");
  var email = document.getElementById("email");

  if (selectEmail.value === "") {
    email.removeAttribute("readonly");
    email.value = "";
    email.focus();
  } else {
    email.setAttribute("readonly", true);
    email.value = selectEmail.value;
  }
}

const sendMail = async (e) => {
  e.preventDefault();
  try {
    await instance.post('/api/user/reset-password', {
    email: id.value + '@' + email.value
  })
    alert('초기화 된 비밀번호를 발송했습니다.')
  }
  catch (error) {
    alert(`${error.response.data.message}`);
  }
}

document.querySelector('#selectEmail').addEventListener('change', emailSelection);
sendMailButton.addEventListener('click', sendMail);