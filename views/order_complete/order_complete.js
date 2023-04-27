function onLoad(orderId, totalPrice) {
  orderCompleteNum.innerHTML += `<p>${orderId}</p>`;
  orderCompleteMoney.innerHTML += `<p>${totalPrice.toLocaleString()}원</p>`;
}

const orderCompleteNum = document.querySelector('.order_complete_number');
const orderCompleteMoney = document.querySelector('.order_complete_money');
const orderDetailCheckBtn = document.querySelector(
  '.order_detail_check > button'
);

window.addEventListener('load', () => {
  const url = new URL(window.location.href);
  const urlParams = url.searchParams;

  const orderId = urlParams.get('orderId');
  const totalPrice = Number(urlParams.get('totalPrice'));

  onLoad(orderId, totalPrice);
});

orderDetailCheckBtn.addEventListener('click', () => {
  const token = localStorage.getItem('token');

  if (!token) {
    location.href = '/views/login/login.html';
    alert('로그인 후 이용해주시기 바랍니다.');
  }

  location.href = '/views/mypage/order/order.html';
});
