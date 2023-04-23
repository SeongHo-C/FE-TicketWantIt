import { handleMyPageClick } from '../modules/goToMypage.js';
import { getToken } from '../modules/interceptor.js';

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

const sendMail = () => {
  axios.post('/api/user/reset-password', {
    email: id.value + '@' + email.value
  }, 
  {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
  })
  .then((res) => {
    if (res) {
      alert('초기화 된 비밀번호가 발송되었습니다.')
    } else {
      alert('비밀번호 초기화에 실패했습니다.')
    }
  })
  .catch((err) => {
    console.log(err);
    alert('비밀번호 초기화에 실패했습니다.')
  })
}

document.querySelector('.mypage').addEventListener('click', handleMyPageClick);
sendMailButton.addEventListener('click', sendMail);