async function headerCategory() {
    const response = await axios.get(
        "http://34.64.112.166/api/product/category/all"
    );

    const categories = response.data;
    const categoryList = document.querySelector("nav > ul");

    categoryList.innerHTML = categories
        .map(
            ({ category }) => `
            <li>
                <a href="/views/goods/goods_list.html?category=${category}"><span>${category}</span></a>
            </li>
        `
        )
        .join("");

    const li = document.createElement("li");
    li.innerHTML =
        "<a href='/views/goods/goods_list.html'><span>전체</span></a>";
    categoryList.prepend(li);
}

headerCategory();
