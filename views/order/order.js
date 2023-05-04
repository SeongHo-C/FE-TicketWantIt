import { isTokenExpired, tokenRefresh } from '../../modules/token.js';
import instance from '../../modules/axios_interceptor.js';

const ticketsInfo = JSON.parse(localStorage.getItem('ticket_order'));

async function onLoad() {
  const tickets = ticketsInfo
    .map((ticketInfo) => createTicket(ticketInfo))
    .join('');
  orderList.innerHTML = tickets;

  const totalPrice = calculateTotalPrice(ticketsInfo);
  paymentBtn.innerHTML = `<p>${totalPrice.toLocaleString()}원 결제하기</p>`;

  const { zipCode, userAddress, userAddressDetail, phoneNumber } =
    await getUser();
  zipCodeInput.value = zipCode;
  addrInput.value = userAddress;
  addrDetailInput.value = userAddressDetail;

  if (phoneNumber) {
    phone1Input.value = phoneNumber[0];
    phone2Input.value = phoneNumber[1];
    phone3Input.value = phoneNumber[2];
  }
}

function createTicket(ticket) {
  const {
    productId,
    imageUrl,
    productName,
    place,
    price,
    quantity = 1,
  } = ticket;

  return `<li class="ticket">
  <a href="/views/goods/goods_view.html?productId=${productId}">
    <img
      class="ticket_img"
      src=${imageUrl}
      alt="상품 이미지"
    />
  </a>
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

async function getUser() {
  try {
    if (isTokenExpired()) await tokenRefresh();

    const response = await instance.get('/api/user');

    let { zipCode = '', address, phoneNumber = '' } = response.data;
    let userAddress = '',
      userAddressDetail = '';

    if (address) {
      userAddress = address.split('(상세주소)')[0].trim();
      userAddressDetail = address.split('(상세주소)')[1].trim() || '';
    }

    if (phoneNumber) phoneNumber = phoneNumber.split('-');

    return { zipCode, userAddress, userAddressDetail, phoneNumber };
  } catch (error) {
    console.log(error);
  }
}

function calculateTotalPrice(ticketsinfo) {
  const totalPrice = ticketsinfo.reduce(
    (sum, { price, quantity }) => sum + price * quantity,
    0
  );

  return totalPrice;
}

function execDaumPostcode() {
  new daum.Postcode({
    oncomplete: function (data) {
      let addr = '';

      if (data.userSelectedType === 'R') addr = data.roadAddress;
      else addr = data.jibunAddress;

      zipCodeInput.value = data.zonecode;
      addrInput.value = addr;

      addrDetailInput.focus();
    },
  }).open();
}

async function pay(data) {
  try {
    if (isTokenExpired()) await tokenRefresh();

    const response = await instance.post('/api/orders', data);

    const { orderId } = response.data;
    onDeleteCart();

    location.href = `/views/orderComplete/orderComplete.html?orderId=${orderId}&totalPrice=${data.totalPrice}`;
  } catch (error) {
    console.log(error);
  }
}

function onDeleteCart() {
  const cart = localStorage.getItem('cart')
    ? JSON.parse(localStorage.getItem('cart'))
    : [];

  if (cart.length < 1) return;

  const productIds = ticketsInfo.map((ticketInfo) => ticketInfo.productId);

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
const addrInput = document.querySelector('.address');
const addrDetailInput = document.querySelector('.address_detail');
const orderForm = document.querySelector('form');
const phone1Input = document.querySelector('#phone1');
const phone2Input = document.querySelector('#phone2');
const phone3Input = document.querySelector('#phone3');

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
  const deliveryAddress = `${address} (상세주소)${addressDetail}`;

  if (!address) {
    alert('주소를 입력해주세요.');
    e.target['address'].focus();
    return;
  }

  const phone1 = e.target['phone_1'].value;
  const phone2 = e.target['phone_2'].value;
  const phone3 = e.target['phone_3'].value;
  const deliveryPhoneNum = `${phone1}-${phone2}-${phone3}`;

  if (!phone2 || !phone3) {
    alert('휴대전화 번호를 입력해주세요.');
    e.target['phone2'].focus();
    return;
  }

  const items = ticketsInfo.map((ticketInfo) => {
    const { productId, productName, quantity, price, imageUrl } = ticketInfo;

    return { productId, name: productName, quantity, price, imgUrl: imageUrl };
  });

  const totalPrice = calculateTotalPrice(ticketsInfo);

  const zipCode = zipCodeInput.value;

  const data = {
    zipCode,
    deliveryAddress,
    deliveryPhoneNum,
    items,
    totalPrice,
  };

  pay(data);
});
