import { getToken, removeToken } from '../../../modules/token.js';
import { isTokenExpired, tokenRefresh } from '../../../modules/token.js';
import instance from '../../../modules/axios_interceptor.js';

const [email, nameInput, address, phoneNumber] = document.querySelectorAll('.userInfo');
const withdrawalButton = document.querySelector('#withdrawalButton');

const userInfo = async () => {
  if (isTokenExpired()) tokenRefresh();
  try {
    const response = await instance.get('/api/user')
    const token = getToken();
    const decodedToken = jwt_decode(token);
    email.innerHTML = decodedToken.email;
    nameInput.innerHTML = decodedToken.name;

    if (
      response.data.address === ` (상세주소)` ||
      response.data.address === undefined
    ) {
      address.innerHTML = '';
    } else {
      address.innerHTML = response.data.address;
    }
    
    if (
      response.data.phoneNumber === `--` ||
      response.data.phoneNumber === undefined
    ) {
      phoneNumber.innerHTML = '';
    } else {
      phoneNumber.innerHTML = response.data.phoneNumber;
    }
  }
  catch (error) {
    alert(`회원정보를 불러오지 못했습니다.`);
    console.log(error);
  };
};

userInfo();

//회원탈퇴
const withdrawal = async (e) => {
  e.preventDefault();

  if (confirm('정말 탈퇴하시겠습니까?')) {
    if (isTokenExpired()) await tokenRefresh();
    try {
      await instance.delete('/api/user')
      removeToken();
      window.location.href = '../../../index.html';
      alert('정상적으로 회원탈퇴가 완료되었습니다. 다음에 또 이용해주세요.');
    }
    catch (error) {
      alert(`회원탈퇴에 실패했습니다. 잠시 뒤 다시 시도해주세요.`);
    };
  } else {
    return;
  }
};

withdrawalButton.addEventListener('click', withdrawal);
