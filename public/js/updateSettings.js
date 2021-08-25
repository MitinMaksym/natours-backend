import { showAlert } from './alerts';
import axios from 'axios';

export const updateData = async (dataObj) => {
  try {
    const res = await axios.patch(
      'http://127.0.0.1:3003/api/v1/users/updateMe',
      dataObj,

      { withCredentials: true }
    );
    if (res.data.status === 'success') {
      showAlert('success', 'The data was updated successfylly');
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};
