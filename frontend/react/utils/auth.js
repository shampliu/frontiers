export function logout() {
  localStorage.removeItem('email');
  localStorage.removeItem('access_token');
  window.location = '/login';
}

export function isLoggedIn() {
  let email = localStorage.getItem('email');
  let access_token = localStorage.getItem('access_token');
  return email !== '' && access_token !== '';
}