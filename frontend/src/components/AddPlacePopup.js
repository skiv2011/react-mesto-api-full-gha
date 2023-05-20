import React from "react";
import PopupWithForm from "./PopupWithForm";

export default function AddPlacePopup(props) {
  const [title, setTitle] = React.useState("");
  const [link, setLink] = React.useState("");

  React.useEffect(() => {
    setTitle("");
    setLink("");
  }, [props.isOpen]);

  function handleChangeName(e) {
    setTitle(e.target.value);
  }

  function handleChangeLink(e) {
    setLink(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    props.onAddPlace({ title, link });
  }

  return (
    <PopupWithForm
      title="Новое место"
      name="card"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      buttonTitle="Создать"
    >
      <fieldset className="popup__field">
        <input
          type="text"
          className="popup__decription popup__decription_type_title"
          name="name"
          id="input-title"
          placeholder="Название"
          value={title || ""}
          onChange={handleChangeName}
          minLength="2"
          maxLength="30"
          required
        />
        <span className="popup__error" id="input-title-error"></span>
        <input
          type="url"
          className="popup__decription popup__decription_type_link"
          name="link"
          id="input-link"
          placeholder="Ссылка на картинку"
          value={link || ""}
          onChange={handleChangeLink}
          required
        />
        <span className="popup__error" id="input-link-error"></span>
      </fieldset>
    </PopupWithForm>
  );
}
