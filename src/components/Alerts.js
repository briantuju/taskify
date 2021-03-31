import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Icon from "./Icon";

// Custom non-dismissible alert component
export const Alert = ({ messages, type = "info", className = "" }) => {
  if (!Array.isArray(messages)) {
    messages = messages.split();
  }

  return (
    <div className={`outline m--y-1 alert text--${type} ${className}`}>
      <ul>
        {messages.map((msg) => (
          <li key={Date.now() + Math.random()}>{msg}</li>
        ))}
      </ul>
    </div>
  );
};

// Custom dismissible alert component
export const AlertDismissible = ({ message, type = "info", delay = 15000 }) => {
  // Component state
  const [show, setShow] = useState(true);

  // Handler for dismissing alert
  const dismissAlert = () => setShow(false);

  // Handle timer inside a useeffect hook
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
      <Icon
        name="close-circle-outline"
        tabIndex="0"
        handleClick={dismissAlert}
        className="close-alert"
      />

      <span className="m--x-1">{message}</span>
    </p>
  );
};

Alert.propTypes = { messages: PropTypes.any };
AlertDismissible.propTypes = { message: PropTypes.string.isRequired };
