import { Task } from "@/domain/tasks";

type TaskItemProps = {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
};

const TaskItem = ({ task, onToggleComplete, onDelete }: TaskItemProps) => {
  return (
    <li className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3 p-4">
        <input
          type="checkbox"
          checked={task.isCompleted}
          onChange={() => onToggleComplete(task.id)}
          className="w-5 h-5 text-fuchsia-600 border-gray-300 rounded focus:ring-fuchsia-500 cursor-pointer"
        />
        <span
          className={`flex-1 ${task.isCompleted ? "line-through text-gray-400" : "text-gray-700"}`}
        >
          {task.text}
        </span>
        <button
          onClick={() => onDelete(task.id)}
          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-colors"
          title="Delete task"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </li>
  );
};

export { TaskItem };
