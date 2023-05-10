import URL from '../../modules/server_url.js';

const noSearchResultPage =
  '<li style="width: 100%; margin-top: 100px; font-size: 20px; color: var(--color--black2); text-align: center;">검색결과가 없습니다.</li>';

async function onLoad() {
  const url = new window.URL(location.href);
  const urlParams = url.searchParams;
  const urlCategoryId = urlParams.get('category');
  const urlSearchId = urlParams.get('search');

  const option = {
    root: null,
    rootMargin: '0px 0px 0px 0px',
    thredhold: 0,
  };

  let page = 0;
  const onIntersect = (entries, observer) => {
    entries.forEach(async (entry) => {
      if (entry.isIntersecting) {
        console.log('무한 스크롤 실행');
        page++;
        console.log('page: ' + page);
        const response = await getData(page, urlCategoryId, urlSearchId);
        const products = response.data;

        if (page === 1 && products.length < 1) {
          productList.innerHTML = noSearchResultPage;
          return;
        }

        productList.insertAdjacentHTML(
          'beforeend',
          products.map(createTicket).join('')
        );
      }
    });
  };

  const observer = new IntersectionObserver(onIntersect, option);
  observer.observe(listEnd);
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

async function getData(page, urlCategoryId, urlSearchId) {
  if (urlCategoryId !== null) {
    categoryTitle.innerHTML = urlCategoryId;
    return await axios.get(
      `${URL}/api/product/category?category=${urlCategoryId}&sort=${'new'}&page=${page}`
    );
  } else {
    if (urlSearchId) {
      categoryTitle.innerHTML = '검색상품';
      return await axios.get(
        `${URL}/api/product/search?keyword=${urlSearchId}&sort=${'new'}&page=${page}`
      );
    } else {
      categoryTitle.innerHTML = '전체상품';
      return await axios.get(`${URL}/api/product?sort=${'new'}&page=${page}`);
    }
  }
}

const categoryTitle = document.querySelector('.category_title h2');
const productList = document.querySelector('.goods_list ul');
const listEnd = document.querySelector('#endList');

window.addEventListener('load', () => {
  onLoad();
});
