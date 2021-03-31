import { useState } from "react";
import { Form, Formik } from "formik";
import { Link, Redirect } from "react-router-dom";
import { useAuth } from "../context/auth";
import { fetchData } from "../utils/api";
import { AlertDismissible } from "../components/Alerts";
import { endpoints, pageUrls } from "../utils/constants";
import TextInput from "../components/formik/TextInput";
import schemas, { objSchema } from "../utils/schemas";
import Button from "../components/formik/Button";

const ForgotPwd = () => {
  // Get auth state
  const { authToken } = useAuth();

  // Component State
  const [state, setState] = useState({ error: null, msg: null, attempts: 0 });

  if (authToken) return <Redirect to={pageUrls.home} />;

  // Api call to get password reset token
  const handleForgotPwd = async (values) => {
    setState({ ...state, error: null, msg: null });

    const { failed, msg } = await fetchData(
      endpoints.forgotPwd,
      values,
      "POST"
    );

    if (failed) setState({ ...state, error: msg });

    setState((state) => ({ ...state, msg, attempts: state.attempts++ }));
  };

  return (
    <div className="container p--y-2">
      {state.error && <AlertDismissible message={state.error} type="danger" />}

      {/* Password Reset Form */}
      <Formik
        initialValues={{ email: "" }}
        validationSchema={objSchema({ email: schemas.email })}
        onSubmit={async (values) => await handleForgotPwd(values)}
      >
        {(formik) => (
          <Form className="form form--shadow-big form--center">
            <TextInput
              label="Email"
              type="email"
              name="email"
              edit
              disabled={state.attempts > 2}
              placeholder="Your email"
            />

            {state.msg && <AlertDismissible message={state.msg} />}

            <Button
              type="submit"
              isLoading={formik.isSubmitting}
              disabled={!(formik.isValid && formik.dirty) || state.attempts > 2}
            >
              Get reset link
            </Button>

            <Link to={pageUrls.login} className="m--y-1">
              I remembered my password
            </Link>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ForgotPwd;
