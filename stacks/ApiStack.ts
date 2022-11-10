import {
  Api,
  ApiUserPoolAuthorizer,
  Cognito,
  Config,
  StackContext,
  use,
} from "@serverless-stack/resources";
import { AuthStack } from "./AuthStack";
import * as ssm from "aws-cdk-lib/aws-ssm";

export function ApiStack({
  stack,
  app,
}: StackContext): Api<Record<string, ApiUserPoolAuthorizer>> {
  const auth = use(AuthStack);

  // Auth params
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

  const api = new Api<Record<string, ApiUserPoolAuthorizer>>(stack, "Api", {
    authorizers: {
      jwt: {
        type: "user_pool",
        userPool: {
          id: AUTH_USER_POOL_ID,
          clientIds: [AUTH_USER_POOL_CLIENT_ID],
        },
      },
    },
    defaults: {
      authorizer: "jwt",
    },
    routes: {
      "GET /": "functions/lambda.handler",
    },
  });

  new Config.Parameter(stack, "API_ENDPOINT", { value: api.url });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  // Authorization
  auth.attachPermissionsForAuthUsers(stack, [api]);

  return api;
}
