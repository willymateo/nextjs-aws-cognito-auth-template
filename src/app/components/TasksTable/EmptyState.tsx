import { TaskTableFilter } from "./domain";

type EmptyStateProps = {
  filter: TaskTableFilter;
};

const EmptyState = ({ filter }: EmptyStateProps) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
      <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
      <p className="text-lg font-medium">
        {filter === TaskTableFilter.All && "No tasks yet"}
        {filter === TaskTableFilter.Active && "No active tasks"}
        {filter === TaskTableFilter.Completed && "No completed tasks"}
      </p>
      <p className="text-sm mt-1">
        {filter === TaskTableFilter.All && "Add your first task to get started!"}
        {filter === TaskTableFilter.Active && "All caught up!"}
        {filter === TaskTableFilter.Completed && "Complete some tasks to see them here"}
      </p>
    </div>
  );
};

export { EmptyState };
