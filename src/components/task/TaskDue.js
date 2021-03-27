import { DateTime, getDueColor } from "../../utils/helpers";

const TaskDue = ({ dueDate }) => {
  const bg = getDueColor(dueDate);

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
