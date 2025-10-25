"use client";

import { getTasksByUser } from "@/services/getTasksByUser";
import { addTask } from "@/services/addTask";
import { deleteTasks } from "@/services/deleteTasks";
import { updateTask } from "@/services/updateTask";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Task } from "@/domain/tasks";
import { LoadingRows } from "./LoadingRows";
import { EmptyState } from "./EmptyState";
import { Footer } from "./Footer";
import { TaskItem } from "./TaskItem";
import { TaskTableFilter } from "./domain";

const TasksTable = () => {
  const { data: session } = useSession({ required: false });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState<TaskTableFilter>(TaskTableFilter.All);
  const [isLoading, setIsLoading] = useState(true);

  const filteredTasks = tasks.filter(task => {
    if (filter === TaskTableFilter.Active) {
      return !task.isCompleted;
    }

    if (filter === TaskTableFilter.Completed) {
      return task.isCompleted;
    }

    return true;
  });
  const activeTasksCount = tasks.filter(task => !task.isCompleted).length;
  const completedTasksCount = tasks.filter(task => task.isCompleted).length;

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const fetchedTasks = await getTasksByUser({
          userSub: session?.user?.sub as string,
          idToken: session?.idToken as string,
        });

        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        // TODO: Show error message to user
      }

      setIsLoading(false);
    };

    fetchTasks();
  }, [session?.user?.sub]);

  const handleAddTask = async () => {
    if (inputValue.trim() === "") {
      return;
    }

    try {
      const newTaskData = {
        id: crypto.randomUUID(),
        text: inputValue,
        isCompleted: false,
      };

      const createdTask = await addTask({
        userSub: session?.user?.sub as string,
        idToken: session?.idToken as string,
        task: newTaskData,
      });

      setTasks([createdTask, ...tasks]);
      setInputValue("");
    } catch (error) {
      console.error("Failed to add task:", error);
      // TODO: Show error message to user
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTasks({
        userSub: session?.user?.sub as string,
        idToken: session?.idToken as string,
        taskIds: [id],
      });

      const newTasks = tasks.filter(task => task.id !== id);

      setTasks(newTasks);
    } catch (error) {
      console.error("Failed to delete task:", error);
      // TODO: Show error message to user
    }
  };

  const handleToggleCompleteTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);

    if (!task) {
      return;
    }

    try {
      const updatedTask = await updateTask({
        userSub: session?.user?.sub as string,
        idToken: session?.idToken as string,
        taskId: id,
        propertiesToUpdate: {
          isCompleted: !task.isCompleted,
        },
      });

      const newTasks = tasks.map(t => {
        if (t.id === id) {
          return updatedTask;
        }

        return t;
      });

      setTasks(newTasks);
    } catch (error) {
      console.error("Failed to update task:", error);
      // TODO: Show error message to user
    }
  };

  const handleDeleteAllCompleted = async () => {
    const completedTaskIds = tasks.filter(task => task.isCompleted).map(task => task.id);

    if (completedTaskIds.length === 0) {
      return;
    }

    try {
      await deleteTasks({
        userSub: session?.user?.sub as string,
        idToken: session?.idToken as string,
        taskIds: completedTaskIds,
      });

      const newTasks = tasks.filter(task => !task.isCompleted);

      setTasks(newTasks);
    } catch (error) {
      console.error("Failed to delete completed tasks:", error);
      // TODO: Show error message to user
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddTask();
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col h-full max-h-[700px] bg-white rounded-lg shadow-lg overflow-hidden">
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
          onClick={handleAddTask}
          className="px-6 py-3 bg-fuchsia-500 hover:bg-fuchsia-600 text-white font-medium rounded-lg transition-colors"
        >
          Add
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setFilter(TaskTableFilter.All)}
          className={`flex-1 py-3 text-center font-medium transition-colors ${
            filter === TaskTableFilter.All
              ? "bg-fuchsia-50 text-fuchsia-600 border-b-2 border-fuchsia-600"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          All ({tasks.length})
        </button>

        <button
          onClick={() => setFilter(TaskTableFilter.Active)}
          className={`flex-1 py-3 text-center font-medium transition-colors ${
            filter === TaskTableFilter.Active
              ? "bg-fuchsia-50 text-fuchsia-600 border-b-2 border-fuchsia-600"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          Active ({activeTasksCount})
        </button>

        <button
          onClick={() => setFilter(TaskTableFilter.Completed)}
          className={`flex-1 py-3 text-center font-medium transition-colors ${
            filter === TaskTableFilter.Completed
              ? "bg-fuchsia-50 text-fuchsia-600 border-b-2 border-fuchsia-600"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          Completed ({completedTasksCount})
        </button>
      </div>

      {/* Task List */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {isLoading && <LoadingRows />}

        {!isLoading && filteredTasks.length === 0 && <EmptyState filter={filter} />}

        {!isLoading && filteredTasks.length > 0 && (
          <ul>
            {filteredTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={handleToggleCompleteTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </ul>
        )}
      </div>

      {!isLoading && tasks.length > 0 && (
        <Footer
          activeTasksCount={activeTasksCount}
          completedTasksCount={completedTasksCount}
          onDeleteAllCompleted={handleDeleteAllCompleted}
        />
      )}
    </div>
  );
};

export { TasksTable };
