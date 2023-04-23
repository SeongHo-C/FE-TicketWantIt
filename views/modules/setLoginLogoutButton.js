export function getToken() {
  return localStorage.getItem('token');
}

export function setLoginLogoutButton() {
  var token = getToken();
  if (token) {
    document.querySelector('.login').classList.add('dn');
    document.querySelector('.logout').classList.remove('dn');
  } else {
    document.querySelector('.login').classList.remove('dn');
    document.querySelector('.logout').classList.add('dn');
  }
}