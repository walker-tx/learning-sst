/**
 * Wrapper around a normal <input /> element, with tailwind styles applied.
 */
const Input: React.FC<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
> = (props) => {
  return <input className="border-2 rounded pl-2" {...props} />;
};

export default Input;
