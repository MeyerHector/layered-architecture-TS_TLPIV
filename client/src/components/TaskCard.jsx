import { Link } from "react-router-dom";
import { useTasks } from "../context/TaskContext";
import days from "dayjs";
import utc from "dayjs/plugin/utc";
days.extend(utc);

function TaskCard({ task }) {
  const { deleteTask, getTasks, markTaskAsCompletedOrNot } = useTasks();

  const handleDelete = async () => {
    await deleteTask(task.id);
    await getTasks();
  };

  const handleComplete = async () => {
    await markTaskAsCompletedOrNot(task.id);
    await getTasks();
  };
  return (
    <div
      className={`p-4 rounded-md shadow-md ${
        task.completed ? "bg-gray-800" : "bg-gray-700"
      }`}
    >
      <header className="flex justify-between">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleComplete}
          className="mr-2 h-6 w-6 rounded-md cursor-pointer border-2 border-gray-500"
        />
        <h1 className="text-2xl font-bold">{task.title}</h1>
        <div className="flex gap-x-2 items-center">
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
          >
            <i class="fa-solid fa-delete-left"></i>
          </button>
          <Link
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            to={`/tasks/${task.id}`}
          >
            <i class="fa-solid fa-pen-to-square"></i>
          </Link>
        </div>
      </header>
      <p className="text-slate-300">{task.description}</p>
      <p>{days(task.date).utc().format("DD/MM/YYYY")}</p>
    </div>
  );
}

export default TaskCard;
