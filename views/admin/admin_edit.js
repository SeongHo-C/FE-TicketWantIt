import { isTokenExpired, tokenRefresh } from "../../modules/token.js";
import instance from "../../modules/axios_interceptor.js";

("use strict");
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
const updateBtn = document.querySelector('.goods_form input[type="submit"]');

const productName = document.querySelector("#goodsName");
const category = document.querySelector("#goodsCate");
const price = document.querySelector("#goodsPrice");
const place = document.querySelector("#goodsPlace");
const speciesAge = document.querySelector("#goodsAge");
const description = document.querySelector("#goodsDesc");
const startDate = document.querySelector("#goodsDateStart");
const endDate = document.querySelector("#goodsDateEnd");

const url = new URL(window.location.href);
const urlParams = url.searchParams;
const urlProductId = urlParams.get("productId");
console.log(urlProductId);

const product = JSON.parse(localStorage.getItem("product"));

if (product !== null) {
    category.value = product.category;
    productName.value = product.name;
    price.value = product.price;
    description.value = product.description;
    startDate.value = product.startDate;
    endDate.value = product.endDate;
    speciesAge.value = product.speciesAge;
    place.value = product.place;

    formUrlInput.value = product.image;
}

localStorage.removeItem("product");

const goodsUpdateApi = async (e) => {
    e.preventDefault();

    if (urlProductId !== null) {
        console.log("상품수정");

        const updateApi = {
            category: String(category.value),
            productName: String(productName.value),
            imageUrl: String(imageUrl.files[0]),
            price: Number(price.value),
            place: String(place.value),
            speciesAge: String(speciesAge.value),
            description: String(description.value),
            startDate: String(startDate.value),
            endDate: String(endDate.value),
        };

        const formData = new FormData();
        formData.append("imageUrl", imageUrl.files[0]);

        try {
            if (isTokenExpired()) await tokenRefresh();

            const responseUrl = await instance.put(
                `/api/admin_product/edit/img?productId=${urlProductId}`,
                formData
            );

            console.log("상품 이미지가 수정되었습니다:", responseUrl.data);
            window.location.href = "./goods.html";
        } catch (error) {
            console.error("이미지 수정 중 오류가 발생했습니다:", error);
        }

        try {
            if (isTokenExpired()) await tokenRefresh();

            const response = await instance.put(
                `/api/admin_product/edit?productId=${urlProductId}`,
                updateApi
            );

            console.log("상품이 수정되었습니다:", response.data);
            window.location.href = "./goods.html";
        } catch (error) {
            console.error("상품 수정 중 오류가 발생했습니다:", error);
        }
    } else {
        console.log("상품추가");

        const formData = new FormData();

        formData.append("category", category.value);
        formData.append("productName", productName.value);
        formData.append("imageUrl", imageUrl.files[0]);
        formData.append("price", price.value);
        formData.append("place", place.value);
        formData.append("speciesAge", speciesAge.value);
        formData.append("description", description.value);
        formData.append("startDate", startDate.value);
        formData.append("endDate", endDate.value);

        try {
            const response = await instance.post(
                "/api/admin_product/add",
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
