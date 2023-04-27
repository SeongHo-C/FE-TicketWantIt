import { getToken, removeToken } from '../../../modules/token.mjs';
import URL from '../../../modules/server_url.mjs';

const [
  email,
  nameInput,
  address
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
    address.innerHTML = response.data.address;
  })
 .catch((error) => {
    alert(`${error.response.data.message}`);
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
      alert(`${error.response.data.message}`);
    })
  } else {
    return;
  }
}

withdrawalButton.addEventListener('click', withdrawal);