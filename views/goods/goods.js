async function main() {
    const response = await fetch("https://fakestoreapi.com/products");
    const products = await response.json();
    const productsList = document.querySelector(".goods_list ul");

    console.log(products);

    productsList.innerHTML = products
        .map(
            (product) => `
        <li>
            <a href="./goods_view.html">
                <div class="img_box">
                    <img
                        src="${product.image}"
                        alt="${product.title}"
                    />
                </div>
                <div class="info_box">
                    <span class="goods_date">
                        2023-04-20
                    </span>
                    <strong class="goods_tit">${product.title}</strong>
                    <span class="goods_pri">${product.price}</span>
                </div>
            </a>
        </li>
        `
        )
        .join("");
}

main();
