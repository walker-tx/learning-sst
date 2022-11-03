import {
  StackContext,
  Api,
  RemixSite,
  use,
  ApiGatewayV1Api,
  ApiGatewayV1ApiAuthorizer,
  Cognito,
  ApiUserPoolAuthorizer,
} from "@serverless-stack/resources";
import { FunctionalStack } from "@serverless-stack/resources/dist/FunctionalStack";
import { ApiStack } from "./ApiStack";
import { AuthStack } from "./AuthStack";

export function SiteStack({ stack }: StackContext): RemixSite {
  const api = use<Api<Record<string, ApiUserPoolAuthorizer>>>(ApiStack);
  const auth = use<Cognito>(AuthStack);

  // -- FE STACK --
  const site = new RemixSite(stack, "Site", {
    path: "site/",
    environment: {
      API_URL: api.url,
      EXAMPLE: "example",
      REMIX_APP_AWS_REGION: stack.region,
      REMIX_APP_AWS_USER_POOL_ID: auth.userPoolId,
      REMIX_APP_AWS_IDENTITY_POOL_ID: auth.cognitoIdentityPoolId!,
      REMIX_APP_AWS_USER_POOL_CLIENT_ID: auth.userPoolClientId,
      REMIX_APP_SESSION_SECRET: process.env.SESSION_SECRET!,
    },
  });

  stack.addOutputs({
    URL: site.url,
    AuthUserPoolId: auth.userPoolId,
  });

  return site;
}
