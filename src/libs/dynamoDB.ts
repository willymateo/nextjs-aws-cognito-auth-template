import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";

type CreateDynamoDBDocumentClientParams = {
  idToken: string;
};

const createDynamoDBDocumentClient = ({
  idToken,
}: CreateDynamoDBDocumentClientParams): DynamoDBDocumentClient => {
  const cognitoProviderUrl = `cognito-idp.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID}`;

  const dynamoDBClient = new DynamoDBClient({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    credentials: fromCognitoIdentityPool({
      identityPoolId: process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID as string,
      logins: {
        [cognitoProviderUrl]: idToken,
      },
    }),
  });

  return DynamoDBDocumentClient.from(dynamoDBClient);
};

export { createDynamoDBDocumentClient };
export type { CreateDynamoDBDocumentClientParams };
