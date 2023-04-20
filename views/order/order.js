function execDaumPostcode() {
  new daum.Postcode({
    oncomplete: function (data) {
      console.log(data.roadAddress);
    },
  }).open();
}

const addressSearchBtn = document.querySelector('#addressSearchBtn');

addressSearchBtn.addEventListener('click', () => {
  execDaumPostcode();
});
