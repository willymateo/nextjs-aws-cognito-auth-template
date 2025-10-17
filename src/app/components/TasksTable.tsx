"use client";

import { getTasksByUser } from "@/services/getTasksByUser";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Task } from "@/domain/tasks";

enum Filter {
  All = "all",
  Active = "active",
  Completed = "completed",
}

const TasksTable = () => {
  const { data: session } = useSession({ required: true });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState<Filter>(Filter.All);

  useEffect(() => {
    const fetchTasks = async () => {
      const fetchedTasks = await getTasksByUser({
        userSub: session?.user?.sub as string,
        idToken: session?.idToken as string,
      });

      setTasks(fetchedTasks);
    };

    fetchTasks();
  }, [session?.user?.sub]);

  const addTask = () => {
    if (inputValue.trim() === "") {
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      text: inputValue,
      completed: false,
      createdAt: new Date(),
    };

    setTasks([newTask, ...tasks]);
    setInputValue("");
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const clearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === Filter.Active) {
      return !task.completed;
    }

    if (filter === Filter.Completed) {
      return task.completed;
    }

    return true;
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  const activeTasksCount = tasks.filter(task => !task.completed).length;
  const completedTasksCount = tasks.filter(task => task.completed).length;

  return (
    <div className="flex-1 w-full flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Input Section */}
      <div className="p-6 border-b border-gray-200 flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What needs to be done?"
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
        />
        <button
          onClick={addTask}
          className="px-6 py-3 bg-fuchsia-500 hover:bg-fuchsia-600 text-white font-medium rounded-lg transition-colors"
        >
          Add
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setFilter(Filter.All)}
          className={`flex-1 py-3 text-center font-medium transition-colors ${
            filter === Filter.All
              ? "bg-fuchsia-50 text-fuchsia-600 border-b-2 border-fuchsia-600"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          All ({tasks.length})
        </button>

        <button
          onClick={() => setFilter(Filter.Active)}
          className={`flex-1 py-3 text-center font-medium transition-colors ${
            filter === Filter.Active
              ? "bg-fuchsia-50 text-fuchsia-600 border-b-2 border-fuchsia-600"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          Active ({activeTasksCount})
        </button>

        <button
          onClick={() => setFilter(Filter.Completed)}
          className={`flex-1 py-3 text-center font-medium transition-colors ${
            filter === Filter.Completed
              ? "bg-fuchsia-50 text-fuchsia-600 border-b-2 border-fuchsia-600"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          Completed ({completedTasksCount})
        </button>
      </div>

      {/* Task List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <svg
              className="mx-auto h-12 w-12 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="text-lg font-medium">
              {filter === Filter.All && "No tasks yet"}
              {filter === Filter.Active && "No active tasks"}
              {filter === Filter.Completed && "No completed tasks"}
            </p>
            <p className="text-sm mt-1">
              {filter === Filter.All && "Add your first task to get started!"}
              {filter === Filter.Active && "All caught up!"}
              {filter === Filter.Completed && "Complete some tasks to see them here"}
            </p>
          </div>
        ) : (
          <ul>
            {filteredTasks.map(task => (
              <li
                key={task.id}
                className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 p-4">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="w-5 h-5 text-fuchsia-600 border-gray-300 rounded focus:ring-fuchsia-500 cursor-pointer"
                  />
                  <span
                    className={`flex-1 ${
                      task.completed ? "line-through text-gray-400" : "text-gray-700"
                    }`}
                  >
                    {task.text}
                  </span>
                  <button
                    onClick={() => deleteTask(task.id)}
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
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      {tasks.length > 0 && (
        <div className="p-4 bg-gray-50 flex items-center justify-between text-sm">
          <span className="text-gray-600">
            {activeTasksCount} {activeTasksCount === 1 ? "item" : "items"} left
          </span>
          {completedTasksCount > 0 && (
            <button
              onClick={clearCompleted}
              className="text-red-500 hover:text-red-700 font-medium transition-colors"
            >
              Clear completed
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export { TasksTable };
