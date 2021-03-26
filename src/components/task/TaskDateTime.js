import { useState } from "react";
import PropTypes from "prop-types";
import { DateTime } from "../../utils/helpers";
import { InlineDateTime } from "../DateTime";
import ShowHide from "../ShowHide";
import Button from "../formik/Button";

const TaskDateTime = ({ dueDate }) => {
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(dueDate);

  const saveDueDate = async () => {
    alert("Save due date not implemented");
  };

  const removeDueDate = async () => {
    alert("Remove due date not implemented");
  };

  const handleDateChange = (date) => setDate(DateTime.toIsoString(date));

  return (
    <div className="m--y-1">
      {/* Toggler for showing/hiding DateTime component */}
      <ShowHide handleToggle={setShow} isExpanded={show} text="Due Date" />

      {show && (
        <div className="p--1 shadow">
          <InlineDateTime
            startDate={dueDate ? new Date(dueDate) : new Date()}
            onDateChange={handleDateChange}
            minDate={new Date()}
          />

          <div className="d--flex-around p--x-2 m--y-2">
            <Button
              variant="success"
              onClick={saveDueDate}
              disabled={date === dueDate}
            >
              Save
            </Button>

            <Button variant="danger" onClick={removeDueDate}>
              Remove
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

TaskDateTime.propTypes = {
  dueDate: PropTypes.string.isRequired,
};

export default TaskDateTime;
