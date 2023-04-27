import { getToken } from "../../modules/token.js";

("use strict");

const currentDate = new Date();
const options = { day: "numeric", month: "short", year: "numeric" };
const formattedDate = currentDate
    .toLocaleDateString("en-US", options)
    .toUpperCase();

const date = document.querySelector(".date span");
date.innerHTML = formattedDate;

/* 주문목록 조회 */
const orderList = document.querySelector(".order_list");
// console.log(localStorage.getItem("token"));
async function goodsConnectApi() {
    const response = await axios.get("http://34.64.112.166/api/adminOrder", {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });

    const orders = await response.data;
    console.log(orders.orderList);

    orderList.innerHTML = orders.orderList
        .map(
            ({
                _id,
                orderId,
                date,
                customerId,
                items,
                totalPrice,
                orderStatus,
            }) => `
            <li data-order="${orderId}" data-id="${_id}">
                <div class="order_detail">
                    <div class="top">
                        <div class="left">
                            <div>
                                <strong>주문일자</strong>
                                <span>${date.slice(0, 10)}</span>
                            </div>
                            <div>
                                <strong>주문번호</strong>
                                <span>${orderId}</span>
                            </div>
                        </div>
                        <div class="right">
                            <div class="order_status">
                                <select name="orderStatus" id="orderStatus">
                                <option value="1" ${
                                    orderStatus === 1 ? "selected" : ""
                                }>주문확인</option>
                                <option value="2" ${
                                    orderStatus === 2 ? "selected" : ""
                                }>배송중</option>
                                <option value="3" ${
                                    orderStatus === 3 ? "selected" : ""
                                }>배송완료</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="info_box">
                        <div class="user_info">
                            <div class="title">유저정보</div>
                            <div>
                                <dl>
                                    <dt>이름</dt>
                                    <dd>${customerId.name}</dd>
                                </dl>
                                <dl>
                                    <dt>메일주소</dt>
                                    <dd>${customerId.email}</dd>
                                </dl>
                            </div>
                        </div>
                        <div class="order_info">
                            <div class="title">주문정보</div>
                            <ul>
                                ${items
                                    .map(
                                        ({ _id, name, quantity, price }) =>
                                            `<li data-order-item="${_id}">
                                            <div class="img">
                                                <img src="../../asset/images/goods_list5.jpg" alt="" />
                                            </div>
                                            <div>
                                                <div class="title">${name}</div>
                                                <dl>
                                                    <dt>구매수량</dt>
                                                    <dd>${quantity}</dd>
                                                </dl>
                                                <dl>
                                                    <dt>가격</dt>
                                                    <dd>${price.toLocaleString()}원</dd>
                                                </dl>
                                            </div>
                                        </li>`
                                    )
                                    .join("")}
                            </ul>
                        </div>
                    </div>
                    <div class="total_box">
                        <div class="total_price">
                            <strong>총 합계금액</strong>
                            <span>${totalPrice.toLocaleString()}원</span>
                        </div>
                        <div class="btn_box">
                            <button class="btn_delete">주문삭제</button>
                        </div>
                    </div>
                </div>
            </li>
        `
        )
        .join("");

    const list = document.querySelectorAll(".order_list > li");

    list.forEach((li) => {
        li.querySelector("#orderStatus").addEventListener(
            "change",
            async (e) => {
                const orderElem = e.target.closest("li");
                const orderId = orderElem.dataset.order;
                const orderStatus = e.target.value;
                console.log("onchange select", orderStatus, orderId);

                try {
                    const response = await axios.patch(
                        `http://34.64.112.166/api/adminOrder/${orderId}/${orderStatus}`,
                        {
                            headers: {
                                Authorization: `Bearer ${getToken()}`,
                            },
                        }
                    );

                    console.log("배송정보가 변경되었습니다:", response);

                    alert("배송정보가 변경되었습니다.");
                    location.reload();
                } catch (error) {
                    console.error(
                        "배송정보 변경 중 오류가 발생했습니다:",
                        error
                    );
                }
            }
        );
    });

    list.forEach((li) =>
        li.querySelector(".btn_delete").addEventListener("click", async (e) => {
            const orderElem = e.target.closest("li");
            const orderId = orderElem.dataset.order;

            console.log(orderId);

            try {
                const response = await axios.delete(
                    `http://34.64.112.166/api/adminOrder/${orderId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${getToken()}`,
                        },
                    }
                );

                console.log("상품이 삭제되었습니다:", response);

                alert("상품이 삭제되었습니다.");
                location.reload();
            } catch (error) {
                console.error("상품 삭제 중 오류가 발생했습니다:", error);
            }
        })
    );
}

goodsConnectApi();
