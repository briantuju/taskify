import { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import { fetchData } from "../../utils/api";
import { endpoints } from "../../utils/constants";
import Button from "../formik/Button";
import Alerts from "../Alerts";

/**
 * Api call to verify account
 * @param {object} api
 * @param {Function} setApi
 */
const verifyAccount = async (api, setApi) => {
  setApi({ ...api, failed: false, msg: null, status: null });

  const { failed, msg, status } = await fetchData(endpoints.account.verify);

  setApi({ ...api, failed, msg, status });
};

export default function Activate() {
  // Component state
  const [api, setApi] = useState({ failed: false, msg: null, status: null });
  const [hide, setHide] = useState(false);

  useEffect(() => {
    let timer;
    if (api.status === 200) timer = setTimeout(() => setHide(true), 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [api.status]);

  if (hide) return null;

  return (
    <>
      <Formik
        initialValues={{}}
        onSubmit={async () => await verifyAccount(api, setApi)}
      >
        {(formik) => (
          <Form className="form--shadow">
            <span className="d--block text--danger brad">
              Your account is not verified. Kindly check your email for
              activation instructions or use the link below to send a new email
            </span>

            {api.failed && <Alerts messages={api.msg} type="danger" />}
            {api.status === 200 && <Alerts messages={api.msg} type="success" />}

            <Button
              type="submit"
              size="tiny"
              isLoading={formik.isSubmitting}
              disabled={formik.submitCount > 1}
            >
              Resend verification link
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
}
