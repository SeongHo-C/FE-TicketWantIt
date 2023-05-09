import URL from '../../modules/server_url.js';

async function newArrivals() {
  const response = await axios({
    method: 'GET',
    url: `${URL}/api/product/new_arrivals`,
  });

  const products = response.data;

  const productList = document.querySelector('.main_goods.new .goods_list ul');

  productList.innerHTML = products
    .map(
      ({
        productId,
        productName,
        price,
        imageUrl,
        startDate,
        endDate,
        discount,
        discountPrice,
      }) => `
            <li>
                <a href="/views/goods/goods_view.html?productId=${productId}">
                <div class="img_box">
                    <img src="${imageUrl}" alt="${productName}" />
                </div>
                <div class="info_box">
                    <span class="goods_date">${startDate} ~ ${endDate}</span>
                    <strong class="goods_tit">${productName}</strong>
                    <div class="price_box ${discount !== 0 ? 'discount' : ''}">
                      <strong class="discount">${discount}%</strong>

                      <span class="discount_price">${Number(
                        discountPrice
                      ).toLocaleString('ko-KR')}원</span>
                      <span class="fixed_price">${Number(price).toLocaleString(
                        'ko-KR'
                      )}원</span>
                    </div>
                    
                </div>
                </a>
            </li>
        `
    )
    .join('');
}

newArrivals();

async function mdRecommends() {
  const response = await axios({
    method: 'GET',
    url: `${URL}/api/product/MD_Pick`,
  });

  const products = response.data;

  const productList = document.querySelector('.main_goods.best .goods_list ul');

  productList.innerHTML = products
    .map(
      ({
        productId,
        productName,
        price,
        imageUrl,
        startDate,
        endDate,
        discount,
        discountPrice,
      }) => `
            <li>
                <a href="/views/goods/goods_view.html?productId=${productId}">
                <div class="img_box">
                    <img src="${imageUrl}" alt="${productName}" />
                </div>
                <div class="info_box">
                    <span class="goods_date">${startDate} ~ ${endDate}</span>
                    <strong class="goods_tit">${productName}</strong>
                    <div class="price_box ${discount !== 0 ? 'discount' : ''}">
                      <strong class="discount">${discount}%</strong>

                      <span class="discount_price">${Number(
                        discountPrice
                      ).toLocaleString('ko-KR')}원</span>
                      <span class="fixed_price">${Number(price).toLocaleString(
                        'ko-KR'
                      )}원</span>
                    </div>
                </div>
                </a>
            </li>
        `
    )
    .join('');
}

mdRecommends();
