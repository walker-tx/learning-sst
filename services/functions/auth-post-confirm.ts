import { PostConfirmationTriggerHandler } from "aws-lambda";
import { createTableClient, UserProfileType } from "../table";

export const handler: PostConfirmationTriggerHandler = async (
  event,
  context,
  callback
) => {
  const table = createTableClient(process.env["TABLE_ONETABLE_NAME"]!);
  const userProfile = table.getModel<UserProfileType>("UserProfile");
  userProfile.create({
    id: event.userName,
    email: event.request.userAttributes.email,
  });

  callback(null, event);
};
