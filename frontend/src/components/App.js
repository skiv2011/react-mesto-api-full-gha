import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import "../index.css";
import Main from "./Main";
import Footer from "./Footer";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ImagePopup from "./ImagePopup";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./Login";
import Register from "./Register";
import InfoToolTip from "./InfoTooltip";
import api from "../utils/api.js";
import * as auth from "../utils/auth";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function App() {
  const history = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [isInfoToolOpen, setisInfoToolOpen] = useState(false);
  const [isInfoToolSuccess, setIsInfoToolSuccess] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({
    isOpen: false,
    link: "#",
    name: "#",
  });
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);


  useEffect(() => {
    if (loggedIn){
      Promise.all([api.getUserInfo(), api.getInitialCards()])
      .then(([user, initialCards]) => {
        setCurrentUser(user);
        setCards(initialCards);
      })
      .catch((err) =>
        console.log(err))
    }

}, [loggedIn]);

useEffect(() => {
  auth
    .tokenCheck()
    .then(({ email }) => {
      setLoggedIn(true);
      history('/');
      setUserEmail(email)
    })
    .catch((err) => {
      console.log(err);
    });
}, []);


  useEffect(() => {
    const handleEscClose = (evt) => {
      if (evt.key === "Escape") {
        closeAllPopups();
      }
    };
    if (
      isEditProfilePopupOpen ||
      isAddPlacePopupOpen ||
      isEditAvatarPopupOpen ||
      isInfoToolOpen ||
      selectedCard.isOpen
    ) {
      document.addEventListener("keydown", handleEscClose);
    } else {
      document.removeEventListener("keydown", handleEscClose);
    }
    return () => {
      document.removeEventListener("keydown", handleEscClose);
    };
  }, [
    isEditProfilePopupOpen,
    isAddPlacePopupOpen,
    isEditAvatarPopupOpen,
    isInfoToolOpen,
    selectedCard.isOpen,
  ]);


  function handleLogin(email, password) {
    auth
      .login(email, password)
      .then(() => {
        setUserEmail(email);
        setLoggedIn(true);
        history('/');
      })
      .catch(() => {
        setIsInfoToolSuccess(false);
        setisInfoToolOpen(true);
        setTimeout(() => {
          setisInfoToolOpen(false);
        }, 2500);
      });
  }

  function handleRegister(email, password) {
    auth
      .register(email, password)
      .then(() => {
        setIsInfoToolSuccess(true);
        setisInfoToolOpen(true);
        setTimeout(() => {
          history("/");
          setisInfoToolOpen(false);
        }, 2500);
      })
      .catch(() => {
        setIsInfoToolSuccess(false);
        setisInfoToolOpen(true);
        setTimeout(() => {
          setisInfoToolOpen(false);
        }, 2500);
      });
  }

  function handleLogout() {
    auth.logout()
    .then(() => {
    setLoggedIn(false);
    history("/signin");
  })
  .catch((err) => console.log(err))
  };


  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i === currentUser._id);
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) =>
          state.filter((c) => {
            return c !== card;
          })
        );
      })
      .catch((error) => console.log(error));
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard({ isOpen: true, link: card.link, name: card.name });
  }

  function closeAllPopups(evt) {
    setIsAddPlacePopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectedCard({ isOpen: false, link: "#", name: "#" });
    setisInfoToolOpen(false);
  }

  function handleUpdateUser({ name, about }) {
    api
      .editProfile(name, about)
      .then((result) => {
        setCurrentUser(result);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateAvatar({ avatar }) {
    api
      .editAvatar(avatar)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleAddPlaceSubmit(title, link) {
    api
      .addCards(title, link)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }


  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Routes>
          <Route
            path="/signup"
            element={
              <Register
                onRegister={handleRegister}
                headerText="Войти"
                headerLink="/signin"
                loggedIn={loggedIn}
                isInfoToolOpen={isInfoToolOpen}
                onClose={closeAllPopups}
              />
            }
          />
          <Route
            path="/signin"
            element={
              <Login
                onLogin={handleLogin}
                headerLink="/signup"
                headerText="Регистрация"
                isInfoToolOpen={isInfoToolOpen}
                onClose={closeAllPopups}
              />
            }
          />
          <Route element={<ProtectedRoute loggedIn={loggedIn} />}>
            <Route
              exact
              path="/"
              element={
                <Main
                  loggedIn={loggedIn}
                  onEditProfile={handleEditProfileClick}
                  onEditAvatar={handleEditAvatarClick}
                  onAddPlace={handleAddPlaceClick}
                  onCardClick={handleCardClick}
                  cards={cards}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}
                  onLogout={handleLogout}
                  userEmail={userEmail}
                />
              }
            />
          </Route>

          <Route
            path="*"
            element={
              loggedIn ? <Navigate to="/" /> : <Navigate to="/signin" />
            }
          />
        </Routes>
        <Footer />
        <InfoToolTip
          isOpen={isInfoToolOpen}
          onClose={closeAllPopups}
          success={isInfoToolSuccess}
        />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
