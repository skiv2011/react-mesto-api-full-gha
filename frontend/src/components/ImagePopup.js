const ImagePopup = (props) => {
  return (
    <div
      className={
        props.card.isOpen
          ? `popup popup_type_image popup_opened`
          : `popup popup_type_image`
      }
      onClick={props.onClose}
    >
      <div className="popup__container-img">
        <button
          aria-label="Закрыть"
          className="popup__close-button"
          type="button"
          onClick={props.onClose}
        ></button>
        <img
          className="popup__photo"
          src={props.card.link}
          alt={props.card.name}
        />
        <p className="popup__image-title">{props.card.name}</p>
      </div>
    </div>
  );
};

export default ImagePopup;
