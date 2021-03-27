import PropTypes from "prop-types";
import { Image, Transformation } from "cloudinary-react";
import { DateTime } from "../../utils/helpers";
import { api } from "../../utils/constants";
import Icon from "../Icon";

const CommentItem = ({ commentData, onEllipsisClick }) => {
  // Destructure data
  const { user, body, createdAt } = commentData;
  const {
    avatar: { public_id },
    name,
  } = user;

  return (
    <div className="comment">
      {/* Comment user avatar */}
      <div className="comment__block-left">
        <Image
          cloudName={api.cloudinaryName}
          publicId={public_id}
          className="img--avatar click--cursor"
          alt={`${name.first}'s avatar`}
          height="40"
          width="40"
        >
          <Transformation gravity="faces" quality="auto" />
        </Image>
      </div>

      {/* Comment details */}
      <div className="comment__block-right">
        <span className="comment__user-name">
          {name.first}
          {name.last ? ` ${name.last}` : ""}
        </span>
        <span
          className="comment__ellipsis"
          onClick={() => onEllipsisClick(commentData)}
          title="Click to edit or delete comment"
        >
          <Icon name="ellipsis-horizontal-outline" />
        </span>
        <span className="comment__body">{body}</span>
        <small className="comment__date">
          {DateTime.formatDate(createdAt, "MMM D, YYYY h:mm")} (
          {DateTime.fromNow(createdAt)})
        </small>
      </div>
    </div>
  );
};

CommentItem.propTypes = {
  commentData: PropTypes.object.isRequired,
  onEllipsisClick: PropTypes.func.isRequired,
};

export default CommentItem;
