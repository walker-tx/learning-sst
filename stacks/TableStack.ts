import { Table, StackContext, Config } from "@serverless-stack/resources";
import { appendFile } from "fs";

export function TableStack({ stack, app }: StackContext) {
  const table = new Table(stack, "OneTable", {
    fields: {
      pk: "string",
      sk: "string",
      id: "string",
      email: "string",
      profileImage: "string",
      firstName: "string",
      lastName: "string",
      tagLine: "string",
      bio: "string",
      _type: "string",
    },
    primaryIndex: {
      partitionKey: "pk",
      sortKey: "sk",
    },
  });

  new Config.Parameter(stack, "TABLE_ONETABLE_NAME", {
    value: table.tableName,
  });

  stack.addOutputs({
    TableName: table.tableName,
    TableArn: table.tableArn,
  });
}
