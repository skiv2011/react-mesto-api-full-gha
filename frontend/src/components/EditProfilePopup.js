import React from "react";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

export default function EditProfilePopup(props) {
  const currentUser = React.useContext(CurrentUserContext);
  const [name, setName] = React.useState(currentUser.name);
  const [description, setDescription] = React.useState(currentUser.about);

  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, props.isOpen]);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleDescriptionChange(e) {
    setDescription(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    props.onUpdateUser({
      name,
      about: description,
    });
  }

  return (
    <PopupWithForm
      title="Редактировать профиль"
      name="edit"
      buttonTitle="Сохранить"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
    >
      <fieldset className="popup__field">
        <input
          type="text"
          className="popup__decription popup__decription_type_name"
          name="name"
          value={name || ""}
          onChange={handleNameChange}
          placeholder="имя"
          minLength="2"
          maxLength="40"
          required
        />
        <span className="popup__error" id="input-name-error"></span>
        <input
          type="text"
          className="popup__decription popup__decription_type_job"
          name="job"
          value={description || ""}
          onChange={handleDescriptionChange}
          placeholder="о себе"
          minLength="2"
          maxLength="200"
          required
        />
        <span className="popup__error" id="input-job-error"></span>
      </fieldset>
    </PopupWithForm>
  );
}
