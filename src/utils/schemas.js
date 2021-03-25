import * as Yup from "yup";

/**
 * Bootstrap an object schema
 * @param {*} obj
 * @public
 */
export const objSchema = (obj) => Yup.object().shape(obj);

/**
 * Validation schemas
 */
const schemas = {
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),

  password: Yup.string()
    .matches(
      /(?=.*?[A-Za-z])(?=.*?[0-9]).{8,}/,
      "Password must have at least: one lowercase letter, one uppercase letter, one digit and minimum 8 characters."
    )
    .required("Password is required"),

  name: Yup.string()
    .matches(/^$|^[A-Za-z\s]+$/, "No special characters allowed")
    .min(3, "Minimum 3 characters")
    .max(50, "Maximum 50 characters"),

  boardTitle: Yup.string()
    .min(3, "Minimum 3 characters")
    .max(50, "Maximum 50 characters")
    .required("Title is required"),

  boardDescription: Yup.string()
    .min(3, "Minimum 3 characters")
    .max(4096, "Maximum 4096 characters"),

  taskTitle: Yup.string()
    .min(3, "Minimum 3 characters")
    .max(50, "Maximum 50 characters")
    .required("Title is required"),

  taskDescription: Yup.string()
    .min(3, "Minimum 3 characters")
    .max(256, "Maximum 256 characters"),

  commentBody: Yup.string()
    .min(2, "Minimum 2 characters")
    .max(256, "Max 256 characters"),
};

export default schemas;
