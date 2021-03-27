import { Link } from "react-router-dom";
import { pageUrls } from "../../utils/constants";
import { DateTime, getDueColor } from "../../utils/helpers";

const TaskPreview = ({ taskData }) => {
  // Destructure data
  const { _id, title, fields } = taskData;
  const { dueDate } = fields;

  // Get color based on due date
  const color = getDueColor(dueDate);

  return (
    <div className="shadow--small p--1 m--y-1 border brad">
      <Link to={`${pageUrls.task}/${_id}`} className="d--block">
        {title}
      </Link>
      {dueDate && (
        <small
          className={`d--i-block m--y-tiny text--${color} bg--light p--tiny brad`}
        >
          <strong>Task due {DateTime.timeToX(dueDate)}</strong>
        </small>
      )}
    </div>
  );
};

export default TaskPreview;
