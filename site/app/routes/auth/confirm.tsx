import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData, useTransition } from "@remix-run/react";
import { useMemo } from "react";
import { confirmSignUp } from "~/auth.server";
import Button from "~/components/button";
import Input from "~/components/input";

export const loader: LoaderFunction = async ({ request, params, context }) => {
  const url = new URL(request.url);
  const un = url.searchParams.get("un");

  if (!un) return null;

  return json({ username: decodeURIComponent(un) });
};

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  const email = body.get("email") as string | null;
  const code = body.get("code") as string | null;

  if (!email || !code) {
    throw Error("Invalid input");
  }

  const res = await confirmSignUp(email, code);
  if (res.$metadata.httpStatusCode !== 200) {
    // return an error or something...
  }

  return redirect("/auth/login");
};

export default () => {
  const loaderData = useLoaderData();
  const transition = useTransition();

  const formDisabled = useMemo(() => {
    return transition.state !== "idle";
  }, [transition]);

  return (
    <Form
      className="min-w-fit w-1/2 max-w-md flex flex-col border-2 rounded p-4"
      method="post"
      contentEditable={false}
    >
      <h2 className="mt-0 mb-2">Account Confirmation</h2>
      <p className="prose-sm mb-0 bg-blue-200 border-2 border-blue-300 p-2 rounded-md">
        Check your email inbox for a 6-digit confirmation code. Paste the code
        below.
      </p>
      <fieldset className="flex flex-col" disabled={formDisabled}>
        <label htmlFor="email" className="mt-2">
          Email
        </label>
        <Input
          type="email"
          name="email"
          defaultValue={loaderData?.username || undefined}
        />
        <label htmlFor="password" className="mt-2">
          Confirmation Code
        </label>
        <Input type="password" name="code" />
        <hr className="my-4" />
        <Button type="submit">
          {transition.state === "idle" ? "Confirm" : "Loading..."}
        </Button>
      </fieldset>
      <sub className="mt-4 mb-2 text-center text-slate-500">
        Need another code? <Link to="/auth/resend-code">Click here</Link>.
      </sub>
    </Form>
  );
};
