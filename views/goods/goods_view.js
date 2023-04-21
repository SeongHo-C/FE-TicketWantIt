const productView = document.querySelector(".goods_detail");

async function main() {
    /* 추후에 api연결되면 이걸로 변경 */
    // const response = await axios({
    //     method: "GET",
    //     url: "https://fakestoreapi.com/products",
    // });

    const response = await axios.get("./goods_view.json");

    const products = await response.data;
    console.log(products);

    // URL에서 productId 값을 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const urlProductId = urlParams.get("productId");
    console.log(urlProductId);

    //URL의 productId값과 goods_view.json의 productID의 값이 같은경우에 해당 값 출력

    const productsViewItem = products.find(
        (item) => item.productID === urlProductId
    );

    productView.innerHTML = `
        <div class="img_box">
            <img
                src="${productsViewItem.productID}"
                alt=""
            />
        </div>
        <div class="info_box">
            <div>
                <div class="top">
                    <div class="date">2023-02-04 ~ 2023-04-27</div>
                    <div class="title">
                    ${productsViewItem.productName}
                    </div>
                    <div class="description">
                        ${productsViewItem.description}
                    </div>
                    <div class="price">${productsViewItem.price}</div>
                </div>

                <div class="detail_info">
                    <dl class="age">
                        <dt>연령제한</dt>
                        <dd>${productsViewItem.speciesAge}</dd>
                    </dl>
                    <dl>
                        <dt>장소</dt>
                        <dd>${productsViewItem.place}</dd>
                    </dl>
                </div>
                <div class="count">
                    <button type="button">
                        <span>-</span>
                    </button>
                    <input
                        type="text"
                        value="1"
                        inputmode="numeric"
                        onKeyup="this.value=this.value.replace(/[^-0-9]/g,'');"
                    />

                    <button type="button">
                        <span><i class="ri-add-line"></i></span>
                    </button>
                </div>
            </div>

            <div class="btn_box">
                <button class="btn_cart">장바구니</button>
                <button class="btn_buy">바로구매</button>
            </div>
        </div>
    `;
}

main();
