import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { pageUrls } from "../../utils/constants";
import { DateTime } from "../../utils/helpers";

const BoardPreview = ({ boardData }) => {
  // Destructure required data for board preview
  const { _id, title, createdAt, tasks } = boardData;

  return (
    <li className="outline p--tiny m--y-1 bg--light">
      <h3>
        <Link to={pageUrls.board + "/" + _id}>{title}</Link>
      </h3>

      <small className="d--i-block">
        Created <strong>{DateTime.fromNow(createdAt)}</strong>
      </small>
      <small className="m--x-1 text--info">
        <strong> {tasks.count}</strong> tasks
      </small>
    </li>
  );
};

BoardPreview.propTypes = {
  boardData: PropTypes.object.isRequired,
};

export default BoardPreview;
