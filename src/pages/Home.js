import { Redirect } from "react-router";
import { useEffect, useState } from "react";
import { fetchData } from "../utils/api";
import { useAuth } from "../context/auth";
import { endpoints, pageUrls } from "../utils/constants";
import { Overlay, Spinner } from "../components/Loading";
import BoardPreview from "../components/board/BoardPreview";
import Dashboard from "../components/Dashboard";
import Alerts from "../components/Alerts";
import useApi from "../hooks/useApi";

const BoardsDash = ({ boards }) => {
  // Destructure props
  const { loading, failed, data, msg } = boards;

  return (
    <>
      {loading && <Spinner />}
      {failed && <Alerts messages={msg} type="danger" />}
      {data &&
        (data.length > 0 ? (
          <ul>
            {data.map((board) => (
              <BoardPreview key={board._id} boardData={board} />
            ))}
          </ul>
        ) : (
          <p>You have not created any boards yet.</p>
        ))}
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
