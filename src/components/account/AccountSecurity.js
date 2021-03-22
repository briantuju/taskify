import { Form, Formik } from "formik";
import schemas, { objSchema } from "../../utils/schemas";
import TextInput from "../formik/TextInput";
import Button from "../formik/Button";
// import Alerts from "../Alerts";

const updateAccount = async (values) => {
  console.log(values);
};

const AccountSecurity = () => {
  return (
    <>
      {/* Change Password Form */}
      <Formik
        initialValues={{ current_password: "", new_password: "", action: "" }}
        validationSchema={objSchema({
          current_password: schemas.password,
          new_password: schemas.password,
        })}
        onSubmit={async (values) => await updateAccount(values)}
      >
        {(formik) => (
          <Form className="form--shadow">
            <input type="hidden" name="action" />

            <h3 className="form__title">Change Password</h3>

            <TextInput
              placeholder="Current Password"
              name="current_password"
              type="password"
            />

            <TextInput
              placeholder="New Password"
              name="new_password"
              type="password"
            />

            {/* {error && <Alerts messages={error} type="danger" />} */}

            <Button
              type="submit"
              // Change the action to 'change_pwd' before submit
              onClick={() => {
                formik.setFieldValue("action", "change_pwd", false);
                formik.handleSubmit();
              }}
              isLoading={formik.isSubmitting}
              disabled={!(formik.isValid && formik.dirty)}
            >
              Change Password
            </Button>
          </Form>
        )}
      </Formik>

      <br />

      {/* Delete Account Form */}
      <Formik
        initialValues={{ password: "", action: "" }}
        validationSchema={objSchema({ password: schemas.password })}
        onSubmit={async (values) => await updateAccount(values)}
      >
        {(formik) => (
          <Form className="form--shadow">
            <input type="hidden" name="action" />

            <h3 className="m--y-tiny text--danger">Delete Account</h3>

            <span className="text--white p--tiny bg--warn brad">
              Please note that this action is <strong>irreversible</strong>. If
              you delete your account{" "}
              <i className="text--bold">
                all account data will be permanently lost and any active
                subscription will be cancelled.
              </i>
            </span>

            <TextInput placeholder="Password" name="password" type="password" />

            {/* {error && <Alerts messages={error} type="danger" />} */}

            <Button
              type="submit"
              variant="danger"
              // Change the action to 'delete_acc' before submit
              onClick={() => {
                formik.setFieldValue("action", "delete_acc", false);
                formik.handleSubmit();
              }}
              isLoading={formik.isSubmitting}
              disabled={!(formik.isValid && formik.dirty)}
            >
              Delete Account
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default AccountSecurity;
