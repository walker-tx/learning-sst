import { ApiStack } from "./ApiStack";
import { App } from "@serverless-stack/resources";
import { SiteStack } from "./SiteStack";
import { AuthStack } from "./AuthStack";
import { TableStack } from "./TableStack";

export default function (app: App) {
  app.setDefaultFunctionProps({
    runtime: "nodejs16.x",
    srcPath: "services",
    bundle: {
      format: "esm",
    },
  });

  app.stack(AuthStack).stack(ApiStack).stack(SiteStack).stack(TableStack);
}
