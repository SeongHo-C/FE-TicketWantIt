const [
  email,
  nameInput,
  number,
  address
] = document.querySelectorAll('.userInfo')


 axios.get('/api/user')
 .then((res) => {
   email.innerHTML = res.data.email;
   nameInput.innerHTML = res.data.name;
   number.innerHTML = res.data.number;
   address.innerHTML = res.data.address;
 })
 .catch((err) => {
   console.log(err);
   alert('정보를 불러오지 못했습니다. 잠시 뒤 다시 시도해보세요.');
 })