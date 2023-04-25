async function newArrivals() {
    const response = await axios({
        method: "GET",
        url: "http://34.64.112.166/api/product/new_arrivals",
    });

    const products = response.data;
    console.log(products);

    const productList = document.querySelector(
        ".main_goods.new .goods_list ul"
    );

    productList.innerHTML = products
        .map(
            ({ productId, productName, price, imageUrl }) => `
            <li>
                <a href="../goods/goods_view.html?productId=${productId}">
                <div class="img_box">
                    <img src="${imageUrl}" alt="${productName}" />
                </div>
                <div class="info_box">
                    <span class="goods_date">2023-04-20</span>
                    <strong class="goods_tit">${productName}</strong>
                    <span class="goods_pri">${price}</span>
                </div>
                </a>
            </li>
        `
        )
        .join("");
}

newArrivals();

async function mdRecommends() {
    const response = await axios({
        method: "GET",
        url: "http://34.64.112.166/api/product/MD_Pick",
    });

    const products = response.data;
    console.log(products);

    const productList = document.querySelector(
        ".main_goods.best .goods_list ul"
    );

    productList.innerHTML = products
        .map(
            ({ productId, productName, price, imageUrl }) => `
            <li>
                <a href="../goods/goods_view.html?productId=${productId}">
                <div class="img_box">
                    <img src="${imageUrl}" alt="${productName}" />
                </div>
                <div class="info_box">
                    <span class="goods_date">2023-04-20</span>
                    <strong class="goods_tit">${productName}</strong>
                    <span class="goods_pri">${price}</span>
                </div>
                </a>
            </li>
        `
        )
        .join("");
}

mdRecommends();
