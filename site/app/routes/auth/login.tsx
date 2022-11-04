import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useCatch, useTransition } from "@remix-run/react";
import React from "react";
import { authenticate } from "~/auth.server";
import Input from "~/components/input";
import Button from "~/components/button";

export const loader: LoaderFunction = async () => {
  return null;
};

export const action: ActionFunction = async ({ request, context }) => {
  const body = await request.formData();
  const email = body.get("email");
  const password = body.get("password");

  if (!email || !password) {
    throw Error("Invalid input");
  }

  return await authenticate(email as string, password as string);
};

export default () => {
  const transition = useTransition();

  return (
    <Form
      className="min-w-fit w-1/2 max-w-md flex flex-col border-2 rounded p-4"
      method="post"
    >
      <h2 className="mt-0 mb-2">Log In</h2>
      <label htmlFor="email" className="mt-2">
        Email
      </label>
      <Input type="email" name="email" disabled={transition.state !== "idle"} />
      <label htmlFor="password" className="mt-2">
        Password
      </label>
      <Input
        type="password"
        name="password"
        disabled={transition.state !== "idle"}
      />
      <hr className="my-4" />
      <Button type="submit" disabled={transition.state !== "idle"}>
        {transition.state !== "idle" ? "Logging In..." : "Log In"}
      </Button>
      <sub className="mt-4 text-center text-slate-500">
        Not a user yet? <Link to="/auth/signup">Sign up</Link>.
      </sub>
    </Form>
  );
};

export const CatchBoundary = () => {
  const caught = useCatch();
  // if (caught.statusText === "User")
  return (
    <div>
      <h1>Caught</h1>
      <p>Status: {caught.status}</p>
      <pre>
        <code>{caught.statusText}</code>
      </pre>
    </div>
  );
};

export const ErrorBoundary = ({ error }: { error: Error }) => {
  return (
    <>
      <h2>Problem!</h2>
      <p>{error.message}</p>
    </>
  );
};
