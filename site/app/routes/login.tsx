import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";
import React from "react";
import { authenticate } from "~/auth.server";

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

export default function Index() {
  // const actionData = useActionData<{ user: any }>();
  const [email, setEmail] = React.useState<string>(
    "walker.b.lockard@gmail.com"
  );
  const [password, setPassword] = React.useState("Wl0ck@rd");

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <Form
        style={{ display: "flex", flexDirection: "column", maxWidth: 200 }}
        action="/login"
        method="post"
      >
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <input type="Submit" />
      </Form>
      {/* <button onClick={handleSubmit}>Submit</button> */}
      <h2>Message:</h2>
      {/* <p>{actionData}</p> */}
    </div>
  );
}

export const ErrorBoundary = ({ error }: { error: Error }) => {
  return (
    <>
      <h2>Problem!</h2>
      <p>{error.message}</p>
    </>
  );
};
