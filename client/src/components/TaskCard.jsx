import { Link } from "react-router-dom";
import { useTasks } from "../context/TaskContext";
import days from "dayjs";
import utc from 'dayjs/plugin/utc';
days.extend(utc);

function TaskCard({ task }) {
  const { deleteTask } = useTasks();

  const handleDelete = async () => {
    await deleteTask(task.id); 
  };

  return (
    <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md">
      <header className="flex justify-between">
        <h1 className="text-2xl font-bold">{task.title}</h1>
        <div className="flex gap-x-2 items-center">
          <button
            onClick={handleDelete} 
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
          >
            Eliminar
          </button>
          <Link 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            to={`/tasks/${task.id}`}> 
            Editar
          </Link>
        </div>
      </header>
      <p className="text-slate-300">{task.description}</p>
      <p>{days(task.date).utc().format('DD/MM/YYYY')}</p>
    </div>
  );
}


export default TaskCard;
