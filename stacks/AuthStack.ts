import { Cognito, Config, StackContext } from "@serverless-stack/resources";
import { getStringParameter } from "./helpers";

export function AuthStack({ stack, app }: StackContext): Cognito {
  const TABLE_ONETABLE_NAME = getStringParameter(
    { stack, app },
    "TABLE_ONETABLE_NAME"
  );

  const auth = new Cognito(stack, "Auth", {
    login: ["email"],
    triggers: {
      postConfirmation: {
        handler: "functions/auth-post-confirm.handler",
        environment: { TABLE_ONETABLE_NAME },
        permissions: ["dynamodb"],
      },
    },
  });

  new Config.Parameter(stack, "AUTH_USER_POOL_ID", { value: auth.userPoolId });
  new Config.Parameter(stack, "AUTH_IDENTITY_POOL_ID", {
    value: auth.cognitoIdentityPoolId!,
  });
  new Config.Parameter(stack, "AUTH_USER_POOL_CLIENT_ID", {
    value: auth.userPoolClientId,
  });

  stack.addOutputs({
    Region: app.region,
    UserPoolId: auth.userPoolId,
    IdentityPoolId: auth.cognitoIdentityPoolId!,
    UserPoolClientId: auth.userPoolClientId,
  });

  return auth;
}
