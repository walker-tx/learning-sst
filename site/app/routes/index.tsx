import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import { fetch } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { cookieAccessToken, getCurrentUser } from "~/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  const accessToken = await cookieAccessToken.parse(
    request.headers.get("cookie")
  );

  if (!accessToken || accessToken === "") {
    return json({});
  }

  const response = await fetch(process.env.API_URL!, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) throw new Error(response.statusText);

  return json({
    currentUser: await getCurrentUser(accessToken),
    data: await response.json(),
  });
};

export default function Index() {
  const { data, currentUser } = useLoaderData();

  return (
    <div className="flex flex-col items-center">
      <div className="max-w-md border-2 rounded p-4 text-center flex flex-col justify-end">
        <section>
          <h1>SST-Deployed Site</h1>
          <p>
            This is a learning project for{" "}
            <a href="https://sst.dev" target="_blank" rel="noreferrer">
              SST
            </a>
            , a library used to provision AWS resources.
          </p>
        </section>

        {currentUser ? (
          <section>
            <h2>You're Logged In!</h2>
            <p>
              User:{" "}
              <pre className="my-2 mx-auto max-w-fit">
                <code>
                  {
                    currentUser.UserAttributes.find(
                      (a: any) => a.Name === "email"
                    ).Value
                  }
                </code>
              </pre>
            </p>
            <sub>
              <Link to="/auth/logout">Log Out</Link>.
            </sub>
          </section>
        ) : (
          <section>
            <h2>You're Not Logged In</h2>
            <p>
              <Link to="/auth/login">Log In</Link>
              <br />
              or
              <br />
              <Link to="/auth/signup">Sign Up</Link>.
            </p>
          </section>
        )}
        {data && (
          <section>
            <h2>Message from Authenticated Lambda 🍪</h2>
            <p>{data.message}</p>
          </section>
        )}
      </div>
    </div>
  );
}

export const ErrorBoundary = ({ error }: { error: Error }) => {
  return (
    <>
      <h2 className="prose prose-h1">Problem!</h2>
      <p>{error.message}</p>
    </>
  );
};
