const Button = ({
  text,
  onClick,
  className = "",
  children,
  variant,
  type,
  disabled,
  notUpperCase = false
}) => {
  return (
    <button
      className={`btn btn-${variant} m-2 ${className} ${!notUpperCase ? 'text-uppercase' : 'text-capitalize'}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      <span>
        {text} {children}
      </span>
    </button>
  );
};

export default Button;
