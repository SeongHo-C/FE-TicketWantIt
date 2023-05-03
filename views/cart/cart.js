let ticketsInfo = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : [];

function onLoad() {
  if (ticketsInfo.length < 1) return;

  const tickets = ticketsInfo
    .map((ticketInfo) => createTicket(ticketInfo))
    .join('');
  ticketsList.innerHTML = tickets;

  const totalPrice = calculateTotalPrice(ticketsInfo);
  calculateList.innerHTML = totalPrice;
}

function calculateTotalPrice(ticketsInfo) {
  const totalPrice = ticketsInfo.reduce(
    (sum, { price, quantity }) => sum + price * quantity,
    0
  );

  return `<tr>
  <td><p>${totalPrice.toLocaleString()}원</p></td>
  <td><p>= ${totalPrice.toLocaleString()}원</p></td>
</tr>`;
}

function onMinus(productId) {
  ticketsInfo = ticketsInfo.map((ticketInfo) => {
    const quantity = ticketInfo.quantity;

    if (ticketInfo.productId === productId) {
      if (quantity <= 1) {
        alert('최소 수량은 1개 입니다.');
        return ticketInfo;
      }
      return { ...ticketInfo, quantity: quantity - 1 };
    }
    return ticketInfo;
  });

  localStorage.setItem('cart', JSON.stringify(ticketsInfo));
  location.reload();
}

function onPlus(productId) {
  ticketsInfo = ticketsInfo.map((ticketInfo) => {
    const quantity = ticketInfo.quantity;

    if (ticketInfo.productId === productId) {
      return { ...ticketInfo, quantity: quantity + 1 };
    }
    return ticketInfo;
  });

  localStorage.setItem('cart', JSON.stringify(ticketsInfo));
  location.reload();
}

function createTicket(ticket) {
  const {
    productId,
    imageUrl,
    productName,
    place,
    speciesAge,
    price,
    quantity = 1,
  } = ticket;

  return `<tr id=ticket${productId}>
  <td><input type="checkbox" id=only_check${productId} name='ticket_check'/></td>
  <td>
    <img
      class="ticket_img"
      src="${imageUrl}"
      alt="상품 이미지"
    />
  </td>
  <td>
    <p class="ticket_title">
      ${productName}
    </p>
  </td>
  <td><p>${place}</p></td>
  <td><p>${speciesAge}</p></td>
  <td><p class="ticket_price">${Number(price).toLocaleString()}원</p></td>
  <td class="ticket_quantity">
  <div>
    <button class="minus_button" onclick="onMinus('${productId}')">
    <span></span>
    </button>
    <input type="text" class="ticket_quantity_input" value=${quantity} readonly/>
    <button class="plus_button" onclick="onPlus('${productId}')">
    <span></span>
    </button>
    </div>
  </td>
  <td><p class="ticket_total">${(price * quantity).toLocaleString()}원</p></td>
  <td class="only_ticket">
    <button class="ticket_order" onclick="onlyOrder('${productId}')">
      주문하기
    </button>
    <button class="ticket_delete" onclick="onlyDelete('${productId}')">삭제</button>
  </td>
</tr>
  `;
}

function onCheckedCheckbox() {
  const tickets = document.querySelectorAll('input[name="ticket_check"]');
  const productIds = [];

  for (let ticket of tickets) {
    const productId = ticket.id.split('only_check')[1];
    if (ticket.checked) productIds.push(productId);
  }

  return productIds;
}

function onlyOrder(productId) {
  const ticket = ticketsInfo.find(
    (ticketInfo) => ticketInfo.productId === productId
  );

  onNavigateOrder([ticket]);
}

function allOrder() {
  if (ticketsInfo.length < 1) {
    alert('장바구니에 상품이 없습니다.');
    return;
  }

  onNavigateOrder(ticketsInfo);
}

function selectedOrder() {
  const productIds = onCheckedCheckbox();

  if (productIds.length < 1) {
    alert('선택된 상품이 없습니다.');
    return;
  }

  const selectedTickets = ticketsInfo.filter((ticketInfo) =>
    productIds.includes(ticketInfo.productId)
  );

  onNavigateOrder(selectedTickets);
}

function onNavigateOrder(ticketsInfo) {
  const token = localStorage.getItem('token');

  if (!token) {
    location.href = '/views/login/login.html';
    alert('로그인 후 이용해주시기 바랍니다.');
  }

  localStorage.setItem('ticket_order', JSON.stringify(ticketsInfo));

  location.href = '/views/order/order.html';
}

function allDelete() {
  if (ticketsInfo.length < 1) {
    alert('장바구니에 상품이 없습니다.');
    return;
  }

  onDelete('all');
}

function selectedDelete() {
  const productIds = onCheckedCheckbox();

  if (productIds.length < 1) {
    alert('선택된 상품이 없습니다.');
    return;
  }

  onDelete('selected', productIds);
}

function onlyDelete(productId) {
  onDelete('selected', [productId]);
}

function onDelete(type, productIds) {
  if (type === 'selected')
    ticketsInfo = ticketsInfo.filter(
      (ticketInfo) => !productIds.includes(ticketInfo.productId)
    );
  else ticketsInfo.length = 0;

  localStorage.setItem('cart', JSON.stringify(ticketsInfo));
  location.reload();
}

const ticketsList = document.querySelector('.tickets_list');
const calculateList = document.querySelector('.calculate_list');
const allCheck = document.querySelector('#all_check');
const selectedDeleteBtn = document.querySelector('.selected_delete');
const allDeleteBtn = document.querySelector('.all_delete');
const allOrderBtn = document.querySelector('.all_order');
const selectedOrderBtn = document.querySelector('.selected_order');

window.addEventListener('load', () => {
  onLoad();
});

allCheck.addEventListener('change', () => {
  const checkboxes = document.querySelectorAll('input[name="ticket_check"]');

  if (allCheck.checked) {
    for (let checkbox of checkboxes) checkbox.checked = true;
  } else {
    for (let checkbox of checkboxes) checkbox.checked = false;
  }
});

allOrderBtn.addEventListener('click', () => {
  allOrder();
});

selectedOrderBtn.addEventListener('click', () => {
  selectedOrder();
});

allDeleteBtn.addEventListener('click', () => {
  allDelete();
});

selectedDeleteBtn.addEventListener('click', () => {
  selectedDelete();
});
