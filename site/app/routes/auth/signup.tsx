import { CognitoIdentityProviderServiceException } from "@aws-sdk/client-cognito-identity-provider";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import { signUp } from "~/auth.server";
import Button from "~/components/button";
import Input from "~/components/input";

export const loader: LoaderFunction = async () => {
  return null;
};

export const action: ActionFunction = async ({ request, context }) => {
  const body = await request.formData();
  const email = body.get("email") as string;
  const password = body.get("password") as string;

  try {
    await signUp(email, password);
    return redirect(`/auth/confirm?un=${encodeURIComponent(email)}`);
  } catch (err: any) {
    if (err instanceof CognitoIdentityProviderServiceException) {
      throw json(null, {
        status: err?.$metadata?.httpStatusCode || 400,
        statusText: err.message,
      });
    } else
      throw json(null, {
        status: 500,
        statusText: "Unknown error",
      });
  }
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
      <sub className="mt-4 mb-2 text-center text-slate-500">
        Already have an account? <Link to="/auth/login">Log in</Link>.
      </sub>
    </Form>
  );
};
