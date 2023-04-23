export const handleMyPageClick = (e) => {
  e.preventDefault();
  const token = getToken();
   if (!token) {
     window.location.href = '../login/login.html';
   } else {
     window.location.href = '../mypage/userInfo/userInfo.js';
   }
};