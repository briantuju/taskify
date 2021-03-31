import { useState } from "react";
import { Formik, Form } from "formik";
import { Link, Redirect } from "react-router-dom";
import { fetchData } from "../utils/api";
import { useAuth } from "../context/auth";
import { Alert } from "../components/Alerts";
import { endpoints, pageUrls } from "../utils/constants";
import schemas, { objSchema } from "../utils/schemas";
import TextInput from "../components/formik/TextInput";
import Button from "../components/formik/Button";

const Signup = () => {
  // Get auth state
  const { authToken, setAuthToken } = useAuth();

  // Component state
  const [error, setError] = useState({ exists: false, msg: null });

  // Handle signup
  const handleSignup = async (values) => {
    setError({ ...error, exists: false, msg: null });

    // Make a signup request to the server
    const { data, msg, status, failed } = await fetchData(
      endpoints.signup,
      values,
      "POST"
    );
    setError({ ...error, exists: failed, msg });

    // Update the auth state with authToken
    if (status === 201) setAuthToken(data.data.authToken);
  };

  // Redirect if there's authToken
  if (authToken) return <Redirect to={pageUrls.home} />;

  return (
    <div className="container p--y-2">
      {/* Signup Form */}
      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
          acceptedTerms: false,
        }}
        validationSchema={objSchema({
          name: schemas.name.required("Required"),
          email: schemas.email,
          password: schemas.password,
        })}
        onSubmit={async (values) => await handleSignup(values)}
      >
        {(formik) => (
          <Form className="form--shadow-big form--center">
            <TextInput label="Name" name="name" placeholder="Your Name" />

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

            {error.exists && <Alert messages={error.msg} type="danger" />}

            <Button
              type="submit"
              isLoading={formik.isSubmitting}
              disabled={!(formik.isValid && formik.dirty)}
            >
              Signup
            </Button>

            <br />
            <Link to={pageUrls.login}>I have an account</Link>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Signup;
