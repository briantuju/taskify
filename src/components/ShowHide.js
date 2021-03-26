import PropTypes from "prop-types";

const ShowHide = ({ isExpanded, handleToggle, text }) => {
  // Handle setting the expanded state to true or false
  const toggleIsExpanded = () => {
    if (isExpanded === true) return handleToggle(false);
    return handleToggle(true);
  };

  return (
    <span
      className={"d--i-block brad bg--light m--y-tiny click--cursor"}
      onClick={toggleIsExpanded}
    >
      <small className="m--x-tiny text--bold">
        {isExpanded ? `Hide ${text ? text : ""}` : `Show ${text ? text : ""}`}
      </small>
    </span>
  );
};

ShowHide.propTypes = {
  isExpanded: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
};

export default ShowHide;
