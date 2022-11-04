import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import { signUp } from "~/auth.server";
import Button from "~/components/button";
import Input from "~/components/input";

export const loader: LoaderFunction = async () => {
  return null;
};

export const action: ActionFunction = async ({ request, context }) => {
  const body = await request.formData();
  const email = body.get("email") as string | null;
  const password = body.get("password") as string | null;

  if (!email || !password) {
    throw Error("Invalid input");
  }

  return await signUp(email, password);
};

export default () => {
  return (
    <Form
      className="min-w-fit w-1/2 max-w-md flex flex-col border-2 rounded p-4"
      method="post"
    >
      <h2 className="mt-0 mb-2">Sign Up</h2>
      <label htmlFor="email">Email</label>
      <Input type="email" name="email" />
      <label htmlFor="password" className="mt-2">
        Password
      </label>
      <Input type="password" name="password" />
      <label htmlFor="confirmPassword" className="mt-2">
        Confirm Password
      </label>
      <Input type="password" name="confirmPassword" />
      <hr className="my-4" />
      <Button type="submit">Sign Up</Button>
      <sub className="mt-4 text-center text-slate-500">
        Already have an account? <Link to="/auth/login">Log in</Link>.
      </sub>
    </Form>
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
