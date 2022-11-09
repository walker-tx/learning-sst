import { Link, Outlet, useCatch } from "@remix-run/react";
import React, { ReactPropTypes } from "react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="flex flex-col items-center w-full">{children}</div>;
};

export default () => {
  return (
    <Layout>
      <Outlet />
      <sub className="mt-8">
        <Link to="/">Home</Link>
      </sub>
    </Layout>
  );
};

export const CatchBoundary = () => {
  const caught = useCatch();

  if (caught.statusText === "UserNotConfirmedException")
    return (
      <Layout>
        <div className="text-center min-w-fit w-1/2 max-w-md flex flex-col border-2 rounded p-4">
          <h1>Confirm Your Account</h1>
          <p>You need to confirm your account before you can log in.</p>
          <span>
            <Link to="/auth/confirm">Confirm your account</Link>.
          </span>
        </div>
      </Layout>
    );

  return (
    <Layout>
      <div>
        <h1>Caught</h1>
        <p>Status: {caught.status}</p>
        <pre>
          <code>{caught.statusText}</code>
        </pre>
      </div>
    </Layout>
  );
};

export const ErrorBoundary = ({ error }: { error: Error }) => {
  return (
    <Layout>
      <h2>Problem!</h2>
      <p>{error.message}</p>
    </Layout>
  );
};
