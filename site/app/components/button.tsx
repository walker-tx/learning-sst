import React from "react";

const Button = (
  props: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
) => {
  return (
    <button
      className="border-2 rounded hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all"
      {...props}
    />
  );
};

export default Button;
