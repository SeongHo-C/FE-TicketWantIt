const tickets_info = [
  {
    productID: 0,
    thumbnail:
      'https://img.29cm.co.kr//next-product/2023/04/03/ad7307f5595b433cab22b2bc26c9124c_20230403114503.jpg',
    productName: '[얼리버드] 에드워드 호퍼: 길 위에서 6월 티켓',
    place: '서울시립미술관',
    speciesAge: 15,
    price: 10000,
    quantity: 1,
  },
  {
    productID: 1,
    thumbnail:
      'https://img.29cm.co.kr//next-product/2023/04/03/ad7307f5595b433cab22b2bc26c9124c_20230403114503.jpg',
    productName: '[얼리버드] 에드워드 호퍼: 길 위에서 6월 티켓',
    place: '서울시립미술관',
    speciesAge: 15,
    price: 10000,
    quantity: 2,
  },
];

const ticketsList = document.querySelector('.tickets_list');

function onSelect() {
  for (let ticket_info of tickets_info) {
    const ticket = createTicket(ticket_info);

    ticketsList.innerHTML += ticket;
  }
}

function createTicket(ticket) {
  const {
    productID,
    thumbnail,
    productName,
    place,
    speciesAge,
    price,
    quantity = 1,
  } = ticket;

  return `<tr id=ticket${productID}>
  <td><input type="checkbox" /></td>
  <td>
    <img
      class="ticket_img"
      src="${thumbnail}"
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
    <button class="ticket_quantity_button">
      <i class="fas fa-minus"></i>
    </button>
    <input type="text" class="ticket_quantity_input" value=${quantity} />
    <button class="ticket_quantity_button">
      <i class="fas fa-plus"></i>
    </button>
  </td>
  <td><p class="ticket_total">${(price * quantity).toLocaleString()}원</p></td>
  <td>
    <button class="ticket_order ticket_choice_button">
      주문하기
    </button>
    <button class="ticket_delete ticket_choice_button">삭제</button>
  </td>
</tr>
  `;
}

window.addEventListener('load', () => {
  onSelect();
});
