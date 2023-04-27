async function main() {
  const url = new URL(window.location.href);
  const urlParams = url.searchParams;
  const urlCategoryId = urlParams.get('category');
  console.log(urlCategoryId);

  const categoryTitle = document.querySelector('.category_title h2');
  const productList = document.querySelector('.goods_list ul');

  if (urlCategoryId !== null) {
    const response = await axios.get(
      `http://34.64.112.166/api/product/category?category=${urlCategoryId}`
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
    const response = await axios.get(`http://34.64.112.166/api/product`);

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
                        <span class="goods_pri">${price.toLocaleString()}원</span>
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
