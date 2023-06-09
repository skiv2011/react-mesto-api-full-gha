class Api {
  constructor({baseUrl}) {

    this._baseUrl = baseUrl;

  }

  _check(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Возникла ошибка: ${res.status}`);
  }

  getDataFromServer() {
    return Promise.all([this.getInitialCards(), this.getUserInfo()]);
  }

  getUserInfo() {
      return fetch(`${this._baseUrl}/users/me`, {
      credentials: "include",

    }).then((res) => {
      return this._check(res);
    });
  }

  editProfile(name, about) {
      return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "content-type": "application/json",
},
body: JSON.stringify({
        name: name,
        about: about,
      }),
    }).then((res) => {
      return this._check(res);
    });
  }

  getInitialCards() {

    return fetch(`${this._baseUrl}/cards`, {
      credentials: "include",

    }).then((res) => {
      return this._check(res);
    });
  }

  addCards({ title, link }) {
      return fetch(`${this._baseUrl}/cards`, {
      credentials: "include",
      method: "POST",
      headers: {
        "content-type": "application/json",

      },
      body: JSON.stringify({
        name: title,
        link: link,
      }),
    }).then((res) => this._check(res));
  }

  deleteCard(cardId) {
      return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      credentials: "include",
    }).then((res) => {
      return this._check(res);
    });
  }

  editAvatar(avatar) {

    return fetch(`${this._baseUrl}/users/me/avatar`, {
      credentials: "include",
      method: "PATCH",
      headers: {
        "content-type": "application/json",

      },

      body: JSON.stringify({
        avatar: avatar,
      }),
    }).then((res) => {
      return this._check(res);
    });
  }

  changeLikeCardStatus(cardId, usePut) {

    const method = usePut ? "PUT" : "DELETE";
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      credentials: "include",
      method: method,
      headers: {
        "content-type": "application/json",

      },

    }).then((res) => {
      return this._check(res);
    });
  }
}

const api = new Api({
  baseUrl: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  }
});
export default api;


