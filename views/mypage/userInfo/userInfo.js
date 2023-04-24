import { logout } from '../../modules/logout.js';
import { handleMyPageClick, getToken } from '../../modules/goToMypage.js';

const [
  email,
  nameInput,
] = document.querySelectorAll('.userInfo')

const withdrawalButton = document.querySelector('#withdrawalButton')

const userInfo = () => {
  axios.get('http://10.10.6.156:5000/api/user',
  {
    headers: {'Authorization': `Bearer ${getToken()}`}
  })
  .then((response) => {
    console.log(response)
    const token = getToken();
    const decodedToken = jwt_decode(token);
    email.innerHTML = response.data.email;
    nameInput.innerHTML = response.data.name;
  })
 .catch((err => {
    console.log(err);
    alert('정보를 불러오지 못했습니다. 잠시 뒤 다시 시도해보세요.');
 })
)
}

//회원탈퇴
const withdrawal = (e) => {
  
  e.preventDefault();

  if (confirm('정말 탈퇴하시겠습니까?')) {
    axios.delete('/api/user',
    {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    })
    .then((res) => {
      console.log(res);
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

window.addEventListener('load', userInfo);
document.querySelector('.mypage').addEventListener('click', handleMyPageClick);
document.querySelector('.logout').addEventListener('click', logout);
withdrawalButton.addEventListener('click', withdrawal);