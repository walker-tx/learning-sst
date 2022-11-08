import {
  CognitoIdentityProviderServiceException,
  UserNotFoundException,
} from "@aws-sdk/client-cognito-identity-provider";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useCatch, useTransition } from "@remix-run/react";
import { authenticate } from "~/auth.server";
import Button from "~/components/button";
import Input from "~/components/input";
import {
  cookieAccessToken,
  cookieIdToken,
  cookieRefreshToken,
} from "~/session.server";

export const loader: LoaderFunction = async () => {
  return null;
};

export const action: ActionFunction = async ({ request, context }) => {
  const body = await request.formData();
  const email = body.get("email");
  const password = body.get("password");

  try {
    const authResult = await authenticate(email as string, password as string);

    // If successful, serialize auth tokens w/ cookies
    const cookies = await Promise.all([
      cookieAccessToken.serialize(authResult?.AccessToken!),
      cookieIdToken.serialize(authResult?.AccessToken!),
      cookieRefreshToken.serialize(authResult?.AccessToken!),
    ]);

    const headers = new Headers();
    cookies.forEach((cookie) => headers.append("Set-Cookie", cookie));
    return redirect("/", { headers });
  } catch (err: any) {
    if (err instanceof CognitoIdentityProviderServiceException) {
      console.log("COGNITO EXCEPTION");
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
      <Input
        type="email"
        name="email"
        disabled={transition.state !== "idle"}
        required
      />
      <label htmlFor="password" className="mt-2">
        Password
      </label>
      <Input
        type="password"
        name="password"
        required
        disabled={transition.state !== "idle"}
      />
      <hr className="my-4" />
      <Button type="submit" disabled={transition.state !== "idle"}>
        {transition.state !== "idle" ? "Logging In..." : "Log In"}
      </Button>
      <sub className="mt-4 mb-2 text-center text-slate-500">
        Not a user yet? <Link to="/auth/signup">Sign up</Link>.
      </sub>
    </Form>
  );
};

export const CatchBoundary = () => {
  const caught = useCatch();

  if (caught.statusText === "UserNotConfirmedException")
    return (
      <div className="text-center min-w-fit w-1/2 max-w-md flex flex-col border-2 rounded p-4">
        <h1>Confirm Your Account</h1>
        <p>You need to confirm your account before you can log in.</p>
        <span>
          <Link to="/auth/confirm">Confirm your account</Link>.
        </span>
      </div>
    );

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
