import { showAlert } from './alerts';
import axios from 'axios';

export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://127.0.0.1:3003/api/v1/users/updatePassword'
        : 'http://127.0.0.1:3003/api/v1/users/updateMe';

    const res = await axios.patch(url, data, { withCredentials: true });
    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} was updated successfully`);
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};
