import React from "react";

const Button = (
  props: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
) => {
  return (
    <button
      className="border-2 rounded enabled:hover:bg-blue-500 enabled:hover:text-white enabled:hover:border-blue-500 enabled:transition-all disabled:cursor-not-allowed disabled:bg-slate-200 disabled:border-slate-200"
      {...props}
    />
  );
};

export default Button;
