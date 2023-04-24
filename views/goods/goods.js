async function main() {
  const response = await axios.get('http://34.64.112.166/api/product');

  const products = response.data;

  const productList = document.querySelector('.goods_list ul');

  productList.innerHTML = products
    .map(
      ({ productId, productName, price, imageUrl, startDate, endDate }) => `
            <li>
                <a href="./goods_view.html?productId=${productId}">
                <div class="img_box">
                    <img src="${imageUrl}" alt="${productName}" />
                </div>
                <div class="info_box">
                    <span class="goods_date">${startDate} ~ ${endDate}</span>
                    <strong class="goods_tit">${productName}</strong>
                    <span class="goods_pri">${price.toLocaleString()}원</span>
                </div>
                </a>
            </li>
        `
    )
    .join('');
}

main();

/*
2차 구현사항 - 카테고리에따라 분류하기
const categoryNav = document.querySelector("nav");
const categoryList = categoryNav.querySelectorAll("li");

function sortCategory(e) {
    e.preventDefault();
    const selectedCategory = e.target.textContent;
    console.log(`Selected category: ${selectedCategory}`);
}

categoryList.forEach((category) => {
    category.addEventListener("click", sortCategory);
});
*/
