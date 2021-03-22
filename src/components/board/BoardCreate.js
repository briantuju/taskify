import { Form, Formik } from "formik";
import PropTypes from "prop-types";
import schemas, { objSchema } from "../../utils/schemas";
import TextAreaInput from "../formik/TextAreaInput";
import TextInput from "../formik/TextInput";
import ReactModal from "../ReactModal";
import Button from "../formik/Button";
import Alerts from "../Alerts";

const BoardCreate = ({ message, handleAddBoard, toggleVisibility }) => {
  return (
    <>
      <ReactModal toggleVisibility={toggleVisibility}>
        <Formik
          initialValues={{ title: "", description: "" }}
          validationSchema={objSchema({
            title: schemas.boardTitle,
            description: schemas.boardDescription,
          })}
          onSubmit={async (values) => await handleAddBoard(values)}
        >
          {(formik) => (
            <Form className={`form shadow`}>
              <TextInput label="Board Title" name="title" />

              <TextAreaInput
                label="Board Description"
                name="description"
                placeholder="(Optional)"
              />

              {message && <Alerts messages={message} />}

              <Button
                type="submit"
                isLoading={formik.isSubmitting}
                disabled={!(formik.isValid && formik.dirty)}
              >
                Create Board
              </Button>
            </Form>
          )}
        </Formik>
      </ReactModal>
    </>
  );
};

BoardCreate.propTypes = {
  toggleVisibility: PropTypes.func.isRequired,
  handleAddBoard: PropTypes.func.isRequired,
};

export default BoardCreate;
