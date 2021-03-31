import { useState } from "react";
import { Form, Formik } from "formik";
import PropTypes from "prop-types";
import { Alert } from "../Alerts";
import { fetchData } from "../../utils/api";
import { endpoints } from "../../utils/constants";
import schemas, { objSchema } from "../../utils/schemas";
import TextAreaInput from "../formik/TextAreaInput";
import Button from "../formik/Button";

const CommentCreate = ({ resourceId, resourceName, reloadCb }) => {
  // Component state
  const [state, setState] = useState({
    error: false,
    msg: null,
  });

  const createComment = async (values) => {
    setState({ ...state, error: false, msg: null });

    // Api call to add a comment
    const { failed, msg } = await fetchData(endpoints.comments, values, "POST");

    if (failed) return setState({ ...state, error: true, msg });

    reloadCb();
  };

  return (
    <Formik
      initialValues={{ resourceId, resourceName, body: "" }}
      validationSchema={objSchema({ body: schemas.commentBody })}
      onSubmit={async (values) => await createComment(values)}
    >
      {(formik) => (
        <Form className="form--m-tiny">
          <input type="hidden" name="resourceId" />
          <input type="hidden" name="resourceName" />

          <TextAreaInput
            name="body"
            edit
            placeholder="Type a comment here..."
          />

          {state.error && <Alert messages={state.msg} type="danger" />}

          <Button
            type="submit"
            size="tiny"
            variant="success"
            isLoading={formik.isSubmitting}
            disabled={!(formik.isValid && formik.dirty)}
          >
            Add comment
          </Button>
        </Form>
      )}
    </Formik>
  );
};

CommentCreate.propTypes = {
  reloadCb: PropTypes.func.isRequired,
};

export default CommentCreate;
