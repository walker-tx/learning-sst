import { Cognito, StackContext } from "@serverless-stack/resources";

export function AuthStack({ stack, app }: StackContext): Cognito {
  const auth = new Cognito(stack, "Auth", {
    login: ["email"],
  });

  stack.addOutputs({
    Region: app.region,
    UserPoolId: auth.userPoolId,
    IdentityPoolId: auth.cognitoIdentityPoolId!,
    UserPoolClientId: auth.userPoolClientId,
  });

  return auth;
}
