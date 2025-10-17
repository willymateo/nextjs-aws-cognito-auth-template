import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { createDynamoDBDocumentClient } from "@/libs/dynamoDB";
import { Task } from "@/domain/tasks";

type AddTaskParams = {
  userSub: string;
  idToken: string;
  task: Omit<Task, "createdAt" | "updatedAt">;
};

const addTask = async ({ userSub, idToken, task }: AddTaskParams): Promise<Task> => {
  try {
    const dynamoDBDocumentClient = createDynamoDBDocumentClient({ idToken });

    const now = new Date().toISOString();
    const taskWithTimestamp: Task = {
      ...task,
      createdAt: now,
      updatedAt: now,
    };

    const item = {
      PK: `user_sub#${userSub}`,
      SK: `task#${task.id}`,
      id: task.id,
      text: task.text,
      isCompleted: task.isCompleted,
      createdAt: taskWithTimestamp.createdAt,
      updatedAt: taskWithTimestamp.updatedAt,
      item_type: "task",
    };

    const command = new PutCommand({
      TableName: process.env.NEXT_PUBLIC_AWS_COMMUNITY_DAY_DATA_DYNAMODB_TABLE_NAME,
      Item: item,
    });

    await dynamoDBDocumentClient.send(command);

    return taskWithTimestamp;
  } catch (error) {
    console.error("Error adding task to DynamoDB:", error);

    throw error;
  }
};

export { addTask };
export type { AddTaskParams };
