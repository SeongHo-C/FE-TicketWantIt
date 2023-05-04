import { isTokenExpired, tokenRefresh } from "../../modules/token.js";
import instance from "../../modules/axios_interceptor.js";

("use strict");

const productList = document.querySelector(".admin_goods .goods_list");

/* 상품목록리스트 */
async function goodsListApi() {
    if (isTokenExpired()) await tokenRefresh();

    const response = await instance.get("/api/admin_product");

    const products = response.data;

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
                    <a href='./goods_edit.html?productId=${productId}' class="btn_modify">상품수정</a>
                    <button class="btn_delete">상품삭제</button>
                </div>
                </div>
            </div>
        </li>
    `
        )
        .join("");

    const list = document.querySelectorAll(".goods_list > li");

    /*
        상품삭제 작업순서:

        1. 삭제할 상품목록의 상품삭제버튼 클릭
        2. 해당 목록의 productId 값 찾아서 상품삭제 api에 post로 정보보내기
    */

    list.forEach((li) =>
        li.querySelector(".btn_delete").addEventListener("click", async () => {
            let productId = li.dataset.id;
            console.log(productId);

            try {
                if (isTokenExpired()) await tokenRefresh();

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
}

goodsListApi();
