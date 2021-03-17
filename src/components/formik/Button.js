import { SpinnerInline } from "../Loading";

// Custom button that manages its own state according to props
const Button = ({
  type = "button",
  size = "small",
  isLoading = false,
  variant,
  children,
  className,
  ...props
}) => {
  return (
    <>
      <button
        type={type}
        className={`btn ${size ? `btn--size-${size}` : ""} ${
          variant ? ` btn--variant-${variant}` : ""
        } ${className ? className : ""}`}
        data-disabled={isLoading}
        {...props}
      >
        {isLoading ? <SpinnerInline /> : children}
      </button>
    </>
  );
};

export default Button;
