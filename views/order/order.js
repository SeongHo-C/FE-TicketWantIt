function onLoad() {
  const tickets_info = JSON.parse(localStorage.getItem('ticket_order'));

  for (let ticket_info of tickets_info) {
    const ticket = createTicket(ticket_info);
    orderList.innerHTML += ticket;
  }
}

function createTicket(ticket) {
  const { imageUrl, productName, place, price, quantity = 1 } = ticket;

  return `<li class="ticket">
  <img
    class="ticket_img"
    src=${imageUrl}
    alt="샘플 이미지"
  />
  <div class="ticket_info">
    <a href="/">${productName}</a>
    <div class="ticket_sub_info">
      <p>장소: ${place}</p>
      <p>수량: ${quantity}개</p>
    </div>
    <p class="ticket_money">${(price * quantity).toLocaleString()}원</p>
  </div>
</li>`;
}

function execDaumPostcode() {
  new daum.Postcode({
    oncomplete: function (data) {
      console.log(data.roadAddress);
    },
  }).open();
}

const orderList = document.querySelector('.order_list');
const addressSearchBtn = document.querySelector('#addressSearchBtn');

window.addEventListener('load', () => {
  onLoad();
});

addressSearchBtn.addEventListener('click', () => {
  execDaumPostcode();
});
