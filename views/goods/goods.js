import URL from '../../modules/server_url.js';

async function onLoad() {
  const url = new window.URL(location.href);
  const urlParams = url.searchParams;
  const urlCategoryId = urlParams.get('category');
  const urlSearchId = urlParams.get('search');

  const categoryTitle = document.querySelector('.category_title h2');
  const productList = document.querySelector('.goods_list ul');

  let response;

  if (urlCategoryId !== null) {
    categoryTitle.innerHTML = urlCategoryId;
    response = await axios.get(
      `${URL}/api/product/category?category=${urlCategoryId}&sort=${'new'}`
    );
  } else {
    if (urlSearchId) {
      categoryTitle.innerHTML = '검색상품';
      response = await axios.get(
        `${URL}/api/product/search?keyword=${urlSearchId}&sort=${'new'}`
      );
    } else {
      categoryTitle.innerHTML = '전체상품';
      response = await axios.get(`${URL}/api/product?sort=${'new'}`);
    }
  }

  const products = response.data;
  if (products.length < 1) {
    productList.innerHTML = `<li style="width: 100%; margin-top: 100px; font-size: 20px; color: var(--color--black2); text-align: center;">검색결과가 없습니다.</li>`;
    return;
  }

  productList.innerHTML = products
    .map((product) => createTicket(product))
    .join('');
}

function createTicket(product) {
  const { productId, productName, price, imageUrl, startDate, endDate } =
    product;

  return `<li>
            <a href="/views/goods/goods_view.html?productId=${productId}">
              <div class="img_box">
                <img src="${imageUrl}" alt="${productName}" />
              </div>
              <div class="info_box">
                <span class="goods_date">${startDate} ~ ${endDate}</span>
                <strong class="goods_tit">${productName}</strong>
                <span class="goods_pri">${Number(
                  price
                ).toLocaleString()}원</span>
              </div>
            </a>
          </li>`;
}

window.addEventListener('load', () => {
  onLoad();
});
