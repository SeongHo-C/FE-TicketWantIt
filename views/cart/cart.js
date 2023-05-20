let ticketsInfo = localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [];

function onLoad() {
    if (ticketsInfo.length < 1) return;

    const tickets = ticketsInfo
        .map((ticketInfo) => createTicket(ticketInfo))
        .join("");
    ticketsList.innerHTML = tickets;

    const totalPrice = calculateTotalPrice(ticketsInfo);
    calculateList.innerHTML = totalPrice;
}

function calculateTotalPrice(ticketsInfo) {
    const totalPrice = ticketsInfo.reduce(
        (sum, { discountPrice, quantity }) => sum + discountPrice * quantity,
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
                alert("최소 수량은 1개 입니다.");
                return ticketInfo;
            }
            return { ...ticketInfo, quantity: quantity - 1 };
        }
        return ticketInfo;
    });

    localStorage.setItem("cart", JSON.stringify(ticketsInfo));
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

    localStorage.setItem("cart", JSON.stringify(ticketsInfo));
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
        discount,
        discountPrice,
    } = ticket;

    return `<div id="ticket${productId}">
        <ul>
            <li>
                <input type="checkbox" id="only_check${productId}" name="ticket_check"/>
            </li>
            <li class="ticket_info">
                <div>
                    <div class="img_box">
                        <a href="/views/goods/goods_view.html?productId=${productId}">
                            <img src="${imageUrl}" alt="${productName}" />
                        </a>
                    </div>
                    <div class="info_box">
                        <div class="title">
                            <strong>${productName}</strong>
                        </div>
                        <div class="etc">
                            <dl><dt>제한연령</dt><dd>${speciesAge}</dd></dl>
                            <dl><dt>장소</dt><dd>${place}</dd></dl>
                            <span></span>
                        </div>
                        <div class="price ${discount !== 0 ? "discount" : ""}">
                            <div class="fixed_price">${Number(
                                price
                            ).toLocaleString("ko-KR")}원</div>
                            <div class="discount">${Number(discount)}%</div>
                            <div class="discount_price">${Number(
                                discountPrice
                            ).toLocaleString("ko-KR")}원</div>
                        </div>
                    </div>
                </div>
            </li>
            <li class="ticket_quantity">
                <div>
                    <button class="minus_button" onclick="onMinus('${productId}')" >
                        <span></span>
                    </button>
                    <input type="text" class="ticket_quantity_input" value="${quantity}" readonly />
                    <button class="plus_button" onclick="onPlus('${productId}')">
                        <span></span>
                    </button>
                </div>
            </li>
            <li class="ticket_total">
                <div>
                    <div class="total">
                        <span>${(
                            discountPrice * quantity
                        ).toLocaleString()}원</span>
                    </div>
                    <div>
                        <button
                            class="ticket_order"
                            onclick="onlyOrder('${productId}')"
                        >
                            주문하기
                        </button>
                        <button
                            class="ticket_delete"
                            onclick="onlyDelete('${productId}')"
                        >
                            삭제
                        </button>
                    </div>
                </div>
            </li>
           
        </ul>
    </div>`;
}

function onCheckedCheckbox() {
    const tickets = document.querySelectorAll('input[name="ticket_check"]');
    const productIds = [];

    for (let ticket of tickets) {
        const productId = ticket.id.split("only_check")[1];
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
        alert("장바구니에 상품이 없습니다.");
        return;
    }

    onNavigateOrder(ticketsInfo);
}

function selectedOrder() {
    const productIds = onCheckedCheckbox();

    if (productIds.length < 1) {
        alert("선택된 상품이 없습니다.");
        return;
    }

    const selectedTickets = ticketsInfo.filter((ticketInfo) =>
        productIds.includes(ticketInfo.productId)
    );

    onNavigateOrder(selectedTickets);
}

function onNavigateOrder(ticketsInfo) {
    const token = localStorage.getItem("token");

    if (!token) {
        location.href = "/views/login/login.html";
        alert("로그인 후 이용해주시기 바랍니다.");
    }

    localStorage.setItem("ticket_order", JSON.stringify(ticketsInfo));

    location.href = "/views/order/order.html";
}

function allDelete() {
    if (ticketsInfo.length < 1) {
        alert("장바구니에 상품이 없습니다.");
        return;
    }

    onDelete("all");
}

function selectedDelete() {
    const productIds = onCheckedCheckbox();

    if (productIds.length < 1) {
        alert("선택된 상품이 없습니다.");
        return;
    }

    onDelete("selected", productIds);
}

function onlyDelete(productId) {
    onDelete("selected", [productId]);
}

function onDelete(type, productIds) {
    if (type === "selected")
        ticketsInfo = ticketsInfo.filter(
            (ticketInfo) => !productIds.includes(ticketInfo.productId)
        );
    else ticketsInfo.length = 0;

    localStorage.setItem("cart", JSON.stringify(ticketsInfo));
    location.reload();
}

const ticketsList = document.querySelector(".tickets_list");
const calculateList = document.querySelector(".calculate_list");
const allCheck = document.querySelector("#all_check");
const selectedDeleteBtn = document.querySelector(".selected_delete");
const allDeleteBtn = document.querySelector(".all_delete");
const allOrderBtn = document.querySelector(".all_order");
const selectedOrderBtn = document.querySelector(".selected_order");

window.addEventListener("load", () => {
    onLoad();
});

allCheck.addEventListener("change", () => {
    const checkboxes = document.querySelectorAll('input[name="ticket_check"]');

    if (allCheck.checked) {
        for (let checkbox of checkboxes) checkbox.checked = true;
    } else {
        for (let checkbox of checkboxes) checkbox.checked = false;
    }
});

allOrderBtn.addEventListener("click", () => {
    allOrder();
});

selectedOrderBtn.addEventListener("click", () => {
    selectedOrder();
});

allDeleteBtn.addEventListener("click", () => {
    allDelete();
});

selectedDeleteBtn.addEventListener("click", () => {
    selectedDelete();
});
