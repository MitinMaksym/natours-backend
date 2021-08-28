import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { showMap } from './mapbox';

const mapContainer = document.getElementById('map');
const form = document.querySelector('.form--login');
const updateDataForm = document.querySelector('.form-user-data');
const updatePasswordForm = document.querySelector('.form-user-password');
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
if (updateDataForm) {
  updateDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'data');
  });
}

if (updatePasswordForm) {
  updatePasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const savePasswordBtn = document.querySelector('.btn--save-password');
    savePasswordBtn.textContent = 'Updating password...';
    const currentPassword = document.getElementById('password-current');
    const password = document.getElementById('password');
    const passwordConfirm = document.getElementById('password-confirm');
    await updateSettings(
      {
        currentPassword: currentPassword.value,
        password: password.value,
        passwordConfirm: passwordConfirm.value,
      },
      'password'
    );
    passwordConfirm.value = '';
    password.value = '';
    passwordConfirm.value = '';
    savePasswordBtn.textContent = 'Save password';
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}
