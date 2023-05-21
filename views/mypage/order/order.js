import instance from "../../../modules/axios_interceptor.js";

async function onLoad() {
    const response = await getOrder();

    const orderList = response.orderList;
    if (orderList.length < 1) return;

    orderTableList.innerHTML = createOrder(orderList);

    const [ordering, shipping, deliveryCompleted] = calOrderStatus(orderList);
    orderStatus1.textContent = ordering;
    orderStatus2.textContent = shipping;
    orderStatus3.textContent = deliveryCompleted;
}

function calOrderStatus(orderList) {
    let ordering = 0,
        shipping = 0,
        deliveryCompleted = 0;

    orderList.forEach(({ orderStatus }) => {
        if (orderStatus === 1) ordering++;
        else if (orderStatus === 2) shipping++;
        else deliveryCompleted++;
    });

    return [ordering, shipping, deliveryCompleted];
}

async function getOrder() {
    try {
        const response = await instance.get("/api/orders");

        return response.data;
    } catch (error) {
        console.log(error);
    }
}

function createOrder(orderList) {
    return orderList
        .map(
            ({
                createdAt,
                items,
                orderId,
                orderStatus,
                zipCode,
                deliveryAddress = "모르는 주소",
                deliveryPhoneNum = "없는 번호",
            }) => {
                return `<div>
            <ul>
                <li class="order_no">
                    <div>
                        <span>${createdAt.split("T")[0]}</span>
                        <strong>${orderId}</strong>
                    </div>
                </li>
                <li class="order_item">
                    ${createOrderItems(items)}
                </li>
                <li class="order_status">
                    <div>
                        <strong>${getOrderStatus(orderStatus)}</strong>
                        <div class="status_btn_box">
                            ${
                                orderStatus === 1
                                    ? `<button class="modify_button" onclick="orderModify('${zipCode}', '${deliveryAddress}', '${deliveryPhoneNum}', '${orderId}')">수정하기</button>
                            <button class="cancel_button" onclick="orderCancel('${orderId}')">취소하기</button>`
                                    : ""
                            }
                            ${
                                orderStatus === 3
                                    ? `<button class="confirm_button" onclick="orderConfirm('${orderId}')">구매확정</button>`
                                    : ""
                            }
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>`;
            }
        )
        .join("");
}

function createOrderItems(items) {
    return items
        .map(
            ({
                name,
                productId,
                imgUrl,
                quantity,
                price,
                discount,
                discountPrice,
            }) => {
                return `
            <div class="item_list">
                <div class="img_box">
                    <a href="/views/goods/goods_view.html?productId=${productId}">
                        <img src=${imgUrl} alt="${name}"/>
                    </a>
                </div>
                <div class="info_box">
                    <div class="title">${name}</div>
                    <div class="quantity">
                        <dl>
                            <dt>수량:</dt>
                            <dd>${quantity}</dd>
                        </dl>
                    </div>
                    <div class="price">
                        <strong>${
                            discount === 0
                                ? Number(price * quantity).toLocaleString()
                                : Number(
                                      discountPrice * quantity
                                  ).toLocaleString()
                        }원</strong>
                    </div>
                </div>
            </div>
        `;
            }
        )
        .join("");
}

function getOrderStatus(orderStatus) {
    if (orderStatus === 1) return "주문중";
    else if (orderStatus === 2) return "배송중";
    else if (orderStatus === 3) return "배송완료";
    else return "구매확정";
}

function execDaumPostcode() {
    new daum.Postcode({
        oncomplete: function (data) {
            let addr = "";

            if (data.userSelectedType === "R") addr = data.roadAddress;
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
        const isConfirm = confirm("구매확정 하시겠습니까?");

        if (isConfirm) {
            const response = await instance.put(
                `/api/orders/delivery/${orderId}`
            );

            if (response) alert("구매확정이 완료되었습니다.");
            location.reload();
        }
    } catch (error) {
        console.log(error);
    }
}

window.orderModify = orderModify;
function orderModify(zipCode, deliveryAddress, deliveryPhoneNum, orderId) {
    modal.style.display = "flex";
    body.style.overflow = "hidden";

    const [primary, detail] = deliveryAddress.split("(상세주소)");
    const [phone1, phone2, phone3] = deliveryPhoneNum.split("-");

    zipCodeInput.value = zipCode || "";
    addressInput.value = primary || "";
    addressDetail.value = detail || "";
    phone1Input.value = phone1 || "010";
    phone2Input.value = phone2 || "";
    phone3Input.value = phone3 || "";

    modalForm.name = orderId;
}

async function modifyAPI(data, orderId) {
    try {
        const response = await instance.put(`/api/orders/${orderId}`, data);

        if (response) alert("주문정보 수정이 완료되었습니다.");
        location.reload();
    } catch (error) {
        console.log(error);
    }
}

window.orderCancel = orderCancel;
function orderCancel(orderId) {
    const isConfirm = window.confirm("정말로 주문을 취소하시겠습니까?");

    if (isConfirm) cancelAPI(orderId);
}

async function cancelAPI(orderId) {
    try {
        const response = await instance.delete(`/api/orders/${orderId}`);

        if (response) alert("주문 취소가 완료되었습니다.");
        location.reload();
    } catch (error) {
        console.log(error);
    }
}

const body = document.querySelector("body");
const modal = document.querySelector("#modal");
const modalForm = document.querySelector(".modal_form");
const closeModalBtn = document.querySelector(".close_area > button");
const addressSearchBtn = document.querySelector("#addressSearchBtn");
const orderTableList = document.querySelector(".order_table .table_list");
const zipCodeInput = document.querySelector(".zip-code");
const addressInput = document.querySelector(".address");
const addressDetail = document.querySelector(".address_detail");
const phone1Input = document.querySelector("#phone1");
const phone2Input = document.querySelector("#phone2");
const phone3Input = document.querySelector("#phone3");
const orderStatus1 = document.querySelector("#orderStatus1");
const orderStatus2 = document.querySelector("#orderStatus2");
const orderStatus3 = document.querySelector("#orderStatus3");

window.addEventListener("load", () => {
    onLoad();
});

closeModalBtn.addEventListener("click", (e) => {
    e.preventDefault();

    modal.style.display = "none";
    body.style.overflow = "auto";
});

addressSearchBtn.addEventListener("click", () => {
    execDaumPostcode();
});

modalForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const address = e.target["address"].value;
    const addressDetail = e.target["addressDetail"].value;
    const deliveryAddress = `${address} (상세주소)${addressDetail}`;

    if (!address) {
        alert("주소를 입력해주세요.");
        e.target["address"].focus();
        return;
    }

    const phone1 = e.target["phone_1"].value;
    const phone2 = e.target["phone_2"].value;
    const phone3 = e.target["phone_3"].value;
    const deliveryPhoneNum = `${phone1}-${phone2}-${phone3}`;

    if (!phone2 || !phone3) {
        alert("휴대전화 번호를 입력해주세요.");
        e.target["phone2"].focus();
        return;
    }

    const orderId = e.target.name;

    const data = {
        deliveryAddress,
        deliveryPhoneNum,
    };

    modifyAPI(data, orderId);
});
