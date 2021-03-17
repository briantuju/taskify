import PropTypes from "prop-types";

// Custom non-dismissible alert component
const Alerts = ({ messages, type = "info", className = "" }) => {
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

Alerts.propTypes = { messages: PropTypes.any };

export default Alerts;
