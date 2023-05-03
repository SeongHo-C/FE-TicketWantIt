import { getToken } from '../../../modules/token.js';
import { isTokenExpired, tokenRefresh } from '../../../modules/token.js';
import instance from '../../../modules/axios_interceptor.js';

const [nameInput, zipCode, address, addressDetail,
  phoneNumber1, phoneNumber2, phoneNumber3] =
  document.querySelectorAll('.userInfoInput');

const email = document.querySelector('#email');
const userInfoModifyButton = document.querySelector('#userInfoModifyButton');
const addressSearchBtn = document.querySelector('#addressSearchBtn');
const token = getToken();
const decodedToken = jwt_decode(token);
email.innerHTML = decodedToken.email;

//사용자 정보 미리 input에 넣어놓기
const userInfo = async () => {
  if (isTokenExpired()) tokenRefresh();
  try {
    const response = await instance.get('/api/user')
    nameInput.setAttribute('value', `${decodedToken.name}`);
    if (response.data.address !== ` (상세주소)` &&
        response.data.address !== undefined) {
        const addressArr = response.data.address.split(' (상세주소)');
        zipCode.setAttribute('value', response.data.zipCode);
        address.setAttribute('value', addressArr[0]);
        addressDetail.setAttribute('value', addressArr[1]);
    } else {
      zipCode.setAttribute('value', '');
      address.setAttribute('value', '');
      addressDetail.setAttribute('value', '');
    }
    
    if (response.data.phoneNumber !== `--` &&
        response.data.phoneNumber !== undefined) {
        const phoneNumberArr = response.data.phoneNumber.split('-');
        phoneNumber1.setAttribute('value', phoneNumberArr[0]);
        phoneNumber2.setAttribute('value', phoneNumberArr[1]);
        phoneNumber3.setAttribute('value', phoneNumberArr[2]);
    } else {
        phoneNumber1.setAttribute('value', '');
        phoneNumber2.setAttribute('value', '');
        phoneNumber3.setAttribute('value', '');
    }
  }
  catch (error) {
    alert(`회원정보를 불러오지 못했습니다.`);
    console.log(error);
  };
};

userInfo();

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
  if (isTokenExpired()) await tokenRefresh();

  const regPhone= /^([0-9]{2,3})-([0-9]{3,4})-([0-9]{4})$/;
  const phoneNumber = `${phoneNumber1.value}-${phoneNumber2.value}-${phoneNumber3.value}`
  if (regPhone.test(phoneNumber)) {
    try {
      await instance.put('/api/user', {
      name: nameInput.value,
      zipCode: `${zipCode.value}`,
      address: `${address.value} (상세주소)${addressDetail.value}`,
      phoneNumber: phoneNumber
    })
      alert('정보가 성공적으로 업데이트 되었습니다.');
    } 
    catch (error)  {
      console.log(error);
      alert(`${error.response.data.message}`);
    };
  } else {
    alert('전화번호 형식에 맞게 다시 적어주시기 바랍니다.')
  }
}

userInfoModifyButton.addEventListener('click', userInfoModify);
addressSearchBtn.addEventListener('click', execDaumPostcode);
