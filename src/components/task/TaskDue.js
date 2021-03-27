import { DateTime } from "../../utils/helpers";

const TaskDue = ({ dueDate }) => {
  // Define variables
  let bg = "success";
  const now = new Date();
  const inMinutes = { day: 1440, hour: 60, halfHour: 30 };

  // Get the difference in minutes
  const diffInMinutes = DateTime.diffInDates(dueDate, now, "m");

  // Determine the color to display
  if (diffInMinutes >= inMinutes.day) {
  } else if (diffInMinutes >= inMinutes.hour) {
    bg = "warn";
  } else {
    bg = "danger";
  }

  return (
    <div className={`bg--${bg} text--white p--tiny brad m--y-1`}>
      <span className="d--block">
        Task due <strong>{DateTime.fromNow(dueDate)}</strong>
      </span>
      <span className="d--block text--italic">
        {DateTime.formatDate(dueDate, "MMM D, YYYY h:mm:ss A")}
      </span>
    </div>
  );
};

export default TaskDue;
