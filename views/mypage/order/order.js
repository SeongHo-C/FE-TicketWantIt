async function onLoad() {
  const { orderList } = await getOrder();
  console.log(orderList);
  for (let orderData of orderList) {
    const order = createOrder(orderData);
    orderTableList.innerHTML += order;
  }
}

function createOrder(orderData) {
  const {
    items,
    orderId,
    orderStatus,
    zipCode,
    date,
    customerAddress = '모르는 주소',
    customerPhoneNum = '없는 번호',
  } = orderData;

  return items
    .map((item, idx) => {
      if (idx === 0)
        return firstItemTemplate(
          date,
          item,
          orderId,
          orderStatus,
          zipCode,
          items.length,
          customerAddress,
          customerPhoneNum
        );
      else return extraItemTemplate(item);
    })
    .join('');
}

function firstItemTemplate(
  date,
  item,
  orderId,
  orderStatus,
  zipCode,
  num,
  customerAddress,
  customerPhoneNum
) {
  const { name, quantity, price } = item;
  orderStatus = getOrderStatus(orderStatus);

  return `<tr>
              <td rowspan=${num}>
                <p>${date}<br />[${orderId}]</p>
              </td>
              <td>
                <img
                  src="https://img.29cm.co.kr//next-product/2023/04/03/ad7307f5595b433cab22b2bc26c9124c_20230403114503.jpg"
                  alt="상품 이미지"
                />
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
                    ? `<button class="modify_button" onclick="orderModify('${zipCode}', '${customerAddress}', '${customerPhoneNum}')">수정하기</button>
                  <button class="cancel_button" onclick="orderCancel()">취소하기</button>`
                    : ''
                }
              </td>
            </tr>`;
}

function orderModify(zipCode, customerAddress, customerPhoneNum) {}

function extraItemTemplate(item) {
  const { name, quantity, price } = item;

  return ` <tr>
          <td>
          <img
            src="https://img.29cm.co.kr//next-product/2023/04/03/ad7307f5595b433cab22b2bc26c9124c_20230403114503.jpg"
            alt="상품 이미지"
          />
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

async function getOrder() {
  try {
    const response = await axios.get('http://34.64.112.166/api/orders', {
      headers: {
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaG9ydElkIjoiblgydE5VS1VaYjhzTnNfY0NjS0NfIiwibmFtZSI6InNkZGRkZGRzIiwiZW1haWwiOiJzZW9uZ2hvQGdtYWlsLmNvbSIsImlzQWRtaW4iOmZhbHNlLCJpc1RlbXBQYXNzd29yZCI6ZmFsc2UsImlhdCI6MTY4MjQzOTQxOSwiZXhwIjoxNjgyNDQzMDE5fQ.R4U-iculWX9Y1PUIVGjqOWgqeA9FKz4v1Z6cC5JR4IQ',
      },
    });

    return response.data;
  } catch (error) {
    console.log(error);
  }
}

function getOrderStatus(orderStatus) {
  if (orderStatus === 1) return '주문중';
  else if (orderStatus === 2) return '배송중';
  else return '배송 완료';
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

const modifyBtn = document.querySelector('.modify_button');
const modal = document.querySelector('#modal');
const body = document.querySelector('body');
const closeModalBtn = document.querySelector('.close_area > button');
const addressSearchBtn = document.querySelector('#addressSearchBtn');
const zipCodeInput = document.querySelector('.zip-code');
const addressInput = document.querySelector('.address');
const addressDetail = document.querySelector('.address_detail');
const orderTableList = document.querySelector('.order_table > .order_list');

window.addEventListener('load', () => {
  onLoad();
});

closeModalBtn.addEventListener('click', () => {
  modal.style.display = 'none';
  body.style.overflow = 'auto';
});

addressSearchBtn.addEventListener('click', () => {
  execDaumPostcode();
});
