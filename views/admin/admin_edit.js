// import { getToken } from "../../../modules/token.js";
import instance from "../../modules/axios_interceptor.js";
import URL from "../../../modules/server_url.js";

/** 헤더 달력 */
const currentDate = new Date();
const options = { day: "numeric", month: "short", year: "numeric" };
const formattedDate = currentDate
    .toLocaleDateString("en-US", options)
    .toUpperCase();

const date = document.querySelector(".date span");
date.innerHTML = formattedDate;

/** 이미지 url Inputbox에 수정 */
const imageUrl = document.querySelector("#goodsImage");
const formUrlInput = document.querySelector(".goods_image");

imageUrl.addEventListener("change", function () {
    const imageValue = imageUrl.value;
    formUrlInput.value = imageValue;
});

const form = document.querySelector(".goods_form form");
// const updateBtn = document.querySelector('.goods_form input[type="submit"]');

const productName = document.querySelector("#goodsName");
const category = document.querySelector("#goodsCate");
const price = document.querySelector("#goodsPrice");
const discount = document.querySelector("#goodsDiscount");
const place = document.querySelector("#goodsPlace");
const speciesAge = document.querySelector("#goodsAge");
const description = document.querySelector("#goodsDesc");
const startDate = document.querySelector("#goodsDateStart");
const endDate = document.querySelector("#goodsDateEnd");

const url = new window.URL(window.location.href);
const urlParams = url.searchParams;
const urlProductId = urlParams.get("productId");
console.log(urlProductId);

let filteredProduct;

if (urlProductId !== null) {
    const productModifyApi = async () => {
        const response = await instance.get("/api/admin_product");
        const productsData = response.data;
        const { data: products } = productsData;

        filteredProduct = products.filter(
            ({ productId }) => productId === urlProductId
        );
        console.log(filteredProduct);

        const defaultUrl = filteredProduct[0].imageUrl;
        console.log(defaultUrl);

        productName.value = filteredProduct[0].productName;
        category.value = filteredProduct[0].category;
        startDate.value = filteredProduct[0].startDate;
        endDate.value = filteredProduct[0].endDate;
        description.value = filteredProduct[0].description;
        price.value = filteredProduct[0].price;
        discount.value = filteredProduct[0].discount;
        speciesAge.value = filteredProduct[0].speciesAge;
        place.value = filteredProduct[0].place;

        /* 가짜 file_inputbox에 url경로만 넣어주기 */
        formUrlInput.value = filteredProduct[0].imageUrl;
    };

    productModifyApi();
} else {
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString().padStart(4, "0");
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const day = currentDate.getDate().toString().padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    if (!startDate.value) {
        startDate.value = formattedDate;
    }

    if (!endDate.value) {
        endDate.value = formattedDate;
    }
}

/* 카테고리 api 받아서 selectbox로 만들기 */
async function categorySelectApi() {
    const categorySelect = document.querySelector("#goodsCate");

    const response = await instance.get("/api/admin_category");
    const categories = response.data;

    categories.forEach(({ category, categoryId }) => {
        const option = document.createElement("option");
        option.setAttribute("data-id", categoryId);
        option.setAttribute("value", category);
        option.textContent = category;

        if (
            urlProductId !== null &&
            filteredProduct &&
            category === filteredProduct[0].category
        ) {
            option.selected = true;
        }

        categorySelect.appendChild(option);
    });

    FancySelect.update(goodsCate);
}

categorySelectApi();

const goodsUpdateApi = async (e) => {
    e.preventDefault();

    if (urlProductId !== null) {
        console.log("상품수정");

        const updateApi = {
            category: String(category.value),
            productName: String(productName.value),
            price: Number(price.value),
            discount: Number(discount.value),
            place: String(place.value),
            speciesAge: String(speciesAge.value),
            description: String(description.value),
            startDate: String(startDate.value),
            endDate: String(endDate.value),
        };

        const formData = new FormData();
        formData.append("imageUrl", imageUrl.files[0]);
        console.log(imageUrl.files[0]);

        try {
            const response = await instance.put(
                `/api/admin_product/edit?productId=${urlProductId}`,
                updateApi
            );

            console.log("상품이 수정되었습니다:", response.data);
            window.location.href = "./goods.html";
        } catch (error) {
            console.error("상품 수정 중 오류가 발생했습니다:", error);
        }

        try {
            // const token = getToken();
            const responseUrl = await instance.put(
                `/api/admin_product/edit/img?productId=${urlProductId}`,
                formData
            );

            console.log("상품 이미지가 수정되었습니다:", responseUrl.data);
            window.location.href = "./goods.html";
        } catch (error) {
            console.error("이미지 수정 중 오류가 발생했습니다:", error);
        }
    } else {
        console.log("상품추가");
        console.log(URL);

        const formData = new FormData();

        formData.append("category", category.value);
        formData.append("productName", productName.value);
        formData.append("imageUrl", imageUrl.files[0]);
        formData.append("price", price.value);
        formData.append("discount", discount.value);
        formData.append("place", place.value);
        formData.append("speciesAge", speciesAge.value);
        formData.append("description", description.value);
        formData.append("startDate", String(startDate.value));
        formData.append("endDate", String(endDate.value));

        try {
            // const token = getToken();
            const response = await instance.post(
                `/api/admin_product/add`,
                formData
            );

            console.log("새 상품이 추가되었습니다:", response.data);

            window.location.href = "./goods.html";
        } catch (error) {
            console.error("상품 추가 중 오류가 발생했습니다:", error);
        }
    }
};

form.addEventListener("submit", goodsUpdateApi);
