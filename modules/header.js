import URL from './server_url.js';

async function headerCategory() {
  const response = await axios.get(`${URL}/api/product/category/all`);

  const categories = response.data;
  const categoryList = document.querySelector('nav > ul');

  categoryList.innerHTML = categories
    .map(
      ({ category }) => `
            <li>
                <a href="/views/goods/goods_list.html?category=${category}"><span>${category}</span></a>
            </li>
        `
    )
    .join('');

  const li = document.createElement('li');
  li.innerHTML = "<a href='/views/goods/goods_list.html'><span>전체</span></a>";
  categoryList.prepend(li);

  const url = new window.URL(location.href);
  const urlParams = url.searchParams;
  const urlSearchId = urlParams.get('search');

  if (urlSearchId) searchInput.value = urlSearchId;
}

window.addEventListener('load', () => {
  headerCategory();
});

const searchForm = document.querySelector('.search > form');
const searchInput = document.querySelector('.search_input');

if (searchForm) {
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const search = e.target['search_input'].value.trim();

    if (search) location.href = `/views/goods/goods_list.html?search=${search}`;
  });

  searchInput.addEventListener('focus', () => {
    searchInput.style.border = '2px solid var(--color--blue2)';
  });

  searchInput.addEventListener('blur', () => {
    searchInput.style.border = 'none';
  });
}
