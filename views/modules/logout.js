import axios from 'axios';
import setLoginLogoutButton from './setLoginLogoutButton';

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