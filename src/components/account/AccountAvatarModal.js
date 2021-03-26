import PropTypes from "prop-types";
import { useState } from "react";
import { Field, Form, Formik } from "formik";
import { fetchData } from "../../utils/api";
import { endpoints } from "../../utils/constants";
import ReactModal from "../ReactModal";
import Button from "../formik/Button";
import Alerts from "../Alerts";

// Change the current account avatar
const changeAvatar = async (file, setState) => {
  setState((state) => ({ ...state, error: false, msg: null }));

  const { failed, msg, data } = await fetchData(
    endpoints.media.userProfile,
    { file },
    "POST"
  );
  if (failed) {
    return setState((state) => ({ ...state, error: true, msg }));
  }
  setState((state) => ({ ...state, msg }));
  return data.data.public_id;
};

// Remove the current account avatar
const removeAvatar = async (setState, setAvatar) => {
  if (window.confirm("Remove this avatar?")) {
    setState((state) => ({ ...state, error: false, msg: null, loading: true }));
    const { failed, msg, data } = await fetchData(
      endpoints.media.userProfile,
      null,
      "DELETE"
    );
    if (failed) {
      return setState((state) => ({
        ...state,
        error: true,
        msg,
        loading: false,
      }));
    }
    setState((state) => ({ ...state, msg, loading: false }));
    if (data) {
      setAvatar((avatar) => ({ ...avatar, public_id: data.data.public_id }));
    }
  }
};

const AccountAvatarModal = ({ toggle, initValues }) => {
  // Destrucuture values
  const { secure_url, setState: setAvatar } = initValues;

  // Component state
  const [state, setState] = useState({
    file: secure_url,
    error: false,
    msg: null,
    loading: false,
  });

  /**
   * Get file and preview it as data:url image
   */
  const updatePreview = (event, formik) => {
    const file = event.currentTarget.files[0];
    formik.setFieldValue("avatar", file);

    const reader = new FileReader();
    reader.onloadend = () => setState({ ...state, file: reader.result });
    reader.readAsDataURL(file);
  };

  return (
    <ReactModal toggleVisibility={toggle}>
      <Formik
        initialValues={{ avatar: secure_url }}
        onSubmit={async () => {
          const data = await changeAvatar(state.file, setState);
          if (data) {
            setAvatar((avatar) => ({ ...avatar, public_id: data }));
          }
        }}
      >
        {(formik) => (
          <Form className="form--center">
            <Field
              as="img"
              src={state.file}
              className="img--avatar shadow brad m--auto"
              alt="Profile Avatar"
              height="200"
              width="200"
            />

            <br />

            <input
              type="file"
              name="avatar"
              className="form__input"
              onChange={(event) => updatePreview(event, formik)}
            />

            {state.error && <Alerts messages={state.msg} type="danger" />}
            {!state.error && state.msg && <Alerts messages={state.msg} />}

            <div className="p--y-1">
              {/* Change avatar button */}
              <Button
                type="submit"
                isLoading={formik.isSubmitting}
                disabled={
                  !state.file || state.file === secure_url ? true : false
                }
              >
                Change Avatar
              </Button>

              {/* Remove avatar button */}
              <Button
                onClick={() => removeAvatar(setState, setAvatar)}
                variant="danger"
                className="m--x-2"
                isLoading={state.loading}
                disabled={formik.isSubmitting}
              >
                Remove Avatar
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </ReactModal>
  );
};

AccountAvatarModal.propTypes = {
  toggle: PropTypes.func.isRequired,
  initValues: PropTypes.object.isRequired,
};

export default AccountAvatarModal;
