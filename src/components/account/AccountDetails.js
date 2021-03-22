import { Form, Formik } from "formik";
import { fetchData } from "../../utils/api";
import { endpoints } from "../../utils/constants";
import schemas, { objSchema } from "../../utils/schemas";
import TextInput from "../formik/TextInput";
import Button from "../formik/Button";
import Activate from "./Activate";

const updateAccount = async (values) => {
  // Update account details
  await fetchData(endpoints.account.get, values, "PUT");
};

const AccountDetails = ({ accountData }) => {
  // Destructure data
  const { name, email } = accountData;

  return (
    <>
      {/* Notify user to verify account if not verified */}
      {!accountData.verification.isVerified && <Activate />}

      <Formik
        initialValues={{
          firstname: name.first,
          lastname: name.last,
          email: email,
          action: "update",
        }}
        validationSchema={objSchema({
          firstname: schemas.name.required("First name cannot be blank"),
          lastname: schemas.name,
          email: schemas.email,
        })}
        onSubmit={async (values) => await updateAccount(values)}
      >
        {(formik) => (
          <Form className="form outline">
            <input type="hidden" name="action" />

            <TextInput name="firstname" edit label="First Name" />

            <TextInput name="lastname" edit label="Last Name" />

            <TextInput name="email" edit type="email" label="Email" />

            <Button
              type="submit"
              variant="success"
              isLoading={formik.isSubmitting}
              disabled={!(formik.isValid && formik.dirty)}
            >
              Save
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default AccountDetails;
