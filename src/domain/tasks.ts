type Task = {
  id: string;
  text: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
};

type UpdatableTaskProperties = Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>;

export type { Task, UpdatableTaskProperties };
