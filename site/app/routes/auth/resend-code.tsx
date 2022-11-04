import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData, useTransition } from "@remix-run/react";
import { useMemo } from "react";
import { resendConfirmationCode } from "~/auth.server";
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

  if (!email) {
    throw Error("Invalid input");
  }

  /**
   * ResendResult Failure Cases:
   * - The account doesn't exist.
   * - The account has already been confirmed.
   */
  const resendResult = await resendConfirmationCode(email);

  if (resendResult.$metadata.httpStatusCode !== 200) {
    throw Error("There was a problem sending the error code.");
  }

  return redirect(`/auth/confirm?un=${encodeURIComponent(email)}`);
};

export default () => {
  const loaderData = useLoaderData();
  const transition = useTransition();

  const formDisabled = useMemo(() => {
    return transition.state !== "idle";
  }, [transition.state]);

  return (
    <Form
      className="min-w-fit w-1/2 max-w-md flex flex-col border-2 rounded p-4"
      method="post"
    >
      <h2 className="mt-0 mb-2">Resend Confirmation</h2>
      <label htmlFor="email" className="mt-2">
        Email
      </label>
      <fieldset className="flex flex-col" disabled={formDisabled}>
        <Input
          type="email"
          name="email"
          defaultValue={loaderData?.username || undefined}
        />
        <hr className="my-4" />
        <Button type="submit">
          {transition.state === "idle" ? "Send Code" : "Loading..."}
        </Button>
      </fieldset>
      <sub className="mt-4 mb-2 text-center text-slate-500">
        Already have a code? <Link to="/auth/confirm">Click here</Link>.
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
