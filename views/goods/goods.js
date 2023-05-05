import URL from '../../modules/server_url.js';

async function main() {
  const url = new window.URL(location.href);
  const urlParams = url.searchParams;
  const urlCategoryId = urlParams.get('category');

  const categoryTitle = document.querySelector('.category_title h2');
  const productList = document.querySelector('.goods_list ul');

  if (urlCategoryId !== null) {
    const response = await axios.get(
      `${URL}/api/product/category?category=${urlCategoryId}`
    );

    const products = response.data;

    productList.innerHTML = products
      .map(
        ({ productId, productName, price, imageUrl, startDate, endDate }) => `
                <li>
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
                </li>
            `
      )
      .join('');

    categoryTitle.innerHTML = urlCategoryId;
  } else {
    const response = await axios.get(`${URL}/api/product`);

    const products = response.data;

    productList.innerHTML = products
      .map(
        ({ productId, productName, price, imageUrl, startDate, endDate }) => `
                <li>
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
                </li>
            `
      )
      .join('');

    categoryTitle.innerHTML = '전체상품';
  }
}

main();
