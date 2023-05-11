import instance from '../../modules/axios_interceptor.js';

const userList = document.querySelector('#userList');
// const userSearchBtn = document.querySelector('#userSearchBtn');
const pageNumber = document.querySelector('.pagination > ol');
const modal = document.querySelector('#modal');
const closeModalButton = document.querySelector(".close_area > button");
const [ nameInput,
  phoneNumberInput,
  addressInput,
  zipCodeInput ] = document.querySelectorAll('.userInfoInput');
const userInfoModifyBtn = document.querySelector('#userInfoModify');

let num = 1;

async function deleteUserList () {
  while (userList.firstChild) {
    userList.removeChild(userList.firstChild);
  }
}

async function deletePageList() {
  while (pageNumber.firstChild) {
    pageNumber.removeChild(pageNumber.firstChild);
  }
}

async function showUserList() {
  try {
      deleteUserList();
      const getResponse = await instance.get(`/api/adminUser?page=${num}`)
      const userInfo = getResponse.data[0];
      const totalPage = Math.ceil(getResponse.data[1].total / 7);
    for(let i = 0; i < userInfo.length; i++) {
      if (userInfo[i].address === ' (상세주소)') {
          userInfo[i].address = '';
        } else if (userInfo[i].address.split(` (상세주소)`)[1] === undefined ||
          userInfo[i].address.split(` (상세주소)`)[1] === '') {
          const addressArray = userInfo[i].address.split(` (상세주소)`);
          userInfo[i].address = `${addressArray[0]}`;
        } else {
          const addressArray = userInfo[i].address.split(` (상세주소)`);
          userInfo[i].address = `${addressArray[0]}<br>(상세주소) ${addressArray[1]}`;
        }
      
      if (userInfo[i].phoneNumber === undefined ||
          userInfo[i].phoneNumber === '--') {
          userInfo[i].phoneNumber = '';
        }
       
          const modifyBtn = document.createElement("button");

          if (userInfo[i].state === true) {
            modifyBtn.textContent = "수정";
            modifyBtn.className = "userInfo_modify_btn";
          } else {
            modifyBtn.style.display = 'none';
          }
        
          const deleteBtn = document.createElement("button");
          deleteBtn.textContent = "삭제";
          deleteBtn.className = "userInfo_delete_btn";
  
          modifyBtn.addEventListener('click', function() {
          modal.style.display = 'flex';
          nameInput.setAttribute('value', userInfo[i].name);
          phoneNumberInput.setAttribute('value', userInfo[i].phoneNumber);
          addressInput.setAttribute('value', userInfo[i].address);
          zipCodeInput.setAttribute('value', userInfo[i].zipCode);
          console.log(userInfo[i].state)
          userInfoModifyBtn.addEventListener('click', async () => {
            try {
              const postResponse = await instance.put(`api/adminUser/${userInfo[i].shortId}`, {
                name: nameInput.value,
                phoneNumber: phoneNumberInput.value,
                address: addressInput.value,
                zipCode: zipCodeInput.value
              })
              confirm('유저정보를 수정하시겠습니까?');
              alert('유저정보가 수정되었습니다.');
              location.reload();
              } catch (error) {
                console.log(error);
              }
            });
          }.bind({ index: i })
        )

        deleteBtn.addEventListener('click', async () => {
          if (confirm('유저정보를 정말 삭제하시겠습니까?')) {
            try {
              const deleteResponse = await instance.delete(`api/adminUser/${userInfo[i].shortId}`)
              location.reload();
            } catch (error) {
              console.log(error);
            }
            alert('유저정보가 삭제되었습니다.');
            } else {
            alert('유저정보 삭제를 취소했습니다.');
            }
          });

        const btnBox = document.createElement("div");
        btnBox.className = "button_box";
        btnBox.appendChild(modifyBtn);
        btnBox.appendChild(deleteBtn);

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>
            <img src='${userInfo[i].profileImage}'alt="이미지"'>
          </td>
          <td>${userInfo[i].name}</td>
          <td>${userInfo[i].email}</td>
          <td>${userInfo[i].address}</td>
          <td>${userInfo[i].phoneNumber}</td>
          <td></td>
        `;

        const td = tr.querySelector("td:last-child");
        td.appendChild(btnBox);
        userList.appendChild(tr);
      }

      for (let i = 1; i <= totalPage; i++) {
        const li = document.createElement('li');
        li.className = 'btn_page';
        li.textContent = i;
        pageNumber.appendChild(li);
        if (num === i) {
          li.className = 'active';
        }
      }
      for (let i = 0; i < pageNumber.children.length; i++) {
        pageNumber.children[i].addEventListener('click', () => {
          num = i + 1;
          deleteUserList();
          deletePageList();
          showUserList();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      )
    }
  } catch (error) {
    console.log(error);
  }
}

showUserList();

closeModalButton.addEventListener("click", (e) => {
  modal.style.display = "none";
});