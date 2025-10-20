type FooterProps = {
  activeTasksCount: number;
  completedTasksCount: number;
  onDeleteAllCompleted: () => void;
};

const Footer = ({ activeTasksCount, completedTasksCount, onDeleteAllCompleted }: FooterProps) => {
  return (
    <div className="p-4 bg-gray-50 flex items-center justify-between text-sm">
      <span className="text-gray-600">
        {activeTasksCount} {activeTasksCount === 1 ? "item" : "items"} left
      </span>
      {completedTasksCount > 0 && (
        <button
          onClick={onDeleteAllCompleted}
          className="text-red-500 hover:text-red-700 font-medium transition-colors"
        >
          Clear completed
        </button>
      )}
    </div>
  );
};

export { Footer };
