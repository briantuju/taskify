import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const AlertDismissible = ({ message, type = "info", delay = 15000 }) => {
  const [show, setShow] = useState(true);

  const dismissAlert = () => setShow(false);

  useEffect(() => {
    let timer;

    timer = setTimeout(() => setShow(false), delay);

    return () => {
      clearTimeout(timer);
    };
  });

  // If show is false return null
  if (show !== true) return null;

  return (
    <p className={`alert--dismissible text--${type}`}>
      <span className="close-alert" tabIndex="0" onClick={dismissAlert}>
        <i className="far fa-times-circle"></i>
      </span>
      <span className="m--x-1">{message}</span>
    </p>
  );
};

AlertDismissible.propTypes = { message: PropTypes.string.isRequired };

export default AlertDismissible;
