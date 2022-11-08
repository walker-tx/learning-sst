import { Cognito, Config, StackContext } from "@serverless-stack/resources";

export function AuthStack({ stack, app }: StackContext): Cognito {
  const auth = new Cognito(stack, "Auth", {
    login: ["email"],
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
