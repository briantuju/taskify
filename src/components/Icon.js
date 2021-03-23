/**
 * Ion-icon component
 */
const Icon = ({ name = "", size = "", handleClick = null, ...props }) => {
  return (
    <span onClick={handleClick} {...props}>
      <ion-icon name={name} size={size}></ion-icon>
    </span>
  );
};

export default Icon;
