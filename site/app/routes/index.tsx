import type { LoaderFunction } from "@remix-run/node";
import { fetch } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { cookieAccessToken } from "~/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  const accessToken = await cookieAccessToken.parse(
    request.headers.get("cookie")
  );

  const response = await fetch(process.env.API_URL!, {
    headers: {
      Authorization: `Bearer ${accessToken.access_token}`,
    },
  });

  if (!response.ok) throw new Error(response.statusText);

  return await response.json();
};

export default function Index() {
  const loaderData = useLoaderData<{ message: string }>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to Remix</h1>
      <p>{loaderData.message}</p>
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
