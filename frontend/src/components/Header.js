import logo from "../images/logo.svg";
import { Link } from "react-router-dom";

const Header = (props) => {
  return (
    <header className="header">
      <Link to="/">
        <img src={logo} alt="Логотип сайта" className="header__logo" />
      </Link>
      {props?.onLogout ? (
        <div className="header__userdata">
          <p className="header__email">{props.userEmail}</p>
          <button className="button header__link" onClick={props.onLogout}>
            Выйти
          </button>
        </div>
      ) : (
        <Link to={props.headerLink} className="header__link">
          {props.headerText}
        </Link>
      )}
    </header>
  );
};

export default Header;
