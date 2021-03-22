import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { pageUrls } from "../../utils/constants";

const TaskList = ({ tasksData }) => {
  if (tasksData.length === 0) return <p>You have not created any tasks yet</p>;

  return (
    <ul className="m--y-1">
      {tasksData.map(({ _id, title }) => (
        <li key={_id} className="shadow--small p--1 m--y-1 outline">
          <Link to={`${pageUrls.task}/${_id}`}>{title}</Link>
        </li>
      ))}
    </ul>
  );
};

TaskList.propTypes = {
  tasksData: PropTypes.array.isRequired,
};

export default TaskList;
