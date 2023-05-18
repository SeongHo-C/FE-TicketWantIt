import instance from "../../modules/axios_interceptor.js";

/** 헤더 달력 */
const currentDate = new Date();
const options = { day: "numeric", month: "short", year: "numeric" };
const formattedDate = currentDate
    .toLocaleDateString("en-US", options)
    .toUpperCase();

const date = document.querySelector(".date span");
date.innerHTML = formattedDate;

const modal = document.querySelector("#modal");
const openModalButton = document.querySelector(".btn_modal");
const closeModalButton = document.querySelector("#modal .close_area button");

function openModal() {
    modal.classList.add("active");
    goodsListApi();
}

function closeModal() {
    modal.classList.remove("active");
}

openModalButton.addEventListener("click", openModal);
closeModalButton.addEventListener("click", closeModal);

const productList = document.querySelector(".product_all .table_cont ul");
const pagination = document.querySelector(".pagination ol");
const addButton = document.querySelector(".admin_modal .add");
const deleteButton = document.querySelector(".admin_modal .delete");
let currentPage;

function addRecommendList() {
    const recommedList = document.querySelector(
        ".product_select .table_cont ul"
    );
    const selectedLists = Array.from(
        document.querySelectorAll(
            ".product_all .list_box input[type='checkbox']:checked"
        )
    )
        .map((checkbox) => checkbox.closest("li"))
        .map((item) => {
            const productId = item.getAttribute("data-id");
            const productName = item.querySelector(".name span").textContent;
            const price = item.querySelector(".price span").textContent;
            const imageUrl = item.querySelector(".image img").src;

            return {
                productId: productId,
                productName: productName,
                price: price,
                imageUrl: imageUrl,
            };
        });

    const existingProductIds = Array.from(
        recommedList.querySelectorAll("li")
    ).map((li) => li.getAttribute("data-id"));

    selectedLists.forEach(({ productId, productName, imageUrl, price }) => {
        if (recommedList.childElementCount >= 6) {
            alert("상품을 6개 이상 담을 수 없습니다.");
            return;
        }

        if (existingProductIds.includes(productId)) {
            alert("이미 선택된 상품입니다.");
            return;
        }

        const listItemHTML = `
        <li data-id="${productId}">
          <div class="list_box">
            <div class="select">
              <input type="checkbox" name="recommendCheck" id="recommendCheck" />
            </div>
            <div class="image">
              <img src="${imageUrl}" alt="${productName}" />
            </div>
            <div class="name">
              <span>${productName}</span>
            </div>
            <div class="price">
              <span>${price}</span>
            </div>
          </div>
        </li>
      `;

        recommedList.innerHTML += listItemHTML;
        existingProductIds.push(productId);
    });

    const productAllLists = document.querySelectorAll(
        ".product_all .table_cont li"
    );
    productAllLists.forEach((item) => {
        const checkbox = item.querySelector('.list_box input[type="checkbox"]');
        if (checkbox) {
            checkbox.checked = false;
        }
    });
}

function deleteRecommendList() {
    const recommedList = document.querySelector(
        ".product_select .table_cont ul"
    );
    const selectedItems = Array.from(recommedList.querySelectorAll("li"));

    selectedItems.forEach((item) => {
        const checkbox = item.querySelector("input[type='checkbox']");
        if (checkbox.checked) {
            const productId = item.getAttribute("data-id");

            item.remove();
        }
    });
}

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
            ({ productId, productName, imageUrl, price }) => `
            <li data-id=${productId}>
                <div class="list_box">
                    <div class="select">
                        <input
                            type="checkbox"
                            name="recommendCheck"
                            id="recommendCheck"
                        />
                    </div>
                    <div class="image">
                        <img src=${imageUrl} alt=${productName}/>
                    </div>
                    <div class="name">
                        <span>${productName}</span>
                    </div>
                    <div class="price">
                        <span>${price}</span>
                    </div>
                </div>
            </li>
            `
        )
        .join("");

    recommendList("modal");

    const itemsPerPage = 5; // 한 그룹당 표시할 페이지 수
    const totalGroups = Math.ceil(totalPage / itemsPerPage);
    let currentGroup = Math.ceil(currentPage / itemsPerPage);
    if (currentGroup > totalGroups) {
        currentGroup = totalGroups;
    }

    addButton.addEventListener("click", addRecommendList);
    deleteButton.addEventListener("click", deleteRecommendList);

    pagination.innerHTML = "";

    // 이전 그룹 버튼 표시
    if (currentGroup > 1) {
        pagination.innerHTML += `
        <li class="btn_page" data-group="${currentGroup - 1}">
            <span><<</span>
        </li>
        `;
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
        });
    });
}

async function fixRecommendList() {
    const fixRecommendLists = Array.from(
        document.querySelectorAll(".product_select .table_cont li")
    ).map((item) => item.getAttribute("data-id"));
    console.log(fixRecommendLists);

    try {
        const response = await instance.post(
            "/api/admin_product/recommended_product",
            {
                productIds: fixRecommendLists,
            }
        );

        console.log("추천상품이 등록되었습니다.", response.data);
    } catch (error) {
        console.error("추천상품 등록 중 오류가 발생했습니다.", error);
    }

    closeModal();
    location.reload();
}

const recommendButton = document.querySelector(".btn_recomm");
recommendButton.addEventListener("click", fixRecommendList);

async function recommendList(version) {
    const response = await instance.get("/api/product/MD_Pick");
    const products = response.data;
    console.log(products);

    const fixRecommendList = document.querySelector(
        ".admin_content .recomm_list"
    );
    const recommedList = document.querySelector(
        ".product_select .table_cont ul"
    );

    if (version === "totalList") {
        fixRecommendList.innerHTML = products
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
                        
                    </div>
            
                    </div>
                </div>
            </li>
        `
            )
            .join("");
    }

    if (version === "modal") {
        recommedList.innerHTML = products
            .map(
                ({ productId, productName, imageUrl, price }) => `
            <li data-id=${productId}>
                <div class="list_box">
                    <div class="select">
                        <input
                            type="checkbox"
                            name="recommendCheck"
                            id="recommendCheck"
                        />
                    </div>
                    <div class="image">
                        <img src=${imageUrl} alt=${productName}/>
                    </div>
                    <div class="name">
                        <span>${productName}</span>
                    </div>
                    <div class="price">
                        <span>${price}</span>
                    </div>
                </div>
            </li>
            `
            )
            .join("");
    }
}

recommendList("totalList");
