import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { Amplify } from "aws-amplify";

export const loader: LoaderFunction = async () => {
  return json({
    env: {
      REMIX_APP_AWS_REGION: process.env.REMIX_APP_AWS_REGION!,
      REMIX_APP_AWS_USER_POOL_ID: process.env.REMIX_APP_AWS_USER_POOL_ID,
      REMIX_APP_AWS_USER_POOL_CLIENT_ID:
        process.env.REMIX_APP_AWS_USER_POOL_CLIENT_ID,
      REMIX_APP_AWS_IDENTITY_POOL_ID:
        process.env.REMIX_APP_AWS_IDENTITY_POOL_ID,
    },
  });
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  const loaderData = useLoaderData();

  Amplify.configure({
    aws_cognito_region: loaderData.env.REMIX_APP_AWS_REGION,
    aws_user_pools_id: loaderData.env.REMIX_APP_AWS_USER_POOL_ID,
    aws_user_pools_web_client_id:
      loaderData.env.REMIX_APP_AWS_USER_POOL_CLIENT_ID,
    aws_cognito_identity_pool_id: loaderData.env.REMIX_APP_AWS_IDENTITY_POOL_ID,
    aws_mandatory_sign_in: "enable",
    Auth: {
      identityPoolId: loaderData.env.REMIX_APP_AWS_IDENTITY_POOL_ID,
      region: loaderData.env.REMIX_APP_AWS_REGION,
      userPoolId: loaderData.env.REMIX_APP_AWS_USER_POOL_ID,
      userPoolWebClientId: loaderData.env.REMIX_APP_AWS_USER_POOL_CLIENT_ID,
      mandatorySignIn: true,
    },
    API: {
      endpoints: [
        {
          name: "api",
          region: loaderData.env.REMIX_APP_AWS_REGION,
          endpoint: loaderData.env.API_URL,
        },
      ],
    },
    ssr: true,
  });

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
