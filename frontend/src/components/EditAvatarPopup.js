import React from "react";
import PopupWithForm from "./PopupWithForm";

export default function EditAvatarPopup(props) {
  const avatarRef = React.useRef();

  function handleSubmit(e) {
    e.preventDefault();
    props.onUpdateAvatar({
      avatar: avatarRef.current.value,
    });
  }

  React.useEffect(() => {
    avatarRef.current.value = "";
  }, [props.onClose]);

  return (
    <PopupWithForm
      title="Обновить аватар"
      name="avatar"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      buttonTitle="Сохранить"
    >
      <fieldset className="popup__field">
        <input
          type="url"
          className="popup__decription popup__decription_type_link"
          ref={avatarRef}
          name="avatar"
          id="input-avatar"
          placeholder="Ссылка на аватар"
          required
        />
        <span className="popup__error" id="input-avatar-error"></span>
      </fieldset>
    </PopupWithForm>
  );
}
