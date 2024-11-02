import { useEffect, useState } from "react";
import { useTasks } from "../context/TaskContext";
import TaskCard from "../components/TaskCard";

function TasksPage() {
  const { getTasks, tasks, deleteTask } = useTasks();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
    } catch (error) {
      console.log("Error al eliminar la tarea:", error);
    }
  };

  if (loading) return <p>Cargando tareas...</p>;
  if (error) return <p>{error}</p>;
  if (!tasks.length) return <p>No hay tareas</p>;

  console.log(tasks);

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
      {tasks.map((task) => (
        <TaskCard key={task._id} task={task} onDelete={handleDelete} />
      ))}
    </div>
  );
}

export default TasksPage;
