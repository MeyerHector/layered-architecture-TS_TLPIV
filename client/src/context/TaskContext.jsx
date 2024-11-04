import { createContext, useContext, useState, useCallback } from "react";
import {
  addTaskRequest,
  getTasksRequest,
  deleteTaskRequest,
  getTaskByIdRequest,
  updateTaskRequest,
  markTaskAsCompletedOrNotRequest,
} from "../api/tasks";

const TaskContext = createContext();

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks debe estar dentro del proveedor TaskContext");
  }
  return context;
};

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);

  const getTasks = useCallback(async () => {
    try {
      const res = await getTasksRequest();
      setTasks(res.data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const addTask = async (task) => {
    try {
      const res = await addTaskRequest(task);
      console.log(res);
      setTasks((prevTasks) => [...prevTasks, res.data]);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTask = async (id) => {
    console.log(`Intentando eliminar tarea con ID: ${id}`);
    try {
      const res = await deleteTaskRequest(id);
      if (res.status === 204) {
        console.log(`Tarea con ID: ${id} eliminada.`);
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      }
    } catch (error) {
      console.log(`Error al eliminar tarea con ID: ${id}`, error);
    }
  };

  const getTaskById = async (id) => {
    try {
      const res = await getTaskByIdRequest(id);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const updateTask = async (id, task) => {
    try {
      const res = await updateTaskRequest(id, task);
      console.log(res);
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === id ? res.data : t))
      );
    } catch (error) {
      console.log(error);
    }
  };

  const markTaskAsCompletedOrNot = async (id) => {
    try {
      const res = await markTaskAsCompletedOrNotRequest(id);

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      );
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  const getAllCompletedTasks = () => {
    return tasks.filter((task) => task.completed);
  };

  const getAllUncompletedTasks = () => {
    return tasks.filter((task) => !task.completed);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        getTasks,
        getTaskById,
        deleteTask,
        updateTask,
        markTaskAsCompletedOrNot,
        getAllCompletedTasks,
        getAllUncompletedTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}
