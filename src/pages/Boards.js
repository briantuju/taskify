import { useState } from "react";
import { useParams } from "react-router";
import { endpoints, pageUrls } from "../utils/constants";
import { Overlay, Spinner } from "../components/Loading";
import { hardRedirectLocation } from "../utils/helpers";
import { fetchData } from "../utils/api";
import TaskCreateModal from "../components/task/TaskCreateModal";
import BoardItem from "../components/board/BoardItem";
import BoardList from "../components/board/BoardList";
import TaskList from "../components/task/TaskList";
import Button from "../components/formik/Button";
import Alerts from "../components/Alerts";
import useApi from "../hooks/useApi";

const TasksDash = ({ id }) => {
  // Component state
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    data: null,
    failed: false,
    msg: null,
  });

  // Get tasks data
  const [{ data, loading, error, msg }] = useApi(
    `${endpoints.tasks}?boardId=${id}`
  );

  // Add a new Task
  const createTask = async (values) => {
    if (data) data.msg = null; // Clear existing messages

    // Add new task and redirect to the new Task page
    const { data: taskData, failed, msg, status } = await fetchData(
      endpoints.tasks,
      values,
      "POST"
    );
    setNewTask({ ...newTask, failed, msg });

    if (status === 201) {
      hardRedirectLocation(`${pageUrls.task}/${taskData.data._id}`);
    }
  };

  return (
    <>
      {loading && <Spinner />}
      {error && <Alerts messages={msg} type="danger" />}

      {data &&
        (data.data.length > 0 ? (
          <TaskList tasksData={data.data} />
        ) : (
          <p>You have not created any tasks yet.</p>
        ))}

      {/* Add board button toggler */}
      <Button
        variant="info"
        onClick={() => setShowModal(!showModal)}
        className="m--y-1"
      >
        Add Task
      </Button>

      {/* Create Task Modal */}
      {showModal === true && (
        <TaskCreateModal
          handleAddTask={createTask}
          message={newTask.msg}
          id={id}
          toggleVisibility={setShowModal}
        />
      )}
    </>
  );
};

const Boards = () => {
  // Get board or boards data
  const [{ data, loading, error, msg }] = useApi(endpoints.boards);

  if (loading) return <Overlay />;

  return (
    <div className="p--y-1 container">
      {error && (
        <div className="container p--2">
          <Alerts messages={msg} type="danger" />
        </div>
      )}

      {data ? (
        <BoardList boardData={data.data} /> // Board List
      ) : null}
    </div>
  );
};

export const Board = () => {
  // Board id from params if provided
  const { id } = useParams();

  // Get board data
  const [{ data, loading, error, msg }] = useApi(`${endpoints.boards}/${id}`);

  if (loading) return <Overlay />;

  return (
    <div className="p--y-1 container">
      {error && (
        <div className="container p--2">
          <Alerts messages={msg} type="danger" />
        </div>
      )}

      {data ? (
        <div className="flex">
          {/* Board List */}
          <div className="flex--1-of-3">
            <BoardItem boardData={data.data} />
          </div>

          {/* Tasks Overview */}
          <div className="flex--1-of-3">
            <h3 className="m--y-1">Tasks in this Board</h3>

            {/* Show TasksDash component only if the board was loaded */}
            {data.success && <TasksDash id={id} />}
          </div>

          {/* Sidebar */}
          <div className="flex--1-of-3">
            <h3 className="m--y-1 p--tiny bg--light text--info">
              Watch this space!
            </h3>
            <small className="p--tiny text--success link">
              Something exciting is coming soon!
            </small>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Boards;
