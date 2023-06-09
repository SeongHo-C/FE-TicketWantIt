import instance from "../../modules/axios_interceptor.js";

const currentDate = new Date();
const options = { day: "numeric", month: "short", year: "numeric" };
const formattedDate = currentDate
    .toLocaleDateString("en-US", options)
    .toUpperCase();

const date = document.querySelector(".date span");
date.innerHTML = formattedDate;

const categoryList = document.querySelector(".cate_list > ul");
const addCategorybutton = document.querySelector(".btn_add_category");

/* 카테고리 추가 */

async function categoryAdd() {
    const addCategoryInput = document.querySelector("#addCategory");
    console.log(addCategoryInput.value);

    if (addCategoryInput.value !== "") {
        try {
            const response = await instance.post("/api/admin_category/add", {
                category: addCategoryInput.value,
            });

            console.log("카테고리가 추가되었습니다.", response.data);
            location.reload();
            addCategoryInput.value = "";
        } catch (error) {
            console.error("카테고리가 추가에 실패했습니다", error);
        }
    }
}

addCategorybutton.addEventListener("click", categoryAdd);

/* 카테고리 수정, 삭제 */
async function categoryApi() {
    const response = await instance.get("/api/admin_category");

    const categories = response.data;
    console.log(categories);

    categoryList.innerHTML = categories
        .map(
            ({ category, categoryId }) => `
            <li data-id="${categoryId}">
            <input type="text" value="${category}">
            <button class="btn_cate_modify">
                수정
            </button>
            <button class="btn_cate_delete">
                삭제
            </button>
        </li>
    `
        )
        .join("");

    async function handleCategoryClick(e) {
        e.preventDefault();
        const categoryElem = e.target.closest("li");
        const categoryId = categoryElem.dataset.id;

        if (e.target.classList.contains("btn_cate_delete")) {
            try {
                if (isTokenExpired()) await tokenRefresh();

                const response = await instance.delete(
                    `/api/admin_category/delete?categoryId=${categoryId}`
                );

                console.log("카테고리가 삭제되었습니다:", response);

                alert("카테고리가 삭제되었습니다.");
                location.reload();
            } catch (error) {
                console.error("카테고리 삭제 중 오류가 발생했습니다:", error);
            }
        } else if (e.target.classList.contains("btn_cate_modify")) {
            const categoryInput = categoryElem.querySelector("input");

            try {
                const response = await instance.put(
                    `/api/admin_category/edit?categoryId=${categoryId}`,
                    {
                        category: categoryInput.value,
                    }
                );

                console.log("해당 카테고리가 수정되었습니다:", response);

                alert("해당 카테고리가 수정되었습니다.");
                location.reload();
            } catch (error) {
                console.error("카테고리 수정 중 오류가 발생했습니다:", error);
            }
        }
    }

    const list = document.querySelectorAll(".cate_list > ul > li");

    list.forEach((li) => {
        const deleteButton = li.querySelector(".btn_cate_delete");
        const modifyButton = li.querySelector(".btn_cate_modify");

        deleteButton.addEventListener("click", handleCategoryClick);
        modifyButton.addEventListener("click", handleCategoryClick);
    });
}

categoryApi();
