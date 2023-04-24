let tickets_info = [
  {
    productID: '0',
    imageUrl:
      'https://img.29cm.co.kr//next-product/2023/04/03/ad7307f5595b433cab22b2bc26c9124c_20230403114503.jpg',
    productName: '[얼리버드] 에드워드 호퍼: 길 위에서 6월 티켓',
    place: '서울시립미술관',
    speciesAge: 15,
    price: 30000,
    quantity: 1,
  },
  {
    productID: '1',
    imageUrl:
      'https://img.29cm.co.kr//next-product/2023/04/03/ad7307f5595b433cab22b2bc26c9124c_20230403114503.jpg',
    productName: '[얼리버드] 에드워드 호퍼: 길 위에서 6월 티켓',
    place: '서울시립미술관',
    speciesAge: 15,
    price: 20000,
    quantity: 3,
  },
];

function onLoad() {
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

// 상세 페이지에서 localstorage에 장바구니 추가 작업 필요
function onMinus(productID) {
  tickets_info = tickets_info.map((ticket_info) => {
    const quantity = ticket_info.quantity;

    if (ticket_info.productID === productID) {
      if (quantity <= 1) {
        alert('최소 수량은 1개 입니다.');
        return;
      }

      return { ...ticket_info, quantity: quantity - 1 };
    }
    return ticket_info;
  });

  // location.reload();
}

// 상세 페이지에서 localstorage에 장바구니 추가 작업 필요
function onPlus(productID) {
  tickets_info = tickets_info.map((ticket_info) => {
    const quantity = ticket_info.quantity;

    if (ticket_info.productID === productID) {
      return { ...ticket_info, quantity: quantity + 1 };
    }

    return ticket_info;
  });

  // location.reload();
}

function createTicket(ticket) {
  const {
    productID,
    imageUrl,
    productName,
    place,
    speciesAge,
    price,
    quantity = 1,
  } = ticket;

  return `<tr id=ticket${productID}>
  <td><input type="checkbox" id=only_check${productID} name='ticket_check'/></td>
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
  <td><p>${speciesAge}세 이상</p></td>
  <td><p class="ticket_money">${price.toLocaleString()}원</p></td>
  <td class="ticket_quantity">
    <button class="ticket_quantity_button quantity_minus_button" onclick='onMinus(${productID})'>
      <i class="fas fa-minus"></i>
    </button>
    <input type="text" class="ticket_quantity_input" value=${quantity} />
    <button class="ticket_quantity_button quantity_plus_button" onclick='onPlus(${productID})'>
      <i class="fas fa-plus"></i>
    </button>
  </td>
  <td><p class="ticket_total">${(price * quantity).toLocaleString()}원</p></td>
  <td>
    <button class="ticket_order ticket_choice_button" onclick='onChoice(${productID})'>
      주문하기
    </button>
    <button class="ticket_delete ticket_choice_button">삭제</button>
  </td>
</tr>
  `;
}

function onCheckedCheckbox() {
  const tickets = document.querySelectorAll('input[name="ticket_check"]');
  const productIDs = [];

  for (let ticket of tickets) {
    const productID = ticket.id.slice(-1);
    if (ticket.checked) productIDs.push(productID);
  }

  return productIDs;
}

function onDelete(type, productIDs = []) {
  if (type === 'selected')
    tickets_info = tickets_info.filter(
      (ticket_info) => !productIDs.includes(ticket_info.productID)
    );
  else tickets_info.length = 0;
}

function onChoice(productID) {
  const choiceTicket = tickets_info.find(
    (ticket_info) => ticket_info.productID === String(productID)
  );

  onNavigateOrder([choiceTicket]);
}

function onNavigateOrder(tickets_info) {
  const tickets = JSON.stringify(tickets_info);
  localStorage.setItem('ticket_order', tickets);

  location.href = '/views/order/order.html';
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

selectedDeleteBtn.addEventListener('click', () => {
  const productIDs = onCheckedCheckbox();

  if (productIDs.length < 1) {
    alert('선택된 상품이 없습니다.');
    return;
  }

  onDelete('selected', productIDs);
});

allDeleteBtn.addEventListener('click', () => {
  onDelete('all');
});

allOrderBtn.addEventListener('click', () => {
  if (tickets_info.length < 1) {
    alert('장바구니에 상품이 없습니다.');
    return;
  }

  onNavigateOrder(tickets_info);
});

selectedOrderBtn.addEventListener('click', () => {
  const productIDs = onCheckedCheckbox();

  if (productIDs.length < 1) {
    alert('선택된 상품이 없습니다.');
    return;
  }

  const selectedTickets = tickets_info.filter((ticket_info) =>
    productIDs.includes(ticket_info.productID)
  );

  onNavigateOrder(selectedTickets);
});
