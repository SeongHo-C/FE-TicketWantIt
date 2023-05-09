import { isTokenExpired, tokenRefresh } from '../../modules/token.js';
import instance from '../../modules/axios_interceptor.js';

if (isTokenExpired()) await tokenRefresh();

const userList = document.querySelector('#userList');
// const userSearchBtn = document.querySelector('#userSearchBtn');
const pageNumber = document.querySelector('.page_number');

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
      await deleteUserList();
      const getResponse = await instance.get(`/api/adminUser?page=${num}`)
      const userInfo = getResponse.data[0];
      const totalPage = Math.ceil(getResponse.data[1].total / 7);
    
    for(let i = 0; i < userInfo.length; i++) {
      
      if (userInfo[i].address === undefined ||
        userInfo[i].address === ' (상세주소)') {
          userInfo[i].address = '';
        } else if (userInfo[i].address.split(` (상세주소)`)[1] === undefined ||
                  userInfo[i].address.split(` (상세주소)`)[1] === '') {
          const addressArray = userInfo[i].address.split(` (상세주소)`);
          userInfo[i].address = `${addressArray[0]}`;
        } else {
          const addressArray = userInfo[i].address.split(` (상세주소)`);
          userInfo[i].address = `${addressArray[0]}<br>(상세주소) ${addressArray[1]}`;
        }

        const modifyBtn = document.createElement("button");
        modifyBtn.textContent = "수정";
        modifyBtn.className = "userInfo_modify_btn";
        
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "삭제";
        deleteBtn.className = "userInfo_delete_btn";

        const btnBox = document.createElement("div");
        btnBox.className = "btn_box";
        btnBox.appendChild(modifyBtn);
        btnBox.appendChild(deleteBtn);

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>
            <img src='http://${userInfo[i].profileImage}'alt="이미지"'>
          </td>
          <td>${userInfo[i].name}</td>
          <td>${userInfo[i].email}</td>
          <td>${userInfo[i].address}</td>
          <td></td>
        `;

        const td = tr.querySelector("td:last-child");
        td.appendChild(btnBox);
        userList.appendChild(tr)
        
        for (let i = 0; i < userInfo.length; i++) {
          userList[i].addEventListener('click', async (e) => {
            e.preventDefault();
            console.log(userInfo[i])
            // try {
            //   const postResponse = await instance.post(`/api/adminUser/${shortId}`);
            //   console.log(getResponse)
            // } catch (error) {
            //   console.log(error);
            // }
          })
        }
      }

      for (let i = 1; i <= totalPage; i++) {
        const li = document.createElement('li');
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
      )}
  } catch (error) {
    console.log(error);
  }
}

showUserList();