import { useState } from "react";
import { useParams } from "react-router-dom";
import { Overlay } from "../components/Loading";
import { endpoints } from "../utils/constants";
import TaskItem from "../components/task/TaskItem";
import ShowHide from "../components/ShowHide";
import Alerts from "../components/Alerts";
import useApi from "../hooks/useApi";

const TaskActions = () => {
  const [showActivity, setShowActivity] = useState(false);

  return (
    <div>
      <ShowHide
        handleToggle={setShowActivity}
        isExpanded={showActivity}
        text="Task Actions"
      />

      {showActivity && (
        <div className="p--tiny text--italic m--y-1 brad bg--light">
          <strong className="d--block">To be implemented: </strong>
          <ul>
            <li>Due date</li>
            <li>Sharing task</li>
            <li>Add board members to this task</li>
            <li>Move task to another board</li>
            <li>Task attachments</li>
          </ul>
        </div>
      )}
    </div>
  );
};

const Tasks = () => {
  // Get id from the params
  const { id } = useParams();

  // Fetch API data
  const [{ loading, error, data, msg }] = useApi(`${endpoints.tasks}/${id}`);

  if (loading) return <Overlay />;

  return (
    <div className="p--y-2 container">
      {error && (
        <div className="container p--2">
          <Alerts messages={msg} type="danger" />
        </div>
      )}

      {data && data.data && (
        <div className="flex">
          {/* Task Details */}
          <div className="flex--1-of-3">
            <TaskItem taskData={data.data} />
          </div>

          {/* Task Actions */}
          <div className="flex--2-of-3">
            <TaskActions />
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
