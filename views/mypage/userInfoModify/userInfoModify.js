const [
  nameInput,
  password,
  confirmPassword
] = document.querySelectorAll('.userCurrentInfoInput');

const userInfoModifyButton = document.querySelector('#infoModifyButton');
const withdrawalButton = document.querySelector('#withdrawalButton')
const warning = document.querySelector('#warning');

//전화번호 유효성 검사
const numberCheck = (number) => {
  var numRegExp = /^\d{3}-\d{3,4}-\d{4}$/;

  if (!numRegExp.test(number.value)) {
    alert("잘못된 휴대폰 번호입니다. 숫자, - 를 포함한 숫자를 입력해주세요.");
    return false;
  }
}


//유저 정보 수정
const userInfoModify = (e) => {
  e.preventDefault();

  numberCheck(number);

  if (nameInput.value.length < 2 ||
      number.value.length < 6 ||
      address.value === '') {
        warning.style.color = 'red';
        return false;
      }

  if (password !== confirmPassword) {
    return false;
  }

  axios.put('/api/user', {
      name: nameInput.value,
      password: password.value,
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

//회원탈퇴
const withdrawal = (e) => {
  e.preventDefault();

  if (confirm('정말 탈퇴하시겠습니까?')) {
    axios.delete('/api/user')
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

userInfoModifyButton.addEventListener('click', userInfoModify);
withdrawalButton.addEventListener('click', withdrawal);