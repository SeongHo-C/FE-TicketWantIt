"use strict";
/* 주문목록 조회 */
const orderList = document.querySelector(".order_list");

async function goodsConnectApi() {
    const response = await axios({
        method: "GET",
        url: "",
    });

    const orders = await response.data;

    orderList.innerHTML = orders
        .map(
            ({ orderId, date, customerName, customerEmail, items, total }) => `
            <li data-order="${orderId}">
                <div class="order_detail">
                    <div class="top">
                        <div class="left">
                        <div>
                            <strong>주문일자</strong>
                            <span>${date}</span>
                        </div>
                        <div>
                            <strong>주문번호</strong>
                            <span>${orderId}</span>
                        </div>
                        </div>
                        <div class="right">
                        <div class="delivery_status">
                            <select name="" id="">
                            <option value="">주문완료</option>
                            <option value="">주문확인</option>
                            <option value="">배송중</option>
                            <option value="">배송완료</option>
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
                            <dd>${customerName}</dd>
                            </dl>
                            <dl>
                            <dt>메일주소</dt>
                            <dd>${customerEmail}</dd>
                            </dl>
                        </div>
                        </div>
                        <div class="order_info">
                        <div class="title">주문정보</div>
                        <ul>
                            <li>
                            <div class="img">
                                <img
                                src="../../asset/images/goods_list5.jpg"
                                alt="" />
                            </div>
                            <div>
                                <div class="title">
                                ${items.name}
                                </div>
                                <dl>
                                <dt>구매수량</dt>
                                <dd>${items.quantity}</dd>
                                </dl>
                                <dl>
                                <dt>가격</dt>
                                <dd>${items.price}원</dd>
                                </dl>
                            </div>
                            </li>
                        </ul>
                        </div>
                    </div>
                    <div class="total_box">
                        <div class="total_price">
                        <strong>총 합계금액</strong>
                        <span>${total}원</span>
                        </div>
                        <div class="btn_box">
                        <button class="btn_delete">주문삭제</button>
                        </div>
                    </div>
                </div>
          </li>
    `).join("");
}

goodsConnectApi();