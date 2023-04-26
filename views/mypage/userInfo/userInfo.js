import { getToken, removeToken } from '../../../modules/token.mjs';
import URL from '../../../modules/server_url.mjs';

const [
  email,
  nameInput,
] = document.querySelectorAll('.userInfo')

const withdrawalButton = document.querySelector('#withdrawalButton')

const userInfo = () => {
  axios.get(`${URL}/api/user`,
  {
    headers: {'Authorization': `Bearer ${getToken()}`}
  })
  .then((response) => {
    const token = getToken();
    const decodedToken = jwt_decode(token);
    email.innerHTML = decodedToken.email;
    nameInput.innerHTML = decodedToken.name;
  })
 .catch((err) => {
    console.log(err);
 })
}

userInfo();

//회원탈퇴
const withdrawal = (e) => {
  
  e.preventDefault();

  if (confirm('정말 탈퇴하시겠습니까?')) {
    axios.delete(`${URL}/api/user`,
    {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    })
    .then(() => {
      const token = getToken();
      removeToken(token);
      window.location.href = '../../../index.html';
      alert('정상적으로 회원탈퇴가 완료되었습니다. 다음에 또 이용해주세요.')
    })
    .catch((err) => {
      console.log(err);
      alert('회원탈퇴에 실패했습니다. 잠시 뒤 다시 시도해주세요.')
    })
  } else {
    return;
  }
}

withdrawalButton.addEventListener('click', withdrawal);