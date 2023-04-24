let tickets_info = JSON.parse(localStorage.getItem('cart'));

function onLoad() {
  if (tickets_info.length < 1) return;
  const tickets = tickets_info
    .map((ticket_info) => createTicket(ticket_info))
    .join('');

  ticketsList.innerHTML = tickets;

  const totalPrice = calculateTotalPrice(tickets_info);
  calculateList.innerHTML = totalPrice;
}

function calculateTotalPrice(tickets_info) {
  const totalPrice = tickets_info.reduce(
    (sum, { price, quantity }) => sum + price * quantity,
    0
  );

  return `<tr>
  <td><p>${totalPrice.toLocaleString()}원</p></td>
  <td><p>= ${totalPrice.toLocaleString()}원</p></td>
</tr>`;
}

function onMinus(productId) {
  tickets_info = tickets_info.map((ticket_info) => {
    const quantity = ticket_info.quantity;

    if (ticket_info.productId === productId) {
      if (quantity <= 1) {
        alert('최소 수량은 1개 입니다.');
        return ticket_info;
      }
      return { ...ticket_info, quantity: quantity - 1 };
    }
    return ticket_info;
  });

  localStorage.setItem('cart', JSON.stringify(tickets_info));
  location.reload();
}

function onPlus(productId) {
  tickets_info = tickets_info.map((ticket_info) => {
    const quantity = ticket_info.quantity;

    if (ticket_info.productId === productId) {
      return { ...ticket_info, quantity: quantity + 1 };
    }
    return ticket_info;
  });

  localStorage.setItem('cart', JSON.stringify(tickets_info));
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
  console.log(ticket);
  return `<tr id=ticket${productId}>
  <td><input type="checkbox" id=only_check${productId} name='ticket_check'/></td>
  <td>
    <img
      class="ticket_img"
      src="${imageUrl}"
      alt="sample image"
    />
  </td>
  <td>
    <p class="ticket_title">
      ${productName}
    </p>
  </td>
  <td><p>${place}</p></td>
  <td><p>${speciesAge}</p></td>
  <td><p class="ticket_price">${price.toLocaleString()}원</p></td>
  <td class="ticket_quantity">
    <button class="quantity_minus_button" onclick="onMinus('${productId}')">
      <i class="fas fa-minus"></i>
    </button>
    <input type="text" class="ticket_quantity_input" value=${quantity} />
    <button class="quantity_plus_button" onclick="onPlus('${productId}')">
      <i class="fas fa-plus"></i>
    </button>
  </td>
  <td><p class="ticket_total">${(price * quantity).toLocaleString()}원</p></td>
  <td class="only_ticket">
    <button class="ticket_order" onclick='onlyOrder(${productId})'>
      주문하기
    </button>
    <button class="ticket_delete" onclick='onlyDelete(${productId})'>삭제</button>
  </td>
</tr>
  `;
}

function onCheckedCheckbox() {
  const tickets = document.querySelectorAll('input[name="ticket_check"]');
  const productIds = [];

  for (let ticket of tickets) {
    const productId = ticket.id.slice(-1);
    if (ticket.checked) productIds.push(productId);
  }

  return productIds;
}

function onlyOrder(productId) {
  const ticket = tickets_info.find(
    (ticket_info) => ticket_info.productId === String(productId)
  );

  onNavigateOrder([ticket]);
}

function allOrder() {
  if (tickets_info.length < 1) {
    alert('장바구니에 상품이 없습니다.');
    return;
  }

  onNavigateOrder(tickets_info);
}

function selectedOrder() {
  const productIds = onCheckedCheckbox();

  if (productIds.length < 1) {
    alert('선택된 상품이 없습니다.');
    return;
  }

  const selectedTickets = tickets_info.filter((ticket_info) =>
    productIds.includes(ticket_info.productId)
  );

  onNavigateOrder(selectedTickets);
}

function onNavigateOrder(tickets_info) {
  localStorage.setItem('ticket_order', JSON.stringify(tickets_info));

  location.href = '/views/order/order.html';
}

function allDelete() {
  if (tickets_info.length < 1) {
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
  if (tickets_info.length < 1) {
    alert('장바구니에 상품이 없습니다.');
    return;
  }

  onDelete('selected', [productId]);
}

function onDelete(type, productIds = []) {
  if (type === 'selected')
    tickets_info = tickets_info.filter(
      (ticket_info) => !productIds.includes(ticket_info.productID)
    );
  else tickets_info.length = 0;

  localStorage.setItem('cart', tickets_info);
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
