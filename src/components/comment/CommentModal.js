import PropTypes from "prop-types";
import { useState } from "react";
import { Form, Formik } from "formik";
import { fetchData } from "../../utils/api";
import { endpoints } from "../../utils/constants";
import schemas, { objSchema } from "../../utils/schemas";
import TextAreaInput from "../formik/TextAreaInput";
import ReactModal from "../ReactModal";
import Button from "../formik/Button";
import Alerts from "../Alerts";

const updateComment = async (values, commentId, setState) => {
  // Loading state is handled by formik.isSubmitting
  setState((state) => ({ ...state, error: false, msg: null }));

  const { failed, msg, data } = await fetchData(
    `${endpoints.comments}/${commentId}`,
    values,
    "PUT"
  );
  if (failed) return setState((state) => ({ ...state, error: true, msg }));
  return data.data;
};

const deleteComment = async (commentId, values, setState, refresh) => {
  if (window.confirm("Delete this comment?")) {
    const { toggle, reloadCb } = refresh;
    setState((state) => ({ ...state, error: false, msg: null, loading: true }));

    const { failed, msg } = await fetchData(
      `${endpoints.comments}/${commentId}`,
      values,
      "DELETE"
    );

    if (failed) {
      setState((state) => ({ ...state, error: true, msg, loading: false }));
      return;
    }
    setState((state) => ({ ...state, loading: false, msg }));
    toggle();
    reloadCb();
  }
};

const CommentModal = ({ toggle, initValues, reloadCb }) => {
  // Destructure data
  const { resourceId, resourceName, body, _id } = initValues;

  // Component state
  const [state, setState] = useState({
    error: false,
    msg: null,
    loading: false,
  });

  return (
    <ReactModal toggleVisibility={toggle}>
      <Formik
        initialValues={{ resourceId, resourceName, body }}
        validationSchema={objSchema({ body: schemas.commentBody })}
        onSubmit={async (values) => {
          const data = await updateComment(values, _id, setState);
          // Handle toggle and reload
          if (data) {
            toggle();
            reloadCb();
          }
        }}
      >
        {(formik) => (
          <Form className="form" onSubmit={formik.handleSubmit}>
            <input type="hidden" name="resourceId" />
            <input type="hidden" name="resourceName" />

            <TextAreaInput name="body" placeholder="Type a comment here..." />

            {state.error && <Alerts messages={state.msg} type="danger" />}
            {!state.error && state.msg && <Alerts messages={state.msg} />}

            <div>
              {/* Update comment button */}
              <Button
                type="submit"
                variant="success"
                disabled={!(formik.isValid && formik.dirty)}
                isLoading={formik.isSubmitting}
              >
                Update
              </Button>

              {/* Delete comment button */}
              <Button
                variant="danger"
                className="m--x-2"
                onClick={() => {
                  deleteComment(_id, formik.values, setState, {
                    toggle,
                    reloadCb,
                  });
                }}
                isLoading={state.loading}
                disabled={formik.isSubmitting}
              >
                Delete
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </ReactModal>
  );
};

CommentModal.propTypes = {
  toggle: PropTypes.func.isRequired,
  reloadCb: PropTypes.func.isRequired,
  initValues: PropTypes.object.isRequired,
};

export default CommentModal;
