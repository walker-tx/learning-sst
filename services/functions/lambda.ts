import {
  APIGatewayProxyHandlerV2,
  APIGatewayProxyHandler,
  APIGatewayProxyHandlerV2WithJWTAuthorizer,
} from "aws-lambda";

export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
  const requestDate = new Date(event.requestContext.timeEpoch);

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: `Hello, World! Your request was received on ${requestDate.toLocaleDateString()} at ${requestDate.toLocaleTimeString()}.`,
    }),
  };
};
