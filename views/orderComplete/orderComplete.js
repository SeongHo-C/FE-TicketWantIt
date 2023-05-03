import { getToken } from '../../modules/token.js';

function onLoad(orderId, totalPrice) {
  orderNumber.innerHTML += `<p>${orderId}</p>`;
  orderMoney.innerHTML += `<p>${totalPrice.toLocaleString()}원</p>`;
}

const orderNumber = document.querySelector('.order_number');
const orderMoney = document.querySelector('.order_money');
const orderDetailCheckBtn = document.querySelector(
  '.order_detail_check > button'
);

window.addEventListener('load', () => {
  const url = new URL(location.href);
  const urlParams = url.searchParams;

  const orderId = urlParams.get('orderId');
  const totalPrice = Number(urlParams.get('totalPrice'));

  onLoad(orderId, totalPrice);
});

orderDetailCheckBtn.addEventListener('click', () => {
  const token = getToken();

  if (!token) {
    location.href = '/views/login/login.html';
    alert('로그인 후 이용해주시기 바랍니다.');
  }

  location.href = '/views/mypage/order/order.html';
});
