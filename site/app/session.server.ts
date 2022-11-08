import { createCookie } from "@remix-run/node";

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
