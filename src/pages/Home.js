import { Link } from "react-router-dom";
import { Redirect } from "react-router";
import { useEffect, useState } from "react";
import { fetchData } from "../utils/api";
import { useAuth } from "../context/auth";
import { endpoints, pageUrls } from "../utils/constants";
import { Overlay, Spinner } from "../components/Loading";
import { hardRedirectLocation } from "../utils/helpers";
import BoardPreview from "../components/board/BoardPreview";
import BoardCreate from "../components/board/BoardCreate";
import Button from "../components/formik/Button";
import Dashboard from "../components/Dashboard";
import Alerts from "../components/Alerts";
import useApi from "../hooks/useApi";

const BoardsDash = ({ boards }) => {
  // Destructure props
  const { loading, failed, data, msg } = boards;

  // Component state
  const [showModal, setShowModal] = useState(false);
  const [newBoard, setNewBoard] = useState({
    data: null,
    failed: false,
    msg: null,
  });

  // Add a new Board
  const createBoard = async (values) => {
    if (data) data.msg = null; // Clear existing messages

    // Add new board and redirect to the new Boad page
    const { data: boardData, failed, msg, status } = await fetchData(
      endpoints.boards,
      values,
      "POST"
    );
    setNewBoard({ ...newBoard, failed, msg });

    if (status === 201) {
      hardRedirectLocation(`${pageUrls.board}/${boardData.data._id}`);
    }
  };

  return (
    <>
      {loading && <Spinner />}
      {failed && <Alerts messages={msg} type="danger" />}

      {data &&
        (data.length > 0 ? (
          <ul>
            {data.map((board, index) => {
              if (index >= 5) return null;

              return <BoardPreview key={board._id} boardData={board} />;
            })}

            {/* Show more boards link */}
            {data.length >= 5 && (
              <Link to={pageUrls.board} className="link">
                View all boards
              </Link>
            )}
          </ul>
        ) : (
          <p>You have not created any boards yet.</p>
        ))}

      {/* Add board button toggler */}
      <Button
        variant="info"
        onClick={() => setShowModal(!showModal)}
        className="m--y-1"
      >
        New Board
      </Button>

      {/* Create Board Modal */}
      {showModal === true && (
        <BoardCreate
          handleAddBoard={createBoard}
          message={newBoard.msg}
          toggleVisibility={setShowModal}
        />
      )}
    </>
  );
};

const Home = () => {
  // Get auth token
  const { authToken } = useAuth();

  // Boards states
  const [boards, setBoards] = useState({
    data: null,
    failed: false,
    msg: null,
    loading: true,
  });

  // Get account data
  const [{ error, loading, data, msg, status }] = useApi(endpoints.account.get);

  useEffect(() => {
    const getUserBoards = async () => {
      const { data, failed, msg } = await fetchData(endpoints.boards);

      setBoards((boards) => ({
        ...boards,
        data: data.data,
        failed,
        msg,
        loading: false,
      }));
    };

    // Get user boards and update boards state if account fetch was okay
    if (status === 200) getUserBoards();
  }, [status]);

  // Redirect to landing page if there's no auth token
  if (!authToken) return <Redirect to={pageUrls.landing} />;

  if (loading) return <Overlay />;

  if (error) {
    return (
      <div className="container p--2">
        <Alerts messages={msg} type="danger" />
      </div>
    );
  }

  return (
    <div className="p--y-1 container">
      <div className="flex">
        {/* Home Dash */}
        <div className="flex--1-of-3">
          <Dashboard data={data} />
        </div>

        {/* Boards List */}
        <div className="flex--1-of-3">
          <h3 className="m--y-1">Boards List</h3>
          <BoardsDash boards={boards} />
        </div>

        {/* Sidebar */}
        <div className="flex--1-of-3">
          <h3 className="m--y-1 p--tiny text--info bg--light brad">
            A feature is coming here soon
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Home;
