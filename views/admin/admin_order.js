import { isTokenExpired, tokenRefresh } from "../../modules/token.js";
import instance from "../../modules/axios_interceptor.js";

("use strict");

/* 주문목록 조회 */
const orderList = document.querySelector(".order_list");
const pagination = document.querySelector(".pagination ol");
let currentPage;

async function goodsConnectApi(page) {
    currentPage = page || 1;

    const response = await instance.get("/api/adminOrder");

    const ordersData = response.data;

    const {
        orderList: orders,
        pageInfo: { currentPage: responseDataPage, totalPage },
    } = ordersData;

    orderList.innerHTML = orders
        .map(
            ({
                _id,
                orderId,
                createdAt,
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
                                <span>${createdAt.split("T")[0]}</span>
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
                                        ({
                                            _id,
                                            name,
                                            quantity,
                                            price,
                                            imgUrl,
                                        }) =>
                                            `<li data-order-item="${_id}">
                                            <div class="img">
                                                <img src=${imgUrl} alt="" />
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
                    const response = await instance.put(
                        `/api/adminOrder/${orderId}/${orderStatus}`
                    );

                    console.log("배송싱테가 변경되었습니다:", response);

                    alert(`배송상태가 변경되었습니다.`);
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
                const response = await instance.delete(
                    `/api/adminOrder/${orderId}`
                );

                console.log("상품이 삭제되었습니다:", response);

                alert("상품이 삭제되었습니다.");
                location.reload();
            } catch (error) {
                console.error("상품 삭제 중 오류가 발생했습니다:", error);
            }
        })
    );

    const itemsPerPage = 5; // 한 그룹당 표시할 페이지 수
    const totalGroups = Math.ceil(totalPage / itemsPerPage);
    let currentGroup = Math.ceil(currentPage / itemsPerPage);
    if (currentGroup > totalGroups) {
        currentGroup = totalGroups;
    }

    pagination.innerHTML = "";

    // 이전 그룹 버튼 표시
    if (currentGroup > 1) {
        pagination.innerHTML += `<li class="btn_page" data-group="${
            currentGroup - 1
        }"><span><<</span></li>`;
    }

    // 현재 그룹에 대한 시작 페이지와 끝 페이지 인덱스 계산
    const startPage = (currentGroup - 1) * itemsPerPage + 1;
    const endPage = Math.min(startPage + itemsPerPage - 1, totalPage);

    // 현재 그룹에 대한 버튼 생성
    for (let i = startPage; i <= endPage; i++) {
        pagination.innerHTML += `<li class="btn_page ${
            i === currentPage ? "active" : ""
        }" data-page="${i}"><span>${i}</span></li>`;
    }

    // 다음 그룹 버튼 표시
    if (currentGroup < totalGroups) {
        pagination.innerHTML += `<li class="btn_page" data-group="${
            currentGroup + 1
        }"><span>>></span></li>`;
    }

    const pageButtons = document.querySelectorAll(".btn_page");

    pageButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const group = button.dataset.group;
            if (group) {
                // 그룹 버튼을 클릭한 경우, 새로운 현재 페이지를 계산합니다.
                currentPage = (group - 1) * itemsPerPage + 1;
            } else {
                // 일반 페이지 버튼을 클릭한 경우, 새로운 현재 페이지를 설정합니다.
                currentPage = parseInt(button.dataset.page);
            }
            goodsConnectApi(currentPage);

            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set("page", currentPage);
            const newUrl = `${
                window.location.pathname
            }?${urlParams.toString()}`;
            history.pushState(null, null, newUrl);

            window.scrollTo(0, 0);
        });
    });
}

goodsConnectApi(1);
