function execDaumPostcode() {
  new daum.Postcode({
    oncomplete: function (data) {
      let addr = '';

      if (data.userSelectedType === 'R') addr = data.roadAddress;
      else addr = data.jibunAddress;

      zipCodeInput.value = data.zonecode;
      addressInput.value = addr;

      addressDetail.focus();
    },
  }).open();
}

const modifyBtn = document.querySelector('.modify_button');
const modal = document.querySelector('#modal');
const body = document.querySelector('body');
const closeModalBtn = document.querySelector('.close_area > button');
const addressSearchBtn = document.querySelector('#addressSearchBtn');
const zipCodeInput = document.querySelector('.zip-code');
const addressInput = document.querySelector('.address');
const addressDetail = document.querySelector('.address_detail');

modifyBtn.addEventListener('click', () => {
  modal.style.display = 'flex';
  body.style.overflow = 'hidden';
});

closeModalBtn.addEventListener('click', () => {
  modal.style.display = 'none';
  body.style.overflow = 'auto';
});

addressSearchBtn.addEventListener('click', () => {
  execDaumPostcode();
});
