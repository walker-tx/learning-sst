import * as ssm from "aws-cdk-lib/aws-ssm";
import { Stack, App } from "@serverless-stack/resources";

export function getStringParameter(
  { stack, app }: { stack: Stack; app: App },
  paramName: string
): string {
  return ssm.StringParameter.valueForStringParameter(
    stack,
    `/sst/${app.name}/${stack.stage}/parameters/${paramName}`
  );
}
