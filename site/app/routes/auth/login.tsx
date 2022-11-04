import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";
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
  return (
    <Form
      className="min-w-fit w-1/2 max-w-md flex flex-col border-2 rounded p-4"
      method="post"
    >
      <h2 className="mt-0 mb-2">Log In</h2>
      <label htmlFor="email" className="mt-2">
        Email
      </label>
      <Input type="email" name="email" />
      <label htmlFor="password" className="mt-2">
        Password
      </label>
      <Input type="password" name="password" />
      <hr className="my-4" />
      <Button type="submit">Log In</Button>
      <sub className="mt-4 text-center text-slate-500">
        Not a user yet? <a href="/auth/signup">Sign up</a>.
      </sub>
    </Form>
  );
};

export const ErrorBoundary = ({ error }: { error: Error }) => {
  console.log({ error });

  return (
    <>
      <h2>Problem!</h2>
      <p>{error.message}</p>
    </>
  );
};
