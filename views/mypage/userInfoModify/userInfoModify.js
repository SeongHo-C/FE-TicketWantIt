import { getToken } from '../../../modules/token.js';
import { isTokenExpired, tokenRefresh } from '../../../modules/token.js';
import instance from '../../../modules/axios_interceptor.js';

const [nameInput, zipCode, address, addressDetail] =
  document.querySelectorAll('.userInfoInput');

const email = document.querySelector('#email');
const userInfoModifyButton = document.querySelector('#userInfoModifyButton');
const addressSearchBtn = document.querySelector('#addressSearchBtn');
const token = getToken();
const decodedToken = jwt_decode(token);
email.innerHTML = decodedToken.email;
nameInput.setAttribute('value', `${decodedToken.name}`);

function execDaumPostcode() {
  new daum.Postcode({
    oncomplete: function (data) {
      let addr = '';

      if (data.userSelectedType === 'R') addr = data.roadAddress;
      else addr = data.jibunAddress;

      zipCode.value = data.zonecode;
      address.value = addr;

      addressDetail.focus();
    },
  }).open();
}

//유저 정보 수정
const userInfoModify = async () => {
  if (isTokenExpired()) tokenRefresh();
  try {
    await instance.put('/api/user', {
      name: nameInput.value,
      zipCode: `${zipCode.value}`,
      address: `${address.value} (상세주소)${addressDetail.value}`,
    })
      alert('정보가 성공적으로 업데이트 되었습니다.');
    } 
  catch (error)  {
      console.log(error);
      alert(`${error.response.data.message}`);
    };
  }

userInfoModifyButton.addEventListener('click', userInfoModify);
addressSearchBtn.addEventListener('click', execDaumPostcode);
