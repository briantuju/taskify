import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Alert, AlertDismissible } from "../Alerts";
import { fetchData } from "../../utils/api";
import { InlineDateTime } from "../DateTime";
import { DateTime } from "../../utils/helpers";
import { endpoints } from "../../utils/constants";
import Button from "../formik/Button";
import ShowHide from "../ShowHide";
import TaskDue from "./TaskDue";

const TaskDateTime = ({ data }) => {
  // Destructure data
  const { dueDate, id, title, description, boardId } = data;

  // Component states
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(dueDate);
  const [state, setState] = useState({
    error: false,
    msg: null,
    loading: false,
  });

  // We use timeout to clear the persistent state.msg
  useEffect(() => {
    let timer;
    if (!state.error && state.msg) {
      timer = setTimeout(() => setState({ ...state, msg: null }), 2500);
    }

    return () => {
      clearTimeout(timer);
    };
  });

  // Api fetch to save this task's due date
  const saveDueDate = async () => {
    setState({ ...state, loading: true, error: null, msg: null });

    // Set due date to now if it's not set by user
    let due = date.length === 0 ? DateTime.toIsoString(new Date()) : date;

    // Save to database
    const { data: updateData, failed, msg } = await fetchData(
      `${endpoints.tasks}/${id}`,
      { title, description, boardId, "fields.dueDate": due },
      "PUT"
    );

    if (failed) {
      return setState({ ...state, loading: false, error: true, msg });
    }
    setState({ ...state, loading: false, msg: "Due date saved " });
    setDate(updateData.data.fields.dueDate);
  };

  // Api fetch to remove this task's due date
  const removeDueDate = async () => {
    setState({ ...state, loading: true, error: null, msg: null });

    // Reset the due date to null and update date state to now
    const { failed, msg } = await fetchData(
      `${endpoints.tasks}/${id}`,
      { title, description, boardId, "fields.dueDate": null },
      "PUT"
    );
    if (failed) {
      return setState({ ...state, loading: false, error: true, msg });
    }
    setState({ ...state, loading: false, msg: "Due date removed" });
    setDate(DateTime.toIsoString(new Date()));
  };

  const handleDateChange = (date) => setDate(DateTime.toIsoString(date));

  return (
    <div className="m--y-1">
      {/* Toggler for showing/hiding DateTime component */}
      <ShowHide handleToggle={setShow} isExpanded={show} text="Due Date" />

      {show && (
        <div className="p--1 shadow">
          {date.length > 0 && <TaskDue dueDate={date} />}

          <InlineDateTime
            startDate={date ? new Date(date) : new Date()}
            onDateChange={handleDateChange}
            todayButton="Today"
            className="shadow"
          />

          {state.error && state.msg && (
            <div className="m--y-1">
              <Alert messages={state.msg} type="danger" />
            </div>
          )}
          {!state.error && state.msg && (
            <div className="m--y-1">
              <AlertDismissible message={state.msg} type="success" />
            </div>
          )}

          <div className="d--flex-around m--y-2">
            <Button
              variant="success"
              onClick={saveDueDate}
              disabled={date === dueDate || state.loading}
            >
              Save
            </Button>

            <Button
              variant="danger"
              onClick={removeDueDate}
              disabled={state.loading}
            >
              Remove
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

TaskDateTime.propTypes = {
  data: PropTypes.object.isRequired,
};

export default TaskDateTime;
