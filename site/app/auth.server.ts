import {
  AuthFlowType,
  ChallengeNameType,
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  InitiateAuthCommand,
  RespondToAuthChallengeCommand,
  SignUpCommand,
  GetUserCommand,
  ResendConfirmationCodeCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { redirect } from "@remix-run/node";
import Srp from "aws-cognito-srp-client";

const client = new CognitoIdentityProviderClient({ region: "us-east-1" });

/**
 * Signs a user in via cognito. Stores the access, id, and refresh tokens in cookies,
 * then redirects if successful.
 *
 * @param username
 * @param password
 * @returns Redirect
 */
export const authenticate = async (username: string, password: string) => {
  const srp = new Srp(process.env.REMIX_APP_AWS_USER_POOL_ID!);
  const SRP_A = srp.getA();

  const initiateAuthCommand = new InitiateAuthCommand({
    AuthFlow: AuthFlowType.USER_SRP_AUTH,
    AuthParameters: {
      USERNAME: username,
      SRP_A,
    },
    ClientId: process.env.REMIX_APP_AWS_USER_POOL_CLIENT_ID,
  });

  const initiateAuthResult = await client.send(initiateAuthCommand);

  const { SRP_B, SALT, SECRET_BLOCK, USERNAME } =
    initiateAuthResult.ChallengeParameters!;

  const { signature, timestamp } = srp.getSignature(
    USERNAME,
    SRP_B,
    SALT,
    SECRET_BLOCK,
    password
  );

  const respondToAuthChallengeCommand = new RespondToAuthChallengeCommand({
    ClientId: process.env.REMIX_APP_AWS_USER_POOL_CLIENT_ID!,
    ChallengeName: ChallengeNameType.PASSWORD_VERIFIER,
    ChallengeResponses: {
      PASSWORD_CLAIM_SIGNATURE: signature,
      PASSWORD_CLAIM_SECRET_BLOCK: SECRET_BLOCK,
      TIMESTAMP: timestamp,
      USERNAME,
      PASSWORD: password,
    },
  });

  const challengeResult = await client.send(respondToAuthChallengeCommand);

  return challengeResult.AuthenticationResult;
};

export const signUp = async (username: string, password: string) => {
  const signUpCommand = new SignUpCommand({
    ClientId: process.env.REMIX_APP_AWS_USER_POOL_CLIENT_ID,
    Username: username,
    Password: password,
  });

  const res = await client.send(signUpCommand);

  if (res.$metadata.httpStatusCode === 200) {
    return redirect(`/auth/confirm?un=${encodeURIComponent(username)}`);
  }
};

export const confirmSignUp = async (username: string, code: string) => {
  const confirmSignUpCommand = new ConfirmSignUpCommand({
    ClientId: process.env.REMIX_APP_AWS_USER_POOL_CLIENT_ID,
    Username: username,
    ConfirmationCode: code,
  });

  return client.send(confirmSignUpCommand);
};

export const resendConfirmationCode = async (username: string) => {
  const resendConfirmationCommand = new ResendConfirmationCodeCommand({
    ClientId: process.env.REMIX_APP_AWS_USER_POOL_CLIENT_ID,
    Username: username,
  });

  return client.send(resendConfirmationCommand);
};

/**
 * Gets a current user based on an access token stored in cookies
 */
export const getCurrentUser = async (accessToken: string) => {
  const getUserCommand = new GetUserCommand({ AccessToken: accessToken });

  return await client.send(getUserCommand);
};
