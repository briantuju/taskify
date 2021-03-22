import { useParams } from "react-router";
import { endpoints } from "../utils/constants";
import { Overlay } from "../components/Loading";
import BoardItem from "../components/board/BoardItem";
import BoardList from "../components/board/BoardList";
import Alerts from "../components/Alerts";
import useApi from "../hooks/useApi";

const Boards = () => {
  // Board id from params if provided
  const { id } = useParams();

  // Get board or boards data
  const [{ data, loading, error, msg }] = useApi(
    id ? `${endpoints.boards}/${id}` : `${endpoints.boards}`
  );

  if (loading) return <Overlay />;

  return (
    <div className="p--y-1 container">
      {error && (
        <div className="container p--2">
          <Alerts messages={msg} type="danger" />
        </div>
      )}

      {id && data ? (
        <BoardItem boardData={data.data} /> // Board Item
      ) : data ? (
        <BoardList data={data.data} /> // Board List
      ) : null}
    </div>
  );
};

export default Boards;
