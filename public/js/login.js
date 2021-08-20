const login = async (email, password) => {
  try {
    const res = await axios.post(
      'http://127.0.0.1:3003/api/v1/users/login',

      {
        email,
        password,
      },
      { withCredentials: true }
    );
  } catch (err) {
    console.log(err.response.data);
  }
};

const form = document.querySelector('.form');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
});
