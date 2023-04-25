async function headerCategory() {
    const response = await axios.get("http://34.64.112.166/api/admin_category");

    const categories = response.data;
    const categoryList = document.querySelector("nav > ul");

    categoryList.innerHTML = categories
        .map(
            ({ category }) => `
            <li>
                <a href="../goods/goods_list.html?category=${category}"><span>${category}</span></a>
            </li>
        `
        )
        .join("");
}

headerCategory();
