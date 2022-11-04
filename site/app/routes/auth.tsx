import { Link, Outlet } from "@remix-run/react";

export default () => {
  return (
    <div className="flex flex-col items-center w-full">
      <Outlet />
      <sub className="mt-8">
        <Link to="/">Home</Link>
      </sub>
    </div>
  );
};
