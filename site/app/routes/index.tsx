import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import { fetch } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { cookieAccessToken, getCurrentUser } from "~/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  const accessToken = await cookieAccessToken.parse(
    request.headers.get("cookie")
  );

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
        <h1>Remix + SST</h1>
        <h2>You're Authenticated!</h2>
        <p>
          User:{" "}
          <code>
            {
              currentUser.UserAttributes.find((a: any) => a.Name === "email")
                .Value
            }
          </code>
        </p>
        <h2>Message from Authenticated Lambda 🍪</h2>
        <p>{data.message}</p>
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
