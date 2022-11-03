import {
  AuthFlowType,
  ChallengeNameType,
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  RespondToAuthChallengeCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { createCookie, redirect } from "@remix-run/node";
import Srp from "aws-cognito-srp-client";

const cookieSettings = {
  maxAge: 60 * 60 * 30,
  secure: process.env.NODE_ENV === "production",
  secrets: [process.env.REMIX_APP_SESSION_SECRET!],
  httpOnly: true,
};

export const cookieAccessToken = createCookie(
  "cognitoAccessToken",
  cookieSettings
);
export const cookieIdToken = createCookie("cognitoIdToken", cookieSettings);
export const cookieRefreshToken = createCookie(
  "cognitoRefreshToken",
  cookieSettings
);

export const authenticate = async (username: string, password: string) => {
  const srp = new Srp(process.env.REMIX_APP_AWS_USER_POOL_ID!);
  const SRP_A = srp.getA();

  const client = new CognitoIdentityProviderClient({ region: "us-east-1" });

  const initiateAuthCommand = new InitiateAuthCommand({
    AuthFlow: AuthFlowType.USER_SRP_AUTH,
    AuthParameters: {
      USERNAME: username,
      // PASSWORD: password,
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

  const headers = new Headers();
  if (challengeResult.$metadata.httpStatusCode) {
    headers.append(
      "Set-Cookie",
      await cookieAccessToken.serialize({
        access_token: challengeResult.AuthenticationResult!.AccessToken,
      })
    );
    headers.append(
      "Set-Cookie",
      await cookieIdToken.serialize({
        id_token: challengeResult.AuthenticationResult!.IdToken,
      })
    );
    headers.append(
      "Set-Cookie",
      await cookieRefreshToken.serialize({
        refresh_token: challengeResult.AuthenticationResult!.RefreshToken,
      })
    );

    return redirect("/", { headers });
  }
};
