import logout from '../../modules/logout.js'

const logoutButton = document.querySelector('.menu_icon.logout');

logoutButton.addEventListener('click', (e) => {
  e.preventDefault();
  logout();
});