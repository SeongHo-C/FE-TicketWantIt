"use strict";

const categoryList = document.querySelector(".cate_list > ul");

/* 상품목록리스트 */
async function categoryApi() {
    const response = await axios.get(
        "http://34.64.112.166/api/admin_category",
        {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        }
    );

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

    // 카테고리 추가, 삭제
    async function handleCategoryClick(e) {
        e.preventDefault();
        const categoryElem = e.target.closest("li");
        const categoryId = categoryElem.dataset.id;

        if (e.target.classList.contains("btn_cate_delete")) {
            try {
                const response = await axios.delete(
                    `http://34.64.112.166/api/admin_category/delete?categoryId=${categoryId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${getToken()}`,
                        },
                    }
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
                const response = await axios.put(
                    `http://34.64.112.166/api/admin_category/edit?categoryId=${categoryId}`,
                    {
                        category: categoryInput.value,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${getToken()}`,
                        },
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
                },
                {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
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
