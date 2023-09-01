import React from "react";

function Button({
  color = "primary",
  children,
  onClick,
  size = "",
  className,
}) {
  return (
    <button
      type="button"
      className={`btn ${size} btn-${color} m-b-10 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
