/*
1차 구현사항 리스트
1. goods_list에 product list 뿌리기
2. list클릭시 list안의 url주소의 productID값을 기반으로 goods_view로 넘어가기
*/

async function main() {
  /* 추후에 api연결되면 이걸로 변경 */
  const response = await axios.get('http://10.10.6.158:5000/api/product');

  // const response = await axios.get("./goods_list.json");

  const products = await response.data;
  console.log(products);

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
                    <span class="goods_date">${startDate} - ${endDate}</span>
                    <strong class="goods_tit">${productName}</strong>
                    <span class="goods_pri">${price}</span>
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
