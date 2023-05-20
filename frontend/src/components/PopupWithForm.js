import React from "react";
const PopupWithForm = (props) => {
  return (
    <section
      className={`popup popup__type_${props.name} ${
        props.isOpen ? "popup_opened" : ""
      }`}
    >
      <div className="popup__container">
        <button
          type="button"
          aria-label="закрыть"
          className="popup__close-button"
          onClick={props.onClose}
        ></button>
        <h2 className="popup__title">{props.title}</h2>
        <form
          className="popup__form"
          name={props.name}
          onSubmit={props.onSubmit}
          noValidate
        >
          {props.children}
          <button type="submit" className="popup__submit-button">
            {props.buttonTitle}
          </button>
        </form>
      </div>
    </section>
  );
};
export default PopupWithForm;
