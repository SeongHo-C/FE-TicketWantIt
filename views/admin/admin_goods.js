import { isTokenExpired, tokenRefresh } from "../../modules/token.js";
import instance from "../../modules/axios_interceptor.js";

const currentDate = new Date();
const options = { day: "numeric", month: "short", year: "numeric" };
const formattedDate = currentDate
    .toLocaleDateString("en-US", options)
    .toUpperCase();

const date = document.querySelector(".date span");
date.innerHTML = formattedDate;

const productList = document.querySelector(".admin_goods .goods_list");
const pagination = document.querySelector(".pagination ol");
let currentPage;

/* 상품목록리스트 */
async function goodsListApi(page) {
    currentPage = page || 1;

    const response = await instance.get(`/api/admin_product?page=${page}`);
    const productsData = response.data;
    const {
        data: products,
        pageInfo: { currentPage: responseDataPage, totalPage },
    } = productsData;
    console.log(products);

    productList.innerHTML = products
        .map(
            ({
                productId,
                productName,
                imageUrl,
                price,
                place,
                speciesAge,
                description,
                startDate,
                endDate,
                category,
                discount,
                discountPrice,
            }) => `
        <li data-id="${productId}" data-category="${category}">
            <div class="goods_detail">
                <div class="img_box">
                <img src="${imageUrl}" alt="${productName}" />
                </div>
                <div class="info_box">
                <div class="detail_info">
                    <div class="title">
                    <strong>${productName}</strong>
                    </div>
                    <dl class="date">
                    <dt>날짜</dt>
                    <dd>${startDate} - ${endDate}</dd>
                    </dl>
                    <dl class="description">
                    <dt>설명</dt>
                    <dd>${description}</dd>
                    </dl>
                    <dl class="price">
                    <dt>가격</dt>
                    <dd>${price}원</dd>
                    </dl>
                    <dl class="discount">
                    <dt>할인율</dt>
                    <dd>${discount}%</dd>
                    </dl>
                    <dl class="discount_price">
                    <dt>할인가</dt>
                    <dd>${discountPrice}원</dd>
                    </dl>
                    <dl class="cate">
                    <dt>카테고리</dt>
                    <dd>${category}</dd>
                    </dl>
                    <dl class="age">
                    <dt>연령제한</dt>
                    <dd>${speciesAge}</dd>
                    </dl>
                    <dl class="place">
                    <dt>장소</dt>
                    <dd>${place}</dd>
                    </dl>
                </div>
                <div class="btn_box">
                    <a href="../admin/goods_edit.html?productId=${productId}"  class="btn_modify">상품수정</a>
                    <button class="btn_delete">상품삭제</button>
                </div>
                </div>
            </div>
        </li>
    `
        )
        .join("");

    const list = document.querySelectorAll(".goods_list > li");

    list.forEach((li) =>
        li.querySelector(".btn_delete").addEventListener("click", async () => {
            let productId = li.dataset.id;
            console.log(productId);

            try {
                const response = await instance.delete(
                    `/api/admin_product/delete?productId=${productId}`
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
            goodsListApi(currentPage);

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

goodsListApi(1);
