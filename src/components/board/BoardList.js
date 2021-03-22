import PropTypes from "prop-types";
import BoardPreview from "./BoardPreview";

const BoardList = ({ boardData }) => {
  if (boardData.length === 0) return <p>You have not created any boards yet</p>;

  return (
    <>
      <h3 className="h3 m--y-1">Your Boards</h3>

      <ul className="flex">
        {boardData.map((board) => (
          <BoardPreview key={board._id} boardData={board} />
        ))}
      </ul>
    </>
  );
};

BoardList.propTypes = {
  boardData: PropTypes.array.isRequired,
};

export default BoardList;
