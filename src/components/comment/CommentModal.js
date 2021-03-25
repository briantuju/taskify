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

// Handle update and delete cases for comment
const handleChange = async (
  values,
  commentId,
  updateState,
  toggle,
  reloadCb
) => {
  const action = values.action.toLowerCase();
  delete values.action;

  switch (action) {
    // Update comment
    case "update":
      delete values.action;
      const { failed, msg } = await fetchData(
        `${endpoints.comments}/${commentId}`,
        values,
        "PUT"
      );
      if (failed) updateState((state) => ({ ...state, error: true, msg }));
      toggle();
      reloadCb();
      break;

    // Delete comment
    case "delete":
      delete values.action;
      if (window.confirm("Delete this comment?")) {
        const { failed, msg } = await fetchData(
          `${endpoints.comments}/${commentId}`,
          values,
          "DELETE"
        );
        if (failed) updateState((state) => ({ ...state, error: true, msg }));
        toggle();
        reloadCb();
      }
      break;

    default:
      break;
  }
};

const CommentModal = ({ toggle, initValues, reloadCb }) => {
  // Destructure data
  const { resourceId, resourceName, body, _id } = initValues;

  // Component state
  const [state, setState] = useState({
    error: false,
    msg: null,
  });

  return (
    <ReactModal toggleVisibility={toggle}>
      <Formik
        initialValues={{ resourceId, resourceName, body, action: "update" }}
        validationSchema={objSchema({ body: schemas.commentBody })}
        onSubmit={async (values) =>
          await handleChange(values, _id, setState, toggle, reloadCb)
        }
      >
        {(formik) => (
          <Form className="form" onSubmit={formik.handleSubmit}>
            <input type="hidden" name="resourceId" />
            <input type="hidden" name="resourceName" />
            <input type="hidden" name="action" />

            <TextAreaInput
              label="Comment body"
              name="body"
              placeholder="Type a comment here..."
            />

            {state.error && <Alerts messages={state.msg} />}
            <div>
              {/* Update comment button */}
              <Button
                type="submit"
                size="tiny"
                variant="success"
                // Change the action to 'update' before submit
                onClick={() => {
                  formik.setFieldValue("action", "update", false);
                  formik.handleSubmit();
                }}
                disabled={!(formik.isValid && formik.dirty)}
                isLoading={
                  formik.isSubmitting && formik.values.action === "update"
                }
              >
                Update
              </Button>

              {/* Delete comment button */}
              <Button
                type="submit"
                size="tiny"
                variant="danger"
                className="m--x-2"
                // Change the action to 'delete' before submit
                onClick={() => {
                  formik.setFieldValue("action", "delete", false);
                  formik.handleSubmit();
                }}
                isLoading={
                  formik.isSubmitting && formik.values.action === "delete"
                }
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
