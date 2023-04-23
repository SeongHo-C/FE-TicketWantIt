import { logout } from '../../modules/logout.js';
import { handleMyPageClick } from '../../modules/goToMypage.js';
import { addInterceptor, getToken } from '../../modules/interceptor.js'

addInterceptor();

const [
  nameInput
 ] = document.querySelectorAll('.userInfoInput');

const userInfoModifyButton = document.querySelector('#userInfoModifyButton');
const warning = document.querySelector('#warning');

//유저 정보 수정
const userInfoModify = () => {

  if (nameInput.value.length < 2) {
        warning.style.color = 'red';
        return false;
  }

  axios.put('/api/user', 
  {
      name: nameInput.value
  }, {
    headers: {'Authorization': `Bearer ${getToken()}`}
  })
  .then((res) => {
    if (res.data) {
      alert('정보가 성공적으로 업데이트 되었습니다.')
    } else {
      alert('정보 업데이트에 실패했습니다. 잠시 뒤 다시 시도해주세요.');
    }
  })
  .catch((err) => {
    console.log(err);
    alert('정보 업데이트에 실패했습니다. 잠시 뒤 다시 시도해주세요.');
  })
}

nameInput.addEventListener('input', () => {
  if (nameInput.value.length > 0) {
    nameError.style.color = '#cccccc';
  }
});

document.querySelector('.mypage').addEventListener('click', handleMyPageClick);
document.querySelector('.logout').addEventListener('click', logout);
userInfoModifyButton.addEventListener('click', userInfoModify);