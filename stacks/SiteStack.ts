import {
  Api,
  ApiUserPoolAuthorizer,
  RemixSite,
  StackContext,
  use,
} from "@serverless-stack/resources";
import * as ssm from "aws-cdk-lib/aws-ssm";
import { ApiStack } from "./ApiStack";

export function SiteStack({ stack, app }: StackContext): RemixSite {
  const api = use<Api<Record<string, ApiUserPoolAuthorizer>>>(ApiStack);

  const AUTH_USER_POOL_ID = ssm.StringParameter.valueForStringParameter(
    stack,
    `/sst/${app.name}/${stack.stage}/parameters/AUTH_USER_POOL_ID`
  );
  const AUTH_IDENTITY_POOL_ID = ssm.StringParameter.valueForStringParameter(
    stack,
    `/sst/${app.name}/${stack.stage}/parameters/AUTH_IDENTITY_POOL_ID`
  );
  const AUTH_USER_POOL_CLIENT_ID = ssm.StringParameter.valueForStringParameter(
    stack,
    `/sst/${app.name}/${stack.stage}/parameters/AUTH_USER_POOL_CLIENT_ID`
  );

  // -- FE STACK --
  const site = new RemixSite(stack, "Site", {
    path: "site/",
    environment: {
      API_URL: api.url,
      EXAMPLE: "example",
      REMIX_APP_AWS_REGION: stack.region,
      REMIX_APP_AWS_USER_POOL_ID: AUTH_USER_POOL_ID,
      REMIX_APP_AWS_IDENTITY_POOL_ID: AUTH_IDENTITY_POOL_ID!,
      REMIX_APP_AWS_USER_POOL_CLIENT_ID: AUTH_USER_POOL_CLIENT_ID,
      REMIX_APP_SESSION_SECRET: process.env.SESSION_SECRET!,
    },
  });

  stack.addOutputs({
    URL: site.url,
    AuthUserPoolId: AUTH_USER_POOL_ID,
  });

  return site;
}
