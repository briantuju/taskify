import PropTypes from "prop-types";
import DatePicker from "react-datepicker";

// We MUST bring in the CSS too
import "react-datepicker/dist/react-datepicker.css";

export const InlineDateTime = ({
  startDate,
  onDateChange,
  className,
  ...props
}) => {
  return (
    <DatePicker
      selected={startDate}
      onChange={(date) => onDateChange(date)}
      dateFormat="MM/dd/yyyy h:mm"
      inline
      showTimeInput
      className={`${className ? className : ""}`}
      {...props}
    />
  );
};

InlineDateTime.propTypes = {
  onDateChange: PropTypes.func,
};
