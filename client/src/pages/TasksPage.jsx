import { useEffect, useState } from "react";
import { useTasks } from "../context/TaskContext";
import TaskCard from "../components/TaskCard";

function TasksPage() {
  const { getTasks, tasks } = useTasks();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("all");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        await getTasks();
      } catch (err) {
        setError("Error al cargar las tareas");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [getTasks]);

  const filteredTasks = () => {
    const filtered = tasks.filter((task) => {
      if (view === "completed") return task.completed;
      if (view === "uncompleted") return !task.completed;
      return true;
    });
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <nav className="mb-4 flex justify-center space-x-4">
        <button
          onClick={() => setView("all")}
          className={`px-4 py-2 rounded-md ${
            view === "all"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Todas las tareas
        </button>
        <button
          onClick={() => setView("completed")}
          className={`px-4 py-2 rounded-md ${
            view === "completed"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Tareas completas
        </button>
        <button
          onClick={() => setView("uncompleted")}
          className={`px-4 py-2 rounded-md ${
            view === "uncompleted"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Tareas incompletas
        </button>
      </nav>
      <div className="grid grid-cols-1 gap-4">
        {filteredTasks().map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}

export default TasksPage;
