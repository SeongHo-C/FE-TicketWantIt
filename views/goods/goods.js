import URL from '../../modules/server_url.js';

const noSearchResultPage =
  '<li style="width: 100%; margin-top: 100px; font-size: 20px; color: var(--color--black2); text-align: center;">검색결과가 없습니다.</li>';

async function onLoad() {
  const url = new window.URL(location.href);
  const urlParams = url.searchParams;
  const urlCategoryId = urlParams.get('category');
  const urlKeywordId = urlParams.get('keyword');
  const urlSortId = urlParams.get('sort') || 'new';

  const selectedText = getSelectedText(urlSortId);
  selectBtn.innerHTML = selectedText;

  goodsFilter.addEventListener('change', (e) => {
    const url = location.href.split('?')[0];
    const sort = e.target.value;

    if (sort === urlSortId) return;

    location.href = `${url}?sort=${sort}${
      (urlCategoryId && '&category=' + urlCategoryId) ||
      (urlKeywordId && '&keyword=' + urlKeywordId) ||
      ''
    }`;
  });

  const listEnd = document.querySelector('#listEnd');
  const options = {
    root: null,
    rootMargin: '0px 0px 0px 0px',
    threshold: 0,
  };

  let page = 0;
  const onIntersect = (entries, observer) => {
    entries.forEach(async (entry) => {
      if (entry.isIntersecting) {
        console.log('무한 스크롤 실행');
        page++;
        console.log('page: ' + page);
        const products = await getData(
          page,
          urlCategoryId,
          urlKeywordId,
          urlSortId
        );

        if (products.length < 1) {
          if (page === 1) productList.innerHTML = noSearchResultPage;
          observer.unobserve(listEnd);
          return;
        }

        productList.insertAdjacentHTML(
          'beforeend',
          products.map(createTicket).join('')
        );
      }
    });
  };

  const observer = new IntersectionObserver(onIntersect, options);
  observer.observe(listEnd);
}

function getSelectedText(urlSortId) {
  return [...goodsFilter.options].find((option) => option.value === urlSortId)
    .text;
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

async function getData(page, urlCategoryId, urlKeywordId, urlSortId) {
  try {
    let response;

    if (urlCategoryId !== null) {
      categoryTitle.innerHTML = urlCategoryId;
      response = await axios.get(
        `${URL}/api/product/category?category=${urlCategoryId}&sort=${urlSortId}&page=${page}`
      );
    } else {
      if (urlKeywordId) {
        categoryTitle.innerHTML = '검색상품';
        response = await axios.get(
          `${URL}/api/product/search?keyword=${urlKeywordId}&sort=${urlSortId}&page=${page}`
        );
      } else {
        categoryTitle.innerHTML = '전체상품';
        response = await axios.get(
          `${URL}/api/product?sort=${urlSortId}&page=${page}`
        );
      }
    }

    return response.data;
  } catch (error) {
    console.log(error);
  }
}

const categoryTitle = document.querySelector('.category_title h2');
const productList = document.querySelector('.goods_list ul');
const goodsFilter = document.querySelector('#goodsFilter');
const selectBtn = document.querySelector('.fsb-button');

window.addEventListener('load', () => {
  onLoad();
});
