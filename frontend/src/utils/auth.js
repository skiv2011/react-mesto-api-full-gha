// export const BASE_URL = 'http://localhost:3000';
export const BASE_URL ='http://api.firemandzen.nomoredomains.monster';

const check= (res) => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  export const register = (email, password) => {
    return fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    }).then(check);
  };

  export const login = (email, password) => {
    return fetch(`${BASE_URL}/signin`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    }).then(check)
    .then((data) => {
      localStorage.setItem('userId', data._id)
      return data;
    })
  };

  export const tokenCheck = (token) => {

    return fetch(`${BASE_URL}/users/me`, {
      credentials: "include",
      method: "GET",
      headers: {
        Accept: "application/json",
        'Content-Type': 'application/json',

      },

    }).then(check);
  };

