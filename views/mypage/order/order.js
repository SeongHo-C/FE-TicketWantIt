import { isTokenExpired, tokenRefresh } from '../../../modules/token.js';
import instance from '../../../modules/axios_interceptor.js';

async function onLoad() {
  const response = await getOrder();

  const orderList = response.orderList;
  if (orderList.length < 1) return;

  orderTableList.innerHTML = orderList.map(createOrder).join('');
}

async function getOrder() {
  try {
    if (isTokenExpired()) await tokenRefresh();

    const response = await instance.get('/api/orders');

    return response.data;
  } catch (error) {
    console.log(error);
  }
}

function createOrder(orderData) {
  const {
    createdAt,
    items,
    orderId,
    orderStatus,
    zipCode,
    deliveryAddress = '모르는 주소',
    deliveryPhoneNum = '없는 번호',
  } = orderData;

  return items
    .map((item, idx) => {
      if (idx === 0)
        return firstItemTemplate(
          createdAt,
          item,
          orderId,
          orderStatus,
          zipCode,
          items.length,
          deliveryAddress,
          deliveryPhoneNum
        );
      else return extraItemTemplate(item);
    })
    .join('');
}

function firstItemTemplate(
  createdAt,
  item,
  orderId,
  orderStatus,
  zipCode,
  num,
  deliveryAddress,
  deliveryPhoneNum
) {
  const {
    productId,
    name,
    quantity,
    price,
    imgUrl = 'https://img.29cm.co.kr//next-product/2023/04/03/ad7307f5595b433cab22b2bc26c9124c_20230403114503.jpg',
  } = item;
  orderStatus = getOrderStatus(orderStatus);

  return `<tr>
              <td rowspan=${num}>
                <p>${createdAt.split('T')[0]}<br />[${orderId}]</p>
              </td>
              <td>
                <a href="/views/goods/goods_view.html?productId=${productId}">
                  <img
                    src=${imgUrl}
                    alt="상품 이미지"
                  />
                </a>
              </td>
              <td class="product_info">
                <p>${name}</p>
              </td>
              <td><p>${quantity}</p></td>
              <td class="order_price"><p>${(
                price * quantity
              ).toLocaleString()}원</p></td>
              <td rowspan=${num} class="order_status">
                <p>${orderStatus}</p>
                ${
                  orderStatus === '주문중'
                    ? `<button class="modify_button" onclick="orderModify('${zipCode}', '${deliveryAddress}', '${deliveryPhoneNum}', '${orderId}')">수정하기</button>
                  <button class="cancel_button" onclick="orderCancel('${orderId}')">취소하기</button>`
                    : ''
                }
                ${
                  orderStatus === '배송완료'
                    ? `<button class="confirm_button" onclick="orderConfirm('${orderId}')">구매확정</button>`
                    : ''
                }
              </td>
            </tr>`;
}

function extraItemTemplate(item) {
  const {
    productId,
    name,
    quantity,
    price,
    imgUrl = 'https://img.29cm.co.kr//next-product/2023/04/03/ad7307f5595b433cab22b2bc26c9124c_20230403114503.jpg',
  } = item;

  return ` <tr>
          <td>
            <a href="/views/goods/goods_view.html?productId=${productId}">
              <img
                src=${imgUrl}
                alt="상품 이미지"
              />
            </a>
          </td>
          <td class="product_info">
            <p>${name}</p>
          </td>
          <td><p>${quantity}</p></td>
          <td class="order_price"><p>${(
            price * quantity
          ).toLocaleString()}원</p></td>
        </tr>`;
}

function getOrderStatus(orderStatus) {
  if (orderStatus === 1) return '주문중';
  else if (orderStatus === 2) return '배송중';
  else if (orderStatus === 3) return '배송완료';
  else return '구매확정';
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

window.orderConfirm = orderConfirm;
async function orderConfirm(orderId) {
  try {
    const isConfirm = confirm('구매확정 하시겠습니까?');

    if (isConfirm) {
      if (isTokenExpired()) await tokenRefresh();

      const response = await instance.put(`/api/orders/delivery/${orderId}`);

      if (response) alert('구매확정이 완료되었습니다.');
      location.reload();
    }
  } catch (error) {
    console.log(error);
  }
}

window.orderModify = orderModify;
function orderModify(zipCode, deliveryAddress, deliveryPhoneNum, orderId) {
  modal.style.display = 'flex';
  body.style.overflow = 'hidden';

  const [primary, detail] = deliveryAddress.split('(상세주소)');
  const [phone1, phone2, phone3] = deliveryPhoneNum.split('-');

  zipCodeInput.value = zipCode || '';
  addressInput.value = primary || '';
  addressDetail.value = detail || '';
  phone1Input.value = phone1 || '010';
  phone2Input.value = phone2 || '';
  phone3Input.value = phone3 || '';

  modalForm.name = orderId;
}

async function modifyAPI(data, orderId) {
  try {
    if (isTokenExpired()) await tokenRefresh();

    const response = await instance.put(`/api/orders/${orderId}`, data);

    if (response) alert('주문정보 수정이 완료되었습니다.');
    location.reload();
  } catch (error) {
    console.log(error);
  }
}

window.orderCancel = orderCancel;
function orderCancel(orderId) {
  const isConfirm = window.confirm('정말로 주문을 취소하시겠습니까?');

  if (isConfirm) cancelAPI(orderId);
}

async function cancelAPI(orderId) {
  try {
    if (isTokenExpired()) await tokenRefresh();

    const response = await instance.delete(`/api/orders/${orderId}`);

    if (response) alert('주문 취소가 완료되었습니다.');
    location.reload();
  } catch (error) {
    console.log(error);
  }
}

const body = document.querySelector('body');
const modal = document.querySelector('#modal');
const modalForm = document.querySelector('.modal_form');
const closeModalBtn = document.querySelector('.close_area > button');
const addressSearchBtn = document.querySelector('#addressSearchBtn');
const orderTableList = document.querySelector('.order_table > .order_list');
const zipCodeInput = document.querySelector('.zip-code');
const addressInput = document.querySelector('.address');
const addressDetail = document.querySelector('.address_detail');
const phone1Input = document.querySelector('#phone1');
const phone2Input = document.querySelector('#phone2');
const phone3Input = document.querySelector('#phone3');

window.addEventListener('load', () => {
  onLoad();
});

closeModalBtn.addEventListener('click', (e) => {
  e.preventDefault();

  modal.style.display = 'none';
  body.style.overflow = 'auto';
});

addressSearchBtn.addEventListener('click', () => {
  execDaumPostcode();
});

modalForm.addEventListener('submit', (e) => {
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

  const orderId = e.target.name;

  const data = {
    deliveryAddress,
    deliveryPhoneNum,
  };

  modifyAPI(data, orderId);
});
