import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { createDynamoDBDocumentClient } from "@/libs/dynamoDB";
import { Task } from "@/domain/tasks";

type GetTasksByUserParams = {
  userSub: string;
  idToken: string;
};

const parseItemToTask = (item: any): Task => ({
  id: item.id || "",
  text: item.text || "",
  isCompleted: item.isCompleted || false,
  createdAt: item.createdAt || "",
  updatedAt: item.updatedAt || "",
});

const getTasksByUser = async ({ userSub, idToken }: GetTasksByUserParams): Promise<Task[]> => {
  try {
    const dynamoDBDocumentClient = createDynamoDBDocumentClient({ idToken });

    const command = new QueryCommand({
      TableName: process.env.NEXT_PUBLIC_AWS_COMMUNITY_DAY_DATA_DYNAMODB_TABLE_NAME,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
      ExpressionAttributeValues: {
        ":pk": `user_sub#${userSub}`,
        ":skPrefix": "task#",
      },
    });

    const response = await dynamoDBDocumentClient.send(command);

    const userTasks: Task[] = response.Items?.map(parseItemToTask) ?? [];

    return userTasks;
  } catch (error) {
    console.error("Error querying user tasks from DynamoDB:", error);

    throw error;
  }
};

export { getTasksByUser };
export type { GetTasksByUserParams };
