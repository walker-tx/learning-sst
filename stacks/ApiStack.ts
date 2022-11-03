import {
  Api,
  ApiUserPoolAuthorizer,
  Cognito,
  StackContext,
  use,
} from "@serverless-stack/resources";
import { AuthStack } from "./AuthStack";

export function ApiStack({
  stack,
}: StackContext): Api<Record<string, ApiUserPoolAuthorizer>> {
  const auth = use<Cognito>(AuthStack);

  const api = new Api<Record<string, ApiUserPoolAuthorizer>>(stack, "Api", {
    authorizers: {
      jwt: {
        type: "user_pool",
        userPool: {
          id: auth.userPoolId,
          clientIds: [auth.userPoolClientId],
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

  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  // Authorization
  auth.attachPermissionsForAuthUsers(stack, [api]);

  return api;
}
