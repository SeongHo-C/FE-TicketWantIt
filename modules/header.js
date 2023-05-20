import URL from "./server_url.js";
import { getToken } from "./token.js";

async function headerCategory() {
    const response = await axios.get(`${URL}/api/product/category/all`);

    const categories = response.data;
    const categoryList = document.querySelector("nav > ul");

    categoryList.innerHTML = categories
        .map(
            ({ category }) => `
            <li>
                <a href="/views/goods/goods_list.html?category=${category}"><span>${category}</span></a>
            </li>
        `
        )
        .join("");

    const li = document.createElement("li");
    li.innerHTML =
        "<a href='/views/goods/goods_list.html'><span>전체</span></a>";
    categoryList.prepend(li);

    const url = new window.URL(location.href);
    const urlParams = url.searchParams;
    const urlKeywordId = urlParams.get("keyword");

    if (urlKeywordId) searchInput.value = urlKeywordId;
}

window.addEventListener("load", () => {
    headerCategory();
});

const searchForm = document.querySelector(".search_container > form");
const searchInput = document.querySelector(".search_input");
const searchIcon = document.querySelector("header .menu_icon.search");
const searchContainer = document.querySelector(".search_container");

searchIcon.addEventListener("click", () => {
    searchContainer.classList.toggle("dn");
});
console.log("");
if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const keyword = e.target["search_input"].value.trim();

        if (keyword)
            location.href = `/views/goods/goods_list.html?keyword=${keyword}`;
    });

    searchInput.addEventListener("blur", () => {
        searchInput.style.border = "none";
    });
}

async function addSideButtons() {
    const sideBtnBox = document.createElement("div");
    sideBtnBox.className = "side_btn_box";
    const ul = document.createElement("ul");
    sideBtnBox.appendChild(ul);

    const liHtml = `
    <li>
      <button class="btn_scroll down">
        <i class="ri-download-line"></i>
      </button>
    </li>
  `;
    ul.innerHTML += liHtml;

    document.body.appendChild(sideBtnBox);

    try {
        const token = getToken();
        const { isAdmin } = jwt_decode(token);

        if (isAdmin) {
            const adminLiHtml = `
            <li>
              <a href="/views/admin/goods.html" class="btn_admin">
                <span>관리자<br />바로가기</span>
              </a>
            </li>
          `;
            ul.innerHTML += adminLiHtml;
        }
    } catch (error) {
        console.log(error);
    }

    const btnScroll = document.querySelector(".btn_scroll");

    btnScroll.addEventListener("click", () => {
        if (btnScroll.classList.contains("down")) {
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: "smooth",
            });
        } else if (btnScroll.classList.contains("top")) {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
    });

    window.addEventListener("scroll", () => {
        const footerOffsetTop = document.querySelector("footer").offsetTop;
        const windowHeight = window.innerHeight;
        const shouldShowTopButton =
            window.pageYOffset + windowHeight >= footerOffsetTop;

        btnScroll.classList.toggle("top", shouldShowTopButton);
        btnScroll.classList.toggle("down", !shouldShowTopButton);
    });
}

addSideButtons();
