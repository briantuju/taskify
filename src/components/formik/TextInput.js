import { useField } from "formik";

// Defaults to input of type 'text'
const TextInput = ({
  label,
  type = "text",
  edit = false,
  className,
  ...props
}) => {
  /* 
    useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
    which we can spread on <input>. We can use field meta to show an error
    message if the field is invalid and it has been touched (i.e. visited)
  */

  const [field, meta] = useField(props);
  const showErr = meta.touched && meta.error ? true : false;

  const randomNum = Math.random() * 100;

  const togglePasswordVisibility = () => {
    let pwdInput = document.querySelector(
      `[data-pwd-id='${randomNum.toString()}']`
    );
    if (pwdInput.type === "text") {
      pwdInput.type = "password";
    } else pwdInput.type = "text";
  };

  return (
    <div className="form__group">
      <label className="form__label" htmlFor={props.id || props.name}>
        {label}
      </label>

      <input
        className={`form__input${edit ? "--edit" : ""} border ${
          showErr ? " border--danger shadow--none " : ""
        } ${className ? className : ""}`}
        type={type}
        title={edit ? "Click to edit" : ""}
        data-pwd-id={type === "password" && randomNum.toString()}
        id={props.id ? props.id : props.name}
        {...field}
        {...props}
      />

      {/*
        Show password icon if type is password 
        TODO: Use icon inside password field or link instead of input element
      */}

      {type === "password" && (
        <div className="m--y-1">
          <label htmlFor={`show-pwd${randomNum.toString()}`} className="check">
            <input
              type="checkbox"
              name="show-pwd"
              id={`show-pwd${randomNum.toString()}`}
              className="form__input--show-pwd check__input"
              onClick={togglePasswordVisibility}
            />
            <div className="check__fill float--left"></div>
            Show password
          </label>
        </div>
      )}

      {showErr ? <div className="text--danger">{meta.error}</div> : null}
    </div>
  );
};

export default TextInput;
