let productViewItem;

async function main() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('productId');

    const response = await axios.get(
      `http://34.64.112.166/api/product/detail?productId=${productId}`
    );
    productViewItem = response.data;

    productView.innerHTML = createView(productViewItem);
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
                <div class="price">${price.toLocaleString()}원</div>
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
            </div>
            <div class="btn_box">
                <button class="btn_cart" onclick='onAddCart()'>장바구니</button>
                <button class="btn_buy" onclick='onDirectBuy()'>바로구매</button>
            </div>
        </div>
    `;
}

function createTicket() {
  const { productId, imageUrl, productName, place, speciesAge, price } =
    productViewItem;

  return {
    productId,
    imageUrl,
    productName,
    place,
    speciesAge,
    price,
    quantity: 1,
  };
}

function onAddCart() {
  const ticket = createTicket();

  const cart = JSON.parse(localStorage.getItem('cart'));
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
}

function onDirectBuy() {
  const ticket = createTicket();

  onNavigateOrder([ticket]);
}

function onNavigateOrder(ticket) {
  localStorage.setItem('ticket_order', JSON.stringify(ticket));

  location.href = '/views/order/order.html';
}

const productView = document.querySelector('.goods_detail');

window.addEventListener('load', () => {
  main();
});
