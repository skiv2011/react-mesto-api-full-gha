import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

export default function Card(props) {
  const card = props.card;
  const currentUser = React.useContext(CurrentUserContext);
  const isOwn = card.owner === currentUser._id;
  const isLiked = card.likes.some((i) => i === currentUser._id);
  const cardLikeButtonClassName = `element__button-like ${
    isLiked ? "element__button-like_active" : ""
  }`;

  function handleClick() {
    props.onCardClick(card);
  }

  function handleLikeClick() {
    props.onCardLike(card);
  }

  function handleDeleteClick() {
    props.onCardDelete(card);
  }

  return (
    <li className="element__card">
      {!isOwn || (
        <button
          className="element__button-delete"
          type="button"
          onClick={handleDeleteClick}
        ></button>
      )}
      <img
        className="element__image"
        src={props.card.link}
        alt={props.card.name}
        onClick={handleClick}
      />
      <div className="element__discription">
        <h2 className="element__subtitle">
          {props.card.name ?? "Картинка без названия"}
        </h2>
        <div className="element__like-container">
          <button
            aria-label="Лайк"
            className={cardLikeButtonClassName}
            type="button"
            onClick={handleLikeClick}
          ></button>
          <span className="element__like-count">{card.likes?.length ?? 0}</span>
        </div>
      </div>
    </li>
  );
}
