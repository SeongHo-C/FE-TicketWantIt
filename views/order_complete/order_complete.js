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
  location.href = '/views/mypage/order/order.html';
});
