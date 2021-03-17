import { Link } from "react-router-dom";
import { pageUrls } from "../utils/constants";
import logo from "../logo.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__row flex">
          {/* Site footer description */}
          <div className="footer__col flex--1-of-3">
            {/* Logo */}
            <Link to={pageUrls.landing} className="footer__logo">
              <img src={logo} alt="Taskify logo" />
            </Link>

            {/* Summary */}
            <p className="footer__summary">
              An intuitive and powerful way to keep track of what's important
            </p>

            {/* Link */}
            <Link to={pageUrls.landing} className="footer__link">
              {/* Do something */}
            </Link>
          </div>

          {/* Quick links */}
          <div className="footer__col flex--1-of-3">
            {/* Subtitle */}
            <h3 className="footer__subtitle">Quick Links</h3>

            {/* Links */}
            <Link to={pageUrls.productPlans} className="footer__link">
              Product Plans
            </Link>
          </div>

          {/* Footer Social & Newsletter */}
          <div className="footer__col flex--1-of-3">
            {/* Subtitle */}
            <h3 className="footer__subtitle">Get in touch</h3>

            <a
              href="https://twitter.com/omondi_tuju"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__link"
            >
              Follow me on Twitter
            </a>

            <a href="mailto:briantuju@gmail.com" className="footer__link">
              Shoot me an email
            </a>
          </div>
        </div>

        {/* Copyright info */}
        <p className="footer__copyright">
          Website designed by
          <a
            href="https://github.com/briantuju"
            target="_blank"
            rel="noreferrer noopener"
          >
            {" "}
            Brian Tuju
          </a>
          . All rights reserved &copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
