import PropTypes from "prop-types";
import { useState } from "react";
import { fetchData } from "../../utils/api";
import { endpoints } from "../../utils/constants";
import CommentCreate from "./CommentCreate";
import CommentList from "./CommentList";
import Button from "../formik/Button";
import Alerts from "../Alerts";

const Comment = ({ resourceId, resourceName }) => {
  // Component state
  const [state, setStae] = useState({
    data: null,
    error: false,
    msg: null,
    loading: false,
  });

  // Get comments for the resource provided
  const loadComments = async () => {
    setStae({ ...state, loading: true, error: false, msg: null });

    const { data, failed, msg } = await fetchData(
      `${endpoints.comments}?resourceId=${resourceId}`
    );

    if (failed) {
      return setStae({ ...state, error: true, loading: false, msg });
    }

    setStae({ ...state, data: data.data, loading: false });
  };

  if (state.error) {
    return (
      <div className="container p--2">
        <Alerts messages={state.msg} type="danger" />
      </div>
    );
  }

  return (
    <div className="p--1 shadow">
      <Button
        size="tiny"
        className="shadow--small"
        onClick={loadComments}
        isLoading={state.loading}
        disabled={state.data && state.data.length === 0}
      >
        {state.data && state.data.length > 0 ? "Load more " : "Load "}
        comments
      </Button>

      {state.data && state.data.length > 0 && (
        <CommentList commentData={state.data} reloadCb={loadComments} />
      )}

      <CommentCreate
        resourceId={resourceId}
        resourceName={resourceName}
        reloadCb={loadComments}
      />
    </div>
  );
};

Comment.propTypes = {
  resourceId: PropTypes.string.isRequired,
  resourceName: PropTypes.string.isRequired,
};

export default Comment;
