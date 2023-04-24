async function main() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('productId');

    const response = await axios.get(
      `http://10.10.6.158:5000/api/product/detail?productId=${productId}`
    );

    productView.innerHTML = createView(response.data);
  } catch (error) {
    console.log(error);
  }
}

function createView(data) {
  const {
    description,
    startDate,
    endDate,
    imageUrl,
    place,
    price,
    productName,
    speciesAge,
  } = data;

  return `<div class="img_box">
            <img
                src=${imageUrl}
                alt="상품 이미지"
            />
        </div>
        <div class="info_box">
            <div>
                <div class="top">
                    <div class="date">${startDate} ~ ${endDate}</div>
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
            </div>

            <div class="btn_box">
                <button class="btn_cart">장바구니</button>
                <button class="btn_buy">바로구매</button>
            </div>
        </div>
    `;
}

const productView = document.querySelector('.goods_detail');

window.addEventListener('load', () => {
  main();
});
