import PropTypes from "prop-types";
import { Form, Formik } from "formik";
import schemas, { objSchema } from "../../utils/schemas";
import TextAreaInput from "../formik/TextAreaInput";
import TextInput from "../formik/TextInput";
import ReactModal from "../ReactModal";
import Button from "../formik/Button";
import Alerts from "../Alerts";

const TaskCreate = ({ handleAddTask, message, id, toggleVisibility }) => {
  return (
    <ReactModal toggleVisibility={toggleVisibility}>
      {/* New Task Form */}
      <Formik
        initialValues={{
          boardId: id,
          title: "",
          description: "",
        }}
        validationSchema={objSchema({
          title: schemas.taskTitle,
          description: schemas.taskDescription,
        })}
        onSubmit={async (values) => await handleAddTask(values)}
      >
        {(formik) => (
          <Form className={`form m--y-2 shadow--small p--2`}>
            <input type="hidden" name="boardId" />

            <TextInput label="Task Title" name="title" />

            <TextAreaInput
              label="Task Description"
              name="description"
              placeholder="(Optional)"
            />

            {message && <Alerts messages={message} />}

            <Button
              type="submit"
              isLoading={formik.isSubmitting}
              disabled={!(formik.isValid && formik.dirty)}
            >
              Add Task
            </Button>
          </Form>
        )}
      </Formik>
    </ReactModal>
  );
};

TaskCreate.propTypes = {
  toggleVisibility: PropTypes.func.isRequired,
  handleAddTask: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

export default TaskCreate;
