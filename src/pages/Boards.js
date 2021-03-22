import { useParams } from "react-router";
import { endpoints } from "../utils/constants";
import { Overlay } from "../components/Loading";
import BoardItem from "../components/board/BoardItem";
import BoardList from "../components/board/BoardList";
import Alerts from "../components/Alerts";
import useApi from "../hooks/useApi";

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
        <BoardItem boardData={data.data} /> // Board List
      ) : null}
    </div>
  );
};

export default Boards;
