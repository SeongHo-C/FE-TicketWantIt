import URL from '../../modules/server_url.js';

let productViewItem;
let quantity = 1;

async function onLoad() {
  try {
    const urlParams = new URLSearchParams(location.search);
    const productId = urlParams.get('productId');

    const response = await axios.get(
      `${URL}/api/product/detail?productId=${productId}`
    );
    productViewItem = response.data;

    productView.innerHTML = createView(productViewItem);

    const addCartBtn = document.querySelector('.btn_box > .btn_cart');
    const directBuyBtn = document.querySelector('.btn_box > .btn_buy');
    const minusBtn = document.querySelector('.ticket_quantity > .minus_btn');
    const plusBtn = document.querySelector('.ticket_quantity > .plus_btn');

    addCartBtn.onclick = onAddCart;
    directBuyBtn.onclick = onDirectBuy;
    minusBtn.addEventListener('click', () => onCount('minus'));
    plusBtn.addEventListener('click', () => onCount('plus'));
  } catch (error) {
    console.log(error);
  }
}

function createView(data) {
  const {
    description,
    startDate,
    endDate,
    imageUrl,
    place,
    price,
    productName,
    speciesAge,
    discount,
    discountPrice
  } = data;

  return `<div class="img_box">
            <img
                src=${imageUrl}
                alt="상품 이미지"
            />
            </div>
          <div class="info_box">
            <div class="ticket_info">
                <div class="top">
                    <div class="date">${startDate} ~ ${endDate}</div>
                    <div class="title">
                    ${productName}
                    </div>
                    <div class="description">
                        ${description}
                    </div>
                </div>
                <div class="price_box ${discount !== 0 ? 'discount' : ''}">
                  <strong class="discount">${discount}%</strong>
                  <span class="discount_price">
                  ${Number(discountPrice).toLocaleString('ko-KR')}원
                  </span>
                  <span class="fixed_price">${Number(price).toLocaleString('ko-KR')}원</span>
                </div>
                <div class="detail_info">
                    <dl class="age">
                        <dt>연령제한</dt>
                        <dd>${speciesAge}</dd>
                    </dl>
                    <dl>
                        <dt>장소</dt>
                        <dd>${place}</dd>
                    </dl>
                </div>
                <div class="ticket_quantity">
                    <button class="minus_btn">
                        <span></span>
                    </button>
                    <input type="text" value=${quantity} readonly/>
                    <button class="plus_btn">
                        <span></span>
                    </button>
                </div>
            </div>
            <div class="btn_box">
                <button class="btn_cart button_dw border">장바구니</button>
                <button class="btn_buy button_dd border">바로구매</button>
            </div>
        </div>
    `;
}

function onAddCart() {
  const ticket = createTicket();

  const cart = localStorage.getItem('cart')
    ? JSON.parse(localStorage.getItem('cart'))
    : false;

  if (cart) {
    const isTicket = cart.find((item) => item.productId === ticket.productId);

    if (isTicket) {
      alert('장바구니에 상품이 이미 존재합니다.');
      return;
    }

    cart.push(ticket);
    localStorage.setItem('cart', JSON.stringify(cart));
  } else {
    localStorage.setItem('cart', JSON.stringify([ticket]));
  }

  alert('장바구니에 상품이 추가되었습니다.');
  location.reload();
}

function onDirectBuy() {
  const token = localStorage.getItem('token');

  if (!token) {
    location.href = '/views/login/login.html';
    alert('로그인 후 이용해주시기 바랍니다.');
  }

  const ticket = createTicket();

  onNavigateOrder([ticket]);
}

function onNavigateOrder(ticket) {
  localStorage.setItem('ticket_order', JSON.stringify(ticket));

  location.href = '../order/order.html';
}

function onCount(type) {
  const quantityInput = document.querySelector('.ticket_quantity > input');

  if (type === 'minus') {
    if (quantity <= 1) {
      alert('상품의 최소 수량은 1개입니다.');
      return;
    }

    quantity -= 1;
    quantityInput.value = quantity;
  } else {
    quantity += 1;
    quantityInput.value = quantity;
  }
}

function createTicket() {
  const { productId, imageUrl, productName, place, speciesAge, price, discount, discountPrice } =
    productViewItem;

  return {
    productId,
    imageUrl,
    productName,
    place,
    speciesAge,
    price,
    quantity,
    discount,
    discountPrice
  };
}

const productView = document.querySelector('.goods_detail');

window.addEventListener('load', () => {
  onLoad();
});
