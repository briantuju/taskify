import { Form, Formik } from "formik";
import { Link } from "react-router-dom";
// import { useApi, getApiErrorMsg } from "../utils/api";
import { endpoints, pageUrls } from "../utils/constants";
import TextInput from "../components/formik/TextInput";
import schemas, { objSchema } from "../utils/schemas";
import Button from "../components/formik/Button";
import AlertDismissible from "../components/AlertDismissible";
import { useState } from "react";

const ForgotPwd = () => {
  // Component State
  const [disableForm, setDisableForm] = useState(false);

  // Fetch API data
  // const { error, data, refetch } = useApi(
  //   endpoints.forgotPwd,
  //   null,
  //   "POST",
  //   true
  // );

  // Api call to get password reset token
  const handleForgotPwd = async (values) => {
    /* const { data } = await refetch({ data: values });
    if (data.success === true) {
      setDisableForm(true);
    } */
  };

  return (
    <div className="container p--y-2">
      {/* {error && (
        <AlertDismissible message={getApiErrorMsg(error)} type="danger" />
      )} */}

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
              disabled={disableForm}
              placeholder="Your email"
            />

            {/* {data && data.msg && <AlertDismissible message={data.msg} />} */}

            <Button
              type="submit"
              isLoading={formik.isSubmitting}
              disabled={!(formik.isValid && formik.dirty) || disableForm}
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
