const productView = document.querySelector('.goods_detail');

async function main() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('productId');

  const response = await axios.get(
    `http://10.10.6.158:5000/api/product/detail?productId=${productId}`
  );
  const {
    category,
    description,
    startDate,
    endDate,
    imageUrl,
    place,
    price,
    productName,
    speciesAge,
  } = response.data;

  console.log(response.data);
  productView.innerHTML = `
        <div class="img_box">
            <img
                src=${imageUrl}
                alt=""
            />
        </div>
        <div class="info_box">
            <div>
                <div class="top">
                    <div class="date">2023-02-04 ~ 2023-04-27</div>
                    <div class="title">
                    ${productName}
                    </div>
                    <div class="description">
                        ${description}
                    </div>
                    <div class="price">${price.toLocaleString()}원</div>
                </div>

                <div class="detail_info">
                    <dl class="age">
                        <dt>연령제한</dt>
                        <dd>${speciesAge}</dd>
                    </dl>
                    <dl>
                        <dt>장소</dt>
                        <dd>${place}</dd>
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
