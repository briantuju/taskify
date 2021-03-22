import { useState } from "react";
import { Form, Formik } from "formik";
import { fetchData } from "../../utils/api";
import { DateTime, hardRedirectLocation } from "../../utils/helpers";
import { endpoints, pageUrls } from "../../utils/constants";
import schemas, { objSchema } from "../../utils/schemas";
import TextAreaInput from "../formik/TextAreaInput";
import TextInput from "../formik/TextInput";
import Button from "../formik/Button";
import ShowHide from "../ShowHide";

// Helper method to handle board actions
const handleBoard = async (values, id) => {
  const action = values.action.toLowerCase();

  switch (action) {
    // Update board
    case "update":
      delete values.action;
      await fetchData(`${endpoints.boards}/${id}`, values, "PUT");
      break;

    // Delete board
    case "delete":
      if (window.confirm("Delete this Board?")) {
        delete values.action;
        await fetchData(`${endpoints.boards}/${id}`, values, "DELETE");
        return hardRedirectLocation(pageUrls.home);
      }
      break;

    default:
      break;
  }
};

const BoardItem = ({ boardData }) => {
  // Destructure data
  const { title, description, tasks, createdAt } = boardData;
  const { updatedAt, isActive, isPublic, _id } = boardData;

  // Component state
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      {/* View/Update Board Form */}
      <Formik
        initialValues={{ boardId: _id, action: "update", title, description }}
        validationSchema={objSchema({
          title: schemas.boardTitle,
          description: schemas.boardDescription,
        })}
        onSubmit={async (values) => await handleBoard(values, _id)}
      >
        {(formik) => (
          <Form className="form outline p--tiny" onSubmit={formik.handleSubmit}>
            <input type="hidden" name="boardId" />
            <input type="hidden" name="action" />

            <TextInput name="title" className="text--bold" edit />

            <TextAreaInput
              name="description"
              edit
              placeholder="A meaningfull description makes it easy to remember the purpose of this Board"
            />

            {/* Board Details toggler */}
            <div>
              <ShowHide
                handleToggle={setShowDetails}
                isExpanded={showDetails}
                text="Board Details"
              />
            </div>

            {showDetails && (
              <div className="p--x-1 bg--light shadow--small brad">
                <span className="d--block m--y-tiny">
                  Visibility :{" "}
                  <strong className="text--info">
                    {isPublic ? "Public" : "Private"}
                  </strong>
                </span>

                <span className="d--block m--y-tiny">
                  Board Status :{" "}
                  <strong className="text--dark">
                    {isActive ? "Active" : "Inactive"}
                  </strong>
                </span>

                <span className="d--block m--y-tiny">
                  Board Tasks :{" "}
                  <strong className="text--dark">{tasks.count}</strong>
                </span>

                <span className="d--block m--y-tiny">
                  Created{" "}
                  <strong className="text--dark">
                    {DateTime.fromNow(createdAt)}
                  </strong>
                </span>

                {/* Show updated date only if the board has been updated */}
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

            {/* Update Board Button */}
            <Button
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
              Save Changes
            </Button>

            {/* Delete Board Button */}
            <Button
              variant="danger"
              // Change the action to 'delete' before submit
              onClick={() => {
                formik.setFieldValue("action", "delete", false);
                formik.handleSubmit();
              }}
              isLoading={
                formik.isSubmitting && formik.values.action === "delete"
              }
            >
              Delete Board
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default BoardItem;
