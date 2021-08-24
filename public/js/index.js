import { login, logout } from './login';
import { showMap } from './mapbox';

const mapContainer = document.getElementById('map');
const form = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');

if (mapContainer) {
  const locations = JSON.parse(mapContainer.dataset.locations);
  showMap(locations);
}

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}
