import PropTypes from "prop-types";
import TaskPreview from "./TaskPreview";

const TaskList = ({ tasksData }) => {
  if (tasksData.length === 0) return <p>You have not created any tasks yet</p>;

  return (
    <ul className="m--y-1">
      {tasksData.map((task) => (
        <li key={task._id}>
          <TaskPreview taskData={task} />
        </li>
      ))}
    </ul>
  );
};

TaskList.propTypes = {
  tasksData: PropTypes.array.isRequired,
};

export default TaskList;
