"use strict";


const imageUrl = document.querySelector('#goodsImage');
const formUrlInput = document.querySelector('.goods_image');

imageUrl.addEventListener('change', function () {
    const imageValue = imageUrl.value;
    formUrlInput.value = imageValue;
});

/*
상품추가 작업순서:

1. 상품추가 클릭 → goods_edit.html로 이동
2. 정보값 입력 후 → 등록버튼 클릭
3. 등록버튼 클릭시 이벤트로 10.10.6.158:5000/api/admin_product/add 에 POST로 값 보내기
4. 상품관리 페이지로 이동하기
--------------------------

상품수정 작업순서:

1. 상품수정버튼 클릭 → goods_edit.html?productId 경로로 이동
2. edit.html에 비어있는 값에 해당 상품상세정보 GET으로 가져와서 전체 삽입
*/

const updateBtn = document.querySelector('.goods_form input[type="submit"]');



const productName = document.querySelector('#goodsName');
const category = document.querySelector('#goodsCate')
const price = document.querySelector('#goodsPrice');
const place = document.querySelector('#goodsPlace');
const speciesAge = document.querySelector('#goodsAge');
const description = document.querySelector('#goodsDesc');
const startDate = document.querySelector('#goodsDateStart');
const endDate = document.querySelector('#goodsDateEnd');

const goodsUpdateApi = async (e) => {
    e.preventDefault();


    const url = new URL(window.location.href);
    const urlParams = url.searchParams;
    const urlProductId = urlParams.get('productId');
    console.log(urlProductId)

    if (urlProductId !== null) {
        console.log('상품수정')

        try {

            /*
                1. 이 전페이지에서 localStorage로 데이터값 다 저장
                2. 여기서 input값으로 뿌리기
                3. PUT으로 수정된 값 보내기
            */

            /* 
                put data에 들어가야 할 것들: 
                상품명, 이미지, 가격, 장소, 연령, 설명, 시작일, 종료일
            */
            const modifyApi = {
                category: String(category.value),
                productName: String(productName.value),
                imageUrl: String(imageUrl.value),
                price: Number(price.value),
                place: String(place.value),
                speciesAge: String(speciesAge.value),
                description: String(description.value),
                startDate: String(startDate.value),
                endDate: String(endDate.value),
            }

            const response = await axios.PUT(`http://10.10.6.158:5000/api/admin_product/edit?productId=${urlProductId}`, modifyApi);
            console.log('상품이 수정되었습니다:', response.data);

            window.location.href = './goods.html';

        } catch (error) {
            console.error('상품 수정 중 오류가 발생했습니다:', error);
        }

    } else {
        console.log('상품추가')
        /* 
            post data에 들어가야 할 것들: 
            상품명, 이미지, 가격, 장소, 연령, 설명, 시작일, 종료일
        */
        const updateApi = {
            category: String(category.value),
            productName: String(productName.value),
            imageUrl: String(imageUrl.value),
            price: Number(price.value),
            place: String(place.value),
            speciesAge: String(speciesAge.value),
            description: String(description.value),
            startDate: String(startDate.value),
            endDate: String(endDate.value),
        }

        try {
            const response = await axios.post('http://10.10.6.158:5000/api/admin_product/add', updateApi);
            console.log('새 상품이 추가되었습니다:', response.data);

            window.location.href = './goods.html';

        } catch (error) {
            console.error('상품 추가 중 오류가 발생했습니다:', error);
        }
    }

};

updateBtn.addEventListener('click', goodsUpdateApi);




