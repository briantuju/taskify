import { Form, Formik } from "formik";
import { Link, useLocation, Redirect } from "react-router-dom";
import { endpoints, pageUrls } from "../utils/constants";
// import { getApiErrorMsg, useApi } from "../utils/api";
import { useAuth } from "../context/auth";
import { AppStorage } from "../utils/helpers";
import schemas, { objSchema } from "../utils/schemas";
import Alerts from "../components/Alerts";
import Button from "../components/formik/Button";
import TextInput from "../components/formik/TextInput";
import CheckBoxInput from "../components/formik/CheckBoxInput";

const Login = () => {
  // TODO: Keep the form disabled while getting the CSRF token
  // from server then enable form submission
  const location = useLocation();
  const { from } = location.state || { from: { pathname: pageUrls.home } };

  // Get auth state
  const { authToken, setAuthToken } = useAuth();

  // Fetch API data
  // const { error, refetch } = useApi(endpoints.login, null, "POST", true);

  // Handle login
  const handleLogin = async (values) => {
    // const { data } = await refetch({ data: values });
    // Update auth state if login request was successfull
    /* if (data.success === true) {
      Storage.setJwtToken(data.data.authToken);
      setAuthToken(data.data.authToken);
    } */
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
          <Form className="form--p-2 form--shadow-big form--center">
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

            {/* {error && <Alerts messages={getApiErrorMsg(error)} type="danger" />} */}

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
