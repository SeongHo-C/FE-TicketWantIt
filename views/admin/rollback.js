import { isTokenExpired, tokenRefresh, getToken } from "../../modules/token.js";
import instance from "../../modules/axios_interceptor.js";

("use strict");

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

// /* 카테고리 api 받아서 selectbox로 만들기 */
// async function categorySelectApi() {
//     const categorySelect = document.querySelector("#goodsCate");
//     if (isTokenExpired()) await tokenRefresh();

//     const response = await instance.get("/api/admin_category");

//     const categories = response.data;
//     console.log(categories);

//     categorySelect.innerHTML = categories
//         .map(
//             ({ category, categoryId }) => `
//             <option data-id="${categoryId}" value="${category}">${category}</option>
//         `
//         )
//         .join("");
// }

// categorySelectApi();

if (urlProductId !== null) {
    const productModifyApi = async () => {
        if (isTokenExpired()) await tokenRefresh();

        const response = await instance.get("/api/admin_product");
        const products = response.data;

        const filteredProduct = products.filter(
            ({ productId }) => productId === urlProductId
        );
        console.log(filteredProduct);

        const defaultUrl = filteredProduct[0].imageUrl;
        console.log(defaultUrl);

        async function convertURLtoFile(url) {
            if (isTokenExpired()) await tokenRefresh();

            const config = {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
                responseType: "blob",
            };

            const response = await axios.get(url, config);
            const blob = response.data;
            const filename = url.split("/").pop();
            const ext = filename.split(".").pop();
            const type = `image/${ext}`;
            return new File([blob], filename, { type });
        }

        const file = await convertURLtoFile(defaultUrl);
        console.log(file);
        // 새로운 FileList 객체를 만들고
        const fileList = new DataTransfer();
        fileList.items.add(file);

        productName.value = filteredProduct[0].productName;
        category.value = filteredProduct[0].category;
        startDate.value = filteredProduct[0].startDate;
        endDate.value = filteredProduct[0].endDate;
        description.value = filteredProduct[0].description;
        price.value = filteredProduct[0].price;
        speciesAge.value = filteredProduct[0].speciesAge;
        place.value = filteredProduct[0].place;

        /* 가짜 file_inputbox에 url경로만 넣어주기 */
        formUrlInput.value = filteredProduct[0].imageUrl;
        // input 요소의 값으로 FileList 객체를 설정하기.
        // imageUrl.files = fileList;
        imageUrl.files = fileList.files;
    };

    productModifyApi();
}

const goodsUpdateApi = async (e) => {
    e.preventDefault();

    console.log(imageUrl.files[0]);
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

    if (urlProductId !== null) {
        console.log("상품수정");

        try {
            if (isTokenExpired()) await tokenRefresh();

            const response = await instance.put(
                `/api/admin_product/revise?productId=${urlProductId}`,
                formData
            );

            console.log("상품이 수정되었습니다:", response.data);

            window.location.href = "./goods.html";
        } catch (error) {
            console.error("상품 수정 중 오류가 발생했습니다:", error);
        }
    } else {
        console.log("상품추가");

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
