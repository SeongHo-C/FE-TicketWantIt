import { getToken,saveToken } from '../../../modules/token.mjs';
import URL from '../../../modules/server_url.mjs';

const [
  nameInput,
  zipCode,
  address,
  addressDetail
 ] = document.querySelectorAll('.userInfoInput');

const email = document.querySelector('#email');
const userInfoModifyButton = document.querySelector('#userInfoModifyButton');
const warning = document.querySelector('#warning');
const addressSearchBtn = document.querySelector('#addressSearchBtn')
const token = getToken();
const decodedToken = jwt_decode(token);
email.innerHTML = decodedToken.email;

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
const userInfoModify = () => {

  if (nameInput.value.length < 2) {
        warning.style.color = 'red';
        return false;
  }

  axios.put(`${URL}/api/user`, 
  {
      name: nameInput.value,
      zipCode: `${zipCode.value}`,
      address: `${address.value} (상세주소)${addressDetail.value}`
  }, {
    headers: {'Authorization': `Bearer ${getToken()}`}
  })
  .then((response) => {
    if (response) {
      axios.get(`${URL}/api/auth`,
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
  .catch((error) => {
    alert(`${error.response.data.message}`);
  })
}

userInfoModifyButton.addEventListener('click', userInfoModify);
addressSearchBtn.addEventListener("click", execDaumPostcode);