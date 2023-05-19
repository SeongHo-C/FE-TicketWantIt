import { saveToken, saveRefreshToken } from "./token.js";
import instance from "./axios_interceptor.js";
import URL from "./server_url.js";

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

const searchForm = document.querySelector(".search > form");
const searchInput = document.querySelector(".search_input");

if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const keyword = e.target["search_input"].value.trim();

        if (keyword)
            location.href = `/views/goods/goods_list.html?keyword=${keyword}`;
    });

    searchInput.addEventListener("focus", () => {
        searchInput.style.border = "2px solid var(--color--blue2)";
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

    /*
    try {
        const response = await instance.post("/api/auth", {
            email: email.value,
            password: password.value,
        });

        const { accessToken, refreshToken } = response.data;
        const { isAdmin } = jwt_decode(accessToken);

        saveToken(accessToken);
        saveRefreshToken(refreshToken);

        console.log(isAdmin);

        if (isAdmin) {
            const adminLiHtml = `
              <li>
                <a href="./views/admin/goods.html" class="btn_admin">
                  <span>관리자<br />바로가기</span>
                </a>
              </li>
            `;
            ul.innerHTML += adminLiHtml;
        }
    } catch {}

    */
    document.body.appendChild(sideBtnBox);

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
