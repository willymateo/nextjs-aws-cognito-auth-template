import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { createDynamoDBDocumentClient } from "@/libs/dynamoDB";
import { Task, UpdatableTaskProperties } from "@/domain/tasks";

type UpdateTaskParams = {
  userSub: string;
  idToken: string;
  taskId: string;
  propertiesToUpdate: UpdatableTaskProperties;
};

const updateTask = async ({
  userSub,
  idToken,
  taskId,
  propertiesToUpdate,
}: UpdateTaskParams): Promise<Task> => {
  try {
    const dynamoDBDocumentClient = createDynamoDBDocumentClient({ idToken });

    // Build update expression dynamically based on provided fields
    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    // Always update the updatedAt timestamp
    updateExpressions.push("#updatedAt = :updatedAt");
    expressionAttributeNames["#updatedAt"] = "updatedAt";
    expressionAttributeValues[":updatedAt"] = new Date().toISOString();

    // Add other fields to update
    if (propertiesToUpdate.text !== undefined) {
      updateExpressions.push("#text = :text");
      expressionAttributeNames["#text"] = "text";
      expressionAttributeValues[":text"] = propertiesToUpdate.text;
    }

    if (propertiesToUpdate.isCompleted !== undefined) {
      updateExpressions.push("#isCompleted = :isCompleted");
      expressionAttributeNames["#isCompleted"] = "isCompleted";
      expressionAttributeValues[":isCompleted"] = propertiesToUpdate.isCompleted;
    }

    const command = new UpdateCommand({
      TableName: process.env.NEXT_PUBLIC_AWS_COMMUNITY_DAY_DATA_DYNAMODB_TABLE_NAME,
      Key: {
        PK: `user_sub#${userSub}`,
        SK: `task#${taskId}`,
      },
      UpdateExpression: `SET ${updateExpressions.join(", ")}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    });

    const response = await dynamoDBDocumentClient.send(command);

    if (!response.Attributes) {
      throw new Error("Task not found or update failed");
    }

    const updatedTask: Task = {
      id: response.Attributes.id,
      text: response.Attributes.text,
      isCompleted: response.Attributes.isCompleted,
      createdAt: response.Attributes.createdAt,
      updatedAt: response.Attributes.updatedAt,
    };

    return updatedTask;
  } catch (error) {
    console.error("Error updating task in DynamoDB:", error);

    throw error;
  }
};

export { updateTask };
export type { UpdateTaskParams };
