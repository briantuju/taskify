import { useState } from "react";
import { Form, Formik } from "formik";
import { Alert } from "../Alerts";
import { endpoints, pageUrls } from "../../utils/constants";
import { hardRedirectLocation } from "../../utils/helpers";
import { AppStorage } from "../../utils/helpers";
import { fetchData } from "../../utils/api";
import schemas, { objSchema } from "../../utils/schemas";
import TextInput from "../formik/TextInput";
import Button from "../formik/Button";

const options = {
  del: "deleteAccount",
  change: "changePassword",
};

const updateAccount = async (values, option, setErrorMsg) => {
  setErrorMsg(null);
  switch (option) {
    // Update board
    case options.change:
      const { failed, msg } = await fetchData(
        endpoints.account.changePwd,
        values,
        "POST"
      );
      if (failed) {
        setErrorMsg(msg);
        return;
      }
      AppStorage.removeAuthToken();
      hardRedirectLocation(pageUrls.login);
      break;

    // Delete board
    case options.del:
      if (window.confirm("Delete this Board?")) {
        const { failed, msg } = await fetchData(
          endpoints.account.get,
          values,
          "DELETE"
        );
        if (failed) {
          setErrorMsg(msg);
          return;
        }
        AppStorage.removeAuthToken();
        return hardRedirectLocation(pageUrls.landing);
      }
      break;

    default:
      break;
  }
};

const AccountSecurity = () => {
  const [deleteError, setDeleteError] = useState(null);
  const [changeError, setChangeError] = useState(null);

  return (
    <>
      {/* Change Password Form */}
      <Formik
        initialValues={{ current_password: "", new_password: "" }}
        validationSchema={objSchema({
          current_password: schemas.password,
          new_password: schemas.password,
        })}
        onSubmit={async (values) =>
          await updateAccount(values, options.change, setChangeError)
        }
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

            {changeError && <Alert messages={changeError} type="danger" />}

            <Button
              type="submit"
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
        initialValues={{ password: "" }}
        validationSchema={objSchema({ password: schemas.password })}
        onSubmit={async (values) =>
          await updateAccount(values, options.del, setDeleteError)
        }
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

            {deleteError && <Alert messages={deleteError} type="danger" />}

            <Button
              type="submit"
              variant="danger"
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
