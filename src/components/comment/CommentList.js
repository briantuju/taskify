import PropTypes from "prop-types";
import { useState } from "react";
import { DateTime } from "../../utils/helpers";
import CommentModal from "./CommentModal";

const CommentList = ({ commentData, reloadCb }) => {
  // Component state
  const [showModal, setModalShow] = useState(false);
  const [comment, setComment] = useState({
    resourceId: null,
    resourceName: null,
    body: null,
    _id: null,
  });

  if (commentData.length === 0) {
    return <p className="p--tiny">No comments found</p>;
  }

  const showCommentModal = async (comment) => {
    // Destructure data, update state and toggle modal display
    const { resource, body, _id } = comment;
    setComment({
      ...comment,
      resourceId: resource.id,
      resourceName: resource.name,
      _id,
      body,
    });
    setModalShow(!showModal);
  };

  return (
    <>
      <ul>
        {commentData.map((com) => (
          <li key={com._id} className="p--tiny">
            <span
              className="p--y-1 d--block"
              onClick={() => showCommentModal(com)}
            >
              {com.body}
            </span>

            <span>Added {DateTime.fromNow(com.createdAt)}</span>
          </li>
        ))}
      </ul>

      {showModal && (
        <CommentModal
          toggle={setModalShow}
          reloadCb={reloadCb}
          initValues={{
            body: comment.body,
            resourceId: comment.resourceId,
            resourceName: comment.resourceName,
            _id: comment._id,
          }}
        />
      )}
    </>
  );
};

CommentList.propTypes = {
  commentData: PropTypes.array.isRequired,
  reloadCb: PropTypes.func.isRequired,
};

export default CommentList;
