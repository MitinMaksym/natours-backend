import axios from 'axios';
import { showAlert } from './alerts';
import '@babel/polyfill';

export const login = async (email, password) => {
  try {
    const res = await axios.post(
      'http://127.0.0.1:3000/api/v1/users/login',

      {
        email,
        password,
      },
      { withCredentials: true }
    );

    if (res.data.status === 'success') {
      showAlert('success', 'You logged in successfully!');
      location.assign('/');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
