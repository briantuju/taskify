import { Link } from "react-router-dom";
import { useAuth } from "../context/auth";
import { AppStorage } from "../utils/helpers";
import { pageUrls } from "../utils/constants";
import logo from "../logo.png";

const Header = () => {
  const { authToken, setAuthToken } = useAuth();

  const handleLogout = () => {
    AppStorage.removeAuthToken();
    setAuthToken(null);
  };

  return (
    <>
      <header className="header">
        {/* Navigation */}
        <nav className="nav container">
          {/* Nav Brand */}
          <Link to={pageUrls.landing} className="nav__brand">
            <img src={logo} alt="Taskify logo" />
          </Link>

          {/* Nav Toggler and Icon*/}
          <input className="nav__toggler" type="checkbox" id="nav__toggler" />
          <label className="nav__icon--label" htmlFor="nav__toggler">
            <span className="nav__icon--span"></span>
          </label>

          {/* Nav List */}
          <ul className="nav__list">
            {authToken ? (
              <>
                <li className="nav__item">
                  <Link className="nav__link" to={pageUrls.account}>
                    Account
                  </Link>
                </li>
                <li className="nav__item">
                  <Link className="nav__link" to="" onClick={handleLogout}>
                    Logout
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav__item">
                  <Link className="nav__link" to={pageUrls.signup}>
                    Signup
                  </Link>
                </li>
                <li className="nav__item">
                  <Link className="nav__link" to={pageUrls.login}>
                    Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>
    </>
  );
};

export default Header;
