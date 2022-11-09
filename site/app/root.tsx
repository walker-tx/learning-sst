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
import type { LinksFunction } from "@remix-run/node";
import twStyles from "./tailwind.css";
import faStyles from "@fortawesome/fontawesome-svg-core/styles.css";

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

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: twStyles },
  { rel: "stylesheet", href: faStyles },
];

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
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full w-full p-4 prose max-w-none">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
