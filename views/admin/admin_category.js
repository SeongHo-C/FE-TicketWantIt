"use strict";

const categoryList = document.querySelector(".cate_list > ul");

/* 상품목록리스트 */
async function categoryApi() {
    const response = await axios({
        method: "GET",
        url: "http://34.64.112.166/api/admin_category",
    });

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

    const list = document.querySelectorAll(".cate_list > ul > li");

    list.forEach((li) =>
        li
            .querySelector(".btn_cate_delete")
            .addEventListener("click", async (e) => {
                e.preventDefault();
                const categoryElem = e.target.closest("li");
                const categoryId = categoryElem.dataset.id;

                console.log(categoryId);

                try {
                    const response = await axios.delete(
                        `http://34.64.112.166/api/admin_category/delete?categoryId=${categoryId}`
                    );

                    console.log("카테고리가 삭제되었습니다:", response);

                    alert("카테고리가 삭제되었습니다.");
                    location.reload();
                } catch (error) {
                    console.error(
                        "카테고리 삭제 중 오류가 발생했습니다:",
                        error
                    );
                }
            })
    );

    list.forEach((li) =>
        li
            .querySelector(".btn_cate_modify")
            .addEventListener("click", async (e) => {
                e.preventDefault();
                const categoryElem = e.target.closest("li");
                const categoryInput = categoryElem.querySelector("input");
                const categoryId = categoryElem.dataset.id;

                try {
                    const response = await axios.put(
                        `http://34.64.112.166/api/admin_category/edit?categoryId=${categoryId}`,
                        {
                            category: categoryInput.value,
                        }
                    );

                    console.log("해당 카테고리가 수정되었습니다:", response);

                    alert("해당 카테고리가 수정되었습니다.");
                    location.reload();
                } catch (error) {
                    console.error(
                        "카테고리 수정 중 오류가 발생했습니다:",
                        error
                    );
                }
            })
    );
}

categoryApi();

const addCategorybutton = document.querySelector(".btn_add_category");

async function categoryAdd() {
    const addCategoryInput = document.querySelector("#addCategory");
    console.log(addCategoryInput.value);

    if (addCategoryInput.value !== "") {
        try {
            const response = await axios.post(
                "http://34.64.112.166/api/admin_category/add",
                {
                    category: addCategoryInput.value,
                }
            );

            console.log("카테고리가 추가되었습니다.", response.data);
            location.reload();
            addCategoryInput.value = "";
        } catch (error) {
            console.error("카테고리가 추가에 실패했습니다", error);
        }
    }
}

addCategorybutton.addEventListener("click", categoryAdd);
