import { login } from './login';
import { showMap } from './mapbox';

const mapContainer = document.getElementById('map');

if (mapContainer) {
  const locations = JSON.parse(mapContainer.dataset.locations);
  showMap(locations);
}

const form = document.querySelector('.form');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}
