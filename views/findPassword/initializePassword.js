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

const sendMail = (e) => {
  e.preventDefault();

  axios.post('http://34.64.112.166/api/user/reset-password', {
    email: id.value + '@' + email.value
  })
  .then((response) => {
    alert('초기화 된 비밀번호를 발송했습니다.')
  })
  .catch((err) => {
    alert('비밀번호 초기화에 실패했습니다.');
  })
}

document.querySelector('#selectEmail').addEventListener('change', emailSelection);
sendMailButton.addEventListener('click', sendMail);