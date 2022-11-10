import { Dynamo } from "dynamodb-onetable/Dynamo";
import { OneSchema, Entity, Table } from "dynamodb-onetable";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export const Schema = {
  format: "onetable:1.1.0",
  version: "0.0.1",
  indexes: {
    primary: { hash: "pk", sort: "sk" },
  },
  models: {
    UserProfile: {
      pk: { type: String, value: "${_type}:${id}" },
      sk: { type: String, value: "${_type}:" },
      id: { type: String, generate: "uuid" },
      email: { type: String, required: true, unique: true },
      profileImage: { type: String },
      firstName: { type: String },
      lastName: { type: String },
      tagLine: { type: String },
      bio: { type: String },
    } as const,
  } as const,
};

export type UserProfileType = Entity<typeof Schema.models.UserProfile>;

const client = new Dynamo({ client: new DynamoDBClient({}) });

export const createTableClient = (tableName: string) =>
  new Table({
    client,
    name: tableName,
    schema: Schema,
    partial: true,
  });
