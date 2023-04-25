const tickets_info = JSON.parse(localStorage.getItem('ticket_order'));

function onLoad() {
  for (let ticket_info of tickets_info) {
    const ticket = createTicket(ticket_info);
    orderList.innerHTML += ticket;
  }

  const totalPrice = calculateTotalPrice(tickets_info);
  paymentBtn.innerHTML = `<p>${totalPrice.toLocaleString()}원 결제하기</p>`;
}

function calculateTotalPrice(tickets_info) {
  const totalPrice = tickets_info.reduce(
    (sum, { price, quantity }) => sum + price * quantity,
    0
  );

  return totalPrice;
}

function createTicket(ticket) {
  const { imageUrl, productName, place, price, quantity = 1 } = ticket;

  return `<li class="ticket">
  <img
    class="ticket_img"
    src=${imageUrl}
    alt="상품 이미지"
  />
  <div class="ticket_info">
    <h2>${productName}</h2>
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
      let addr = '';

      if (data.userSelectedType === 'R') addr = data.roadAddress;
      else addr = data.jibunAddress;

      zipCodeInput.value = data.zonecode;
      addressInput.value = addr;

      addressDetail.focus();
    },
  }).open();
}

async function pay(data) {
  try {
    const response = await axios.post('http://34.64.112.166/api/orders', data, {
      headers: {
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaG9ydElkIjoiblgydE5VS1VaYjhzTnNfY0NjS0NfIiwibmFtZSI6InNkZGRkZGRzIiwiZW1haWwiOiJzZW9uZ2hvQGdtYWlsLmNvbSIsImlzQWRtaW4iOmZhbHNlLCJpc1RlbXBQYXNzd29yZCI6ZmFsc2UsImlhdCI6MTY4MjQ0MjQyMSwiZXhwIjoxNjgyNDQ2MDIxfQ.1yC0U2hLV2UbeOZ-n-1H2jZP58Bzm3QOigHHtlwuGcw',
      },
    });

    const { orderId } = response.data;
    onDeleteCart();

    location.href = `/views/order_complete/order_complete.html?orderId=${orderId}&totalPrice=${data.totalPrice}`;
  } catch (error) {
    console.log(error);
  }
}

function onDeleteCart() {
  const cart = JSON.parse(localStorage.getItem('cart'));

  const productIds = tickets_info.map((ticket_info) => ticket_info.productId);

  const remainingCart = cart.filter(
    (item) => !productIds.includes(item.productId)
  );

  const storeCart = remainingCart.length > 0 ? remainingCart : [];
  localStorage.setItem('cart', JSON.stringify(storeCart));
}

const orderList = document.querySelector('.order_list');
const addressSearchBtn = document.querySelector('#addressSearchBtn');
const paymentBtn = document.querySelector('.payment_button');
const zipCodeInput = document.querySelector('.zip-code');
const addressInput = document.querySelector('.address');
const addressDetail = document.querySelector('.address_detail');
const orderForm = document.querySelector('form');

window.addEventListener('load', () => {
  onLoad();
});

addressSearchBtn.addEventListener('click', () => {
  execDaumPostcode();
});

orderForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const address = e.target['address'].value;
  const addressDetail = e.target['addressDetail'].value;
  const customerAddress = `${address} (상세주소)${addressDetail}`;

  if (!address) {
    alert('주소를 입력해주세요.');
    e.target['address'].focus();
    return;
  }

  const phone1 = e.target['phone_1'].value;
  const phone2 = e.target['phone_2'].value;
  const phone3 = e.target['phone_3'].value;
  const customerPhoneNum = `${phone1}-${phone2}-${phone3}`;

  if (!phone2 || !phone3) {
    alert('휴대전화 번호를 입력해주세요.');
    e.target['phone2'].focus();
    return;
  }

  const items = tickets_info.map((ticket_info) => {
    const { productName, quantity, price } = ticket_info;

    return { name: productName, quantity, price };
  });

  const totalPrice = calculateTotalPrice(tickets_info);

  const zipCode = zipCodeInput.value;

  const data = {
    zipCode,
    customerAddress,
    customerPhoneNum,
    items,
    totalPrice,
  };

  pay(data);
});
