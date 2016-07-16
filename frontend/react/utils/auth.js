export function logout() {
  localStorage.removeItem('email');
  localStorage.removeItem('access_token');
  window.location = '/login';
}