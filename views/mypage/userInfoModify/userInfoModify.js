import { getToken } from '../../../modules/getToken.js';
import { saveToken } from '../../../modules/saveToken.js';

const [
  nameInput
 ] = document.querySelectorAll('.userInfoInput');

const email = document.querySelector('#email');
const userInfoModifyButton = document.querySelector('#userInfoModifyButton');
const warning = document.querySelector('#warning');

const tokenStatus = () => {
  const token = getToken();
  if (!token) {
    alert('로그인 후 이용해주시기 바랍니다.')
    window.location.href = '/views/login/login.html';
  }
}

tokenStatus();

const token = getToken();
const decodedToken = jwt_decode(token);
email.innerHTML = decodedToken.email;

//유저 정보 수정
const userInfoModify = () => {

  if (nameInput.value.length < 2) {
        warning.style.color = 'red';
        return false;
  }

  axios.put('http://34.64.112.166/api/user', 
  {
      name: nameInput.value
  }, {
    headers: {'Authorization': `Bearer ${getToken()}`}
  })
  .then((response) => {
    if (response) {
      axios.get('http://34.64.112.166/api/auth',
      {
        headers: {'Authorization': `Bearer ${getToken()}`}
      })
      .then((res) => {
        const token = res.data;
        saveToken(token);
        alert('정보가 성공적으로 업데이트 되었습니다.')
      })
      .catch((err) => {
        console.log(err);
        alert('정보 업데이트에 실패했습니다. 잠시 뒤 다시 시도해주세요.');
      })
    } else {
      alert('정보 업데이트에 실패했습니다. 잠시 뒤 다시 시도해주세요.');
    }
  })
  .catch((err) => {
    console.log(err);
    alert('정보 업데이트에 실패했습니다. 잠시 뒤 다시 시도해주세요.');
  })
}

userInfoModifyButton.addEventListener('click', userInfoModify);