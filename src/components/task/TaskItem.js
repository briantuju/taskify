import { useState } from "react";
import { Form, Formik } from "formik";
import { Link } from "react-router-dom";
import { fetchData } from "../../utils/api";
import { endpoints, pageUrls } from "../../utils/constants";
import { DateTime, hardRedirectLocation } from "../../utils/helpers";
import schemas, { objSchema } from "../../utils/schemas";
import CheckBoxInput from "../formik/CheckBoxInput";
import TextAreaInput from "../formik/TextAreaInput";
import TextInput from "../formik/TextInput";
import Button from "../formik/Button";
import ShowHide from "../ShowHide";

// Api call to handle Task Actions
const handleTask = async (values, id, boardId) => {
  let action = values.action.toLowerCase();
  delete values.action;

  switch (action) {
    // Update Task
    case "update":
      await fetchData(
        `${endpoints.tasks}/${id}`,
        { ...values, boardId },
        "PUT"
      );
      break;

    // Toggle done status
    case "toggle":
      await fetchData(
        `${endpoints.tasks}/${id}`,
        { ...values, boardId, done: !values.done },
        "PUT"
      );
      break;

    // Delete Task
    case "delete":
      if (window.confirm("Delete this task?")) {
        await fetchData(`${endpoints.tasks}/${id}`, { boardId }, "DELETE");
        return hardRedirectLocation(pageUrls.home);
      }
      break;

    default:
      break;
  }
};

const TaskItem = ({ taskData }) => {
  // Destructure props
  const { title, description, done, _id } = taskData;
  const { boardData, createdAt, updatedAt } = taskData;

  // Component state
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Formik
      initialValues={{
        action: "update",
        title,
        description: description || "",
        done,
      }}
      validationSchema={objSchema({
        title: schemas.taskTitle,
        description: schemas.taskDescription,
      })}
      onSubmit={async (values) => await handleTask(values, _id, boardData._id)}
    >
      {(formik) => (
        <Form className="form outline" onSubmit={formik.handleSubmit}>
          <input type="hidden" name="action" />

          <TextInput name="title" className="text--bold" edit />

          <TextAreaInput
            name="description"
            placeholder="Task Description"
            edit
          />

          <small>
            Task Board{" "}
            <Link to={pageUrls.board + "/" + boardData._id}>
              {boardData.title}
            </Link>
          </small>

          <div>
            <ShowHide
              handleToggle={setShowDetails}
              isExpanded={showDetails}
              text="Task Details"
            />
          </div>

          {showDetails && (
            <div className="p--x-1 bg--light shadow--small brad">
              <span className="d--block m--y-tiny">
                Task Status :{" "}
                <strong className="text--dark">
                  {done ? "Complete" : "Incomplete"}
                </strong>
              </span>

              <span className="d--block m--y-tiny">
                Created{" "}
                <strong className="text--dark">
                  {DateTime.fromNow(createdAt)}
                </strong>
              </span>

              {/* Show updated date only if the task has been updated */}
              {createdAt !== updatedAt && (
                <span className="d--block m--y-tiny">
                  Last updated{" "}
                  <strong className="text--dark">
                    {DateTime.fromNow(updatedAt)}
                  </strong>
                </span>
              )}
            </div>
          )}

          {/* Toggle Status Checkbox */}
          <CheckBoxInput
            name="done"
            // Change the action to 'toggle' before submit
            onChange={() => {
              formik.setFieldValue("action", "toggle", false);
              formik.handleSubmit();
            }}
            className="outline"
            // checked={done}
          >
            <strong>{done ? "Done" : "Mark complete"}</strong>
          </CheckBoxInput>

          {/* Update Form Button */}
          <Button
            variant="success"
            // Change the action to 'update' before submit
            onClick={() => {
              formik.setFieldValue("action", "update", false);
              formik.handleSubmit();
            }}
            isLoading={formik.isSubmitting}
            disabled={!(formik.isValid && formik.dirty)}
          >
            Save Changes
          </Button>

          {/* Delete Form Button */}
          <Button
            variant="danger"
            // Change the action to 'delete' before submit
            onClick={() => {
              formik.setFieldValue("action", "delete", false);
              formik.handleSubmit();
            }}
          >
            Delete Task
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default TaskItem;
