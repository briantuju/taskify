import { useState } from "react";
import { Form, Formik } from "formik";
import { Link, useLocation, Redirect } from "react-router-dom";
import { endpoints, pageUrls } from "../utils/constants";
import { useAuth } from "../context/auth";
import { fetchData } from "../utils/api";
import schemas, { objSchema } from "../utils/schemas";
import CheckBoxInput from "../components/formik/CheckBoxInput";
import TextInput from "../components/formik/TextInput";
import Button from "../components/formik/Button";
import Alerts from "../components/Alerts";

const Login = () => {
  // Get auth state
  const { authToken, setAuthToken } = useAuth();

  // Use location object for redirects
  const location = useLocation();
  const { from } = location.state || { from: { pathname: pageUrls.home } };

  // Component state
  const [error, setError] = useState({ exists: false, msg: null });

  // Handle login
  const handleLogin = async (values) => {
    setError({ ...error, exists: false, msg: null });

    // Make a signup request to the server
    const { data, msg, status, failed } = await fetchData(
      endpoints.login,
      values,
      "POST"
    );
    setError({ ...error, exists: failed, msg });

    // Update auth state if login request was successfull
    if (status === 200) setAuthToken(data.data.authToken);
  };

  // Redirect if there's authToken
  if (authToken) return <Redirect to={from} />;

  return (
    <div className="container p--y-2">
      <Formik
        initialValues={{ email: "", password: "", remember: false }}
        validationSchema={objSchema({
          email: schemas.email,
          password: schemas.password,
        })}
        onSubmit={async (values) => await handleLogin(values)}
      >
        {(formik) => (
          <Form className="form--shadow-big form--center">
            <TextInput
              label="Email"
              name="email"
              type="email"
              placeholder="Your Email"
            />

            <TextInput
              label="Password"
              type="password"
              name="password"
              placeholder="Password"
            />

            <CheckBoxInput name="remember">Stay logged in</CheckBoxInput>

            {error.exists && <Alerts messages={error.msg} type="danger" />}

            <Button
              type="submit"
              isLoading={formik.isSubmitting}
              disabled={!(formik.isValid && formik.dirty)}
            >
              Login
            </Button>

            <Link to={pageUrls.forgotPassword}>I forgot my password</Link>
            <br />
            <Link to={pageUrls.signup}>Create account</Link>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
