import { Form, Formik } from "formik";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchData } from "../utils/api";
import { Overlay } from "../components/Loading";
import { endpoints, pageUrls } from "../utils/constants";
import schemas, { objSchema } from "../utils/schemas";
import AlertDismissible from "../components/AlertDismissible";
import TextInput from "../components/formik/TextInput";
import useQueryParams from "../hooks/useQueryParams";
import Button from "../components/formik/Button";
import Alerts from "../components/Alerts";
import useApi from "../hooks/useApi";

// Display a link to request password reset
const RequestReset = () => (
  <span className="d--block m--y-2">
    <Link to={pageUrls.forgotPassword}>Visit forgot password page </Link>
    <strong className="text--dark">
      to request a valid password reset link
    </strong>
  </span>
);

// Display a successfull password request component
const ResetSuccessfull = () => {
  return (
    <div className="p--y-2 container">
      <div className="d--flex-center m--1 p--2">
        <h1 className="h1 text--success">Password Reset Successfull</h1>
        <br />
        <p className="m--y-1">
          <Link to={pageUrls.login} className="btn btn--size-tiny">
            Login now
          </Link>
        </p>
      </div>
    </div>
  );
};

// Handle password reset flow
const ResetPwd = () => {
  // Get token from Query
  const query = useQueryParams();
  const token = query.get("token") || "";

  // Component state
  const [resetObj, setResetObj] = useState({
    tokenValid: false,
    resetting: false,
    resetSuccessfull: false,
    msg: "We could not reset your password. Try again later!",
    error: false,
  });

  // Fetch API data
  const [{ loading, error, data, msg }] = useApi(
    `${endpoints.resetPwd}?token=${token}`
  );

  useEffect(() => {
    // If token is valid, update state appropriately
    if (data && data.success === true) {
      setResetObj((resetObj) => ({ ...resetObj, tokenValid: true }));
    }
  }, [data, token]);

  // API call to reset password
  const handleResetPwd = async (values) => {
    setResetObj({ ...resetObj, resetting: true });

    const { data, msg, failed } = await fetchData(
      endpoints.resetPwd,
      values,
      "POST"
    );

    // Update state if the request was successfull
    if (data && data.success === true) {
      setResetObj({ ...resetObj, resetting: false, resetSuccessfull: true });
    }
    if (failed) {
      return setResetObj({ ...resetObj, resetting: false, error: true, msg });
    }
  };

  // Notify the user if no token was provided
  if (!token) {
    return (
      <div className="container p--y-2">
        <div className="d--flex-center p--2 m--1">
          <h3 className="h3 text--bold">Reset Password</h3>

          <p className="m--y-2">
            <strong className="text--info">
              You may have accessed this page erroneously because there is no
              token present in your request.
            </strong>

            <RequestReset />
          </p>
        </div>
      </div>
    );
  }

  // Redirect to login page on successfull password reset
  if (resetObj.resetSuccessfull === true) return <ResetSuccessfull />;

  return (
    <div className="container p--y-2">
      {/* Show loading only if resetting is false */}
      {loading && !resetObj.resetting && <Overlay />}

      {error && (
        <>
          <Alerts messages={msg || ""} type="danger" /> <RequestReset />
        </>
      )}

      {/* If the token is valid, show form to reset password */}
      {resetObj.tokenValid && (
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={objSchema({
            email: schemas.email,
            password: schemas.password,
          })}
          onSubmit={async (values) => await handleResetPwd(values)}
        >
          {(formik) => (
            <Form className="form--p-2 form--shadow form--center">
              <TextInput
                label="Email Address"
                type="email"
                name="email"
                placeholder="Your email"
              />

              <TextInput
                label="New Password"
                type="password"
                name="password"
                placeholder="Enter new password"
              />

              {resetObj.error && <AlertDismissible message={resetObj.msg} />}

              <Button
                type="submit"
                isLoading={formik.isSubmitting}
                disabled={!(formik.isValid && formik.dirty)}
              >
                Reset password
              </Button>

              <br />
              <Link to={pageUrls.login}>Take me to login now</Link>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default ResetPwd;
