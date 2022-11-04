import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  cookieAccessToken,
  cookieIdToken,
  cookieRefreshToken,
} from "~/auth.server";

export const loader: LoaderFunction = async () => {
  const headers = new Headers();
  const [accessString, idString, refreshString] = await Promise.all([
    cookieAccessToken.serialize("", { expires: new Date() }),
    cookieIdToken.serialize("", { expires: new Date() }),
    cookieRefreshToken.serialize("", { expires: new Date() }),
  ]);

  headers.append("Set-Cookie", accessString);
  headers.append("Set-Cookie", idString);
  headers.append("Set-Cookie", refreshString);

  return redirect("/", {
    headers,
  });
};
