import BoardItem from "./BoardItem";
import PropTypes from "prop-types";

const BoardList = ({ data }) => {
  if (data.length === 0) return <p>You have not created any boards yet</p>;

  return (
    <>
      <h3 className="h3">You Boards</h3>

      <ul>
        {data.map((board) => (
          <BoardItem key={board._id} boardData={board} />
        ))}
      </ul>
    </>
  );
};

BoardList.propTypes = {
  data: PropTypes.array.isRequired,
};

export default BoardList;
