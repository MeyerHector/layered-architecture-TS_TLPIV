import { useForm } from "react-hook-form";
import { useTasks } from "../context/TaskContext";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import SubTaskForm from "../components/SubTaskForm";
import SubTaskCard from "../components/SubTaskCard";
import { useNoti } from "../hooks/useNoti";
dayjs.extend(utc);

function TaskFormPage() {
  const [openSubTaskForm, setOpenSubTaskForm] = useState(false);
  const { register, handleSubmit, setValue } = useForm();
  const { addTask, getTaskById, updateTask } = useTasks();
  const params = useParams();
  const navigate = useNavigate();
  const [subTasks, setSubTasks] = useState([]);
  const noti = useNoti();
  useEffect(() => {
    async function loadTask() {
      if (params.id) {
        const tasks = await getTaskById(params.id);
        console.log(tasks);
        setValue("title", tasks.title);
        setValue("description", tasks.description);
        setValue("date", dayjs(tasks.date).utc().format());
      }
    }
    loadTask();
  }, []);

  const onSubmit = async (data) => {
    data.subTasks = subTasks;
    const dataValid = {
      ...data,
      date: data.date ? dayjs.utc(data.date).format() : dayjs.utc().format(),
    };

    if (params.id) {
      await updateTask(params.id, dataValid);
    } else {
      await addTask(dataValid);
    }

    navigate("/tasks");
  };
  const addSubTask = () => {
    if (subTasks.some((subTask) => !subTask.submit)) {
      noti("Completa la subtarea actual antes de agregar otra", "info");
      return;
    } else if (subTasks.length === 8) {
      noti("No puedes agregar más de 8 subtareas", "info");
      return;
    }
    setOpenSubTaskForm(true);
    const newSubTask = { title: "", description: "", submit: false };
    setSubTasks([...subTasks, newSubTask]);
  };
  return (
    <div className="flex h-[calc(100vh-100px)] items-center justify-center">
      <div className="bg-zinc-800 w-3/4 h-3/4  p-5 rounded-md flex gap-5">
        <form onSubmit={handleSubmit(onSubmit)} className="m-w-none w-1/2">
          <h2 className="text-3xl font-bold mb-2">Nueva tarea</h2>
          <div className="title">
            <label htmlFor="title">Título</label>
            <input
              type="text"
              placeholder="Title"
              className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
              {...register("title")}
              autoFocus
            />
          </div>
          <div className="description" style={{ minHeight: "220px" }}>
            <label htmlFor="description">Descripción</label>
            <textarea
              rows="3"
              placeholder="Description"
              style={{ height: "170px", maxHeight: "170px" }}
              className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2 h-full"
              {...register("description")}
            ></textarea>
          </div>
          <div className="expiration">
            <label htmlFor="date">Fecha de vencimiento</label>
            <input
              type="date"
              className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
              {...register("date")}
            />
          </div>
          <button className="bg-indigo-500 px-3 py-1 rounded-md w-full mt-4">
            Guardar tarea
          </button>
        </form>
        <div className="flex flex-col gap-2 h-full w-1/2">
          <div className="flex justify-between">
            <span className="font-semibold text-xl">
              Subtareas {subTasks.length !== 0 && subTasks.length}{" "}
              {subTasks.length == 8 && "(MAX)"}
            </span>
            <button
              onClick={addSubTask}
              className="bg-indigo-500 px-2 py-1 rounded-md"
            >
              <i className="fa-solid fa-plus"></i>
            </button>
          </div>
          {subTasks.map((subTask, i) =>
            subTask.submit ? (
              <SubTaskCard
                key={i}
                subTask={subTask}
                subTasks={subTasks}
                setSubTasks={setSubTasks}
                i={i}
              />
            ) : (
              <SubTaskForm
                openModal={openSubTaskForm}
                setOpenModal={setOpenSubTaskForm}
                key={i}
                i={i}
                subTasks={subTasks}
                setSubTasks={setSubTasks}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskFormPage;
