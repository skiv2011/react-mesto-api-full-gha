import React from "react";
import Card from "./Card";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import Header from "./Header";

const Main = (props) => {
  const currentUser = React.useContext(CurrentUserContext);

  const handleLogout = () => {
    props.onLogout();
  };

  return (
    <>
      <Header
        headerText={props.headerText}
        headerLink={props.headerLink}
        onLogout={handleLogout}
        userEmail={props.userEmail}
      />
      <main className="main">
        <section className="profile">
          <div className="profile__user">
            <div className="profile__avatar" onClick={props.onEditAvatar}>
              <img
                className="profile__avatar-img"
                src={currentUser.avatar}
                alt="фото пользователя"
              />
            </div>
            <div className="profile__info">
              <h1 className="profile__title">{currentUser.name}</h1>
              <button
                aria-label="Редактировать"
                className="profile__edit-button"
                onClick={props.onEditProfile}
                type="button"
              ></button>
              <p className="profile__subtitle">{currentUser.about}</p>
            </div>
          </div>
          <button
            aria-label="Добавить"
            className="profile__add-button"
            type="button"
            onClick={props.onAddPlace}
          ></button>
        </section>

        <section className="elements">
          <ul className="element">
            {props.cards.map((card) => (
              <Card
                card={card}
                key={card._id}
                onCardClick={props.onCardClick}
                onCardLike={props.onCardLike}
                onCardDelete={props.onCardDelete}
              />
            ))}
          </ul>
        </section>
      </main>
    </>
  );
};

export default Main;
