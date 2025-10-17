import { BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
import { createDynamoDBDocumentClient } from "@/libs/dynamoDB";

type DeleteTasksParams = {
  userSub: string;
  idToken: string;
  taskIds: string[];
};

const deleteTasks = async ({ userSub, idToken, taskIds }: DeleteTasksParams): Promise<void> => {
  try {
    const dynamoDBDocumentClient = createDynamoDBDocumentClient({ idToken });
    const tableName = process.env.NEXT_PUBLIC_AWS_COMMUNITY_DAY_DATA_DYNAMODB_TABLE_NAME;

    // BatchWriteCommand can handle up to 25 items at a time
    const batchSize = 25;
    const batches = [];

    for (let i = 0; i < taskIds.length; i += batchSize) {
      const batchTaskIds = taskIds.slice(i, i + batchSize);

      const deleteRequests = batchTaskIds.map(taskId => ({
        DeleteRequest: {
          Key: {
            PK: `user_sub#${userSub}`,
            SK: `task#${taskId}`,
          },
        },
      }));

      const command = new BatchWriteCommand({
        RequestItems: {
          [tableName as string]: deleteRequests,
        },
      });

      batches.push(dynamoDBDocumentClient.send(command));
    }

    // Execute all batches in parallel
    await Promise.all(batches);
  } catch (error) {
    console.error("Error deleting tasks from DynamoDB:", error);

    throw error;
  }
};

export { deleteTasks };
export type { DeleteTasksParams };
