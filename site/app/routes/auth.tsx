import { Outlet } from "@remix-run/react";

export default () => {
  return (
    <div className="flex flex-col items-center w-full">
      <Outlet />
    </div>
  );
};
