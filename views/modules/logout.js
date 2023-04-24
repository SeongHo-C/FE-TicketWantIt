export const logout = () => {
  axios.get('/api/auth/logout')
  .then(() => {
    setLoginLogoutButton();
    window.location.href = '../home/index.html';
  })
  .catch((err) =>{
    console.log(err);
  });
}