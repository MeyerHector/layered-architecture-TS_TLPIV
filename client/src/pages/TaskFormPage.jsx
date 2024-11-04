import { useForm } from "react-hook-form";
import { useTasks } from "../context/TaskContext";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

function TaskFormPage() {
  const { register, handleSubmit, setValue } = useForm();
  const { addTask, getTaskById, updateTask } = useTasks();
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    async function loadTask() {
      if (params.id) {
        const tasks = await getTaskById(params.id);
        console.log(tasks);
        setValue("title", tasks.title);
        setValue("description", tasks.description);
        setValue("date", dayjs(tasks.date).utc().format());
        setValue("importance", tasks.importance); 
      }
    }
    loadTask();
  }, []);

  const onSubmit = handleSubmit(async (data) => {
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
  });

  return (
    <div className="flex h-[calc(100vh-100px)] items-center justify-center">
      <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md">
        <form onSubmit={onSubmit}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            placeholder="Title"
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
            {...register("title")}
            autoFocus
          />
          
          <label htmlFor="description">Description</label>
          <textarea
            rows="3"
            placeholder="Description"
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
            {...register("description")}
          ></textarea>
          
          <label htmlFor="date">Date</label>
          <input
            type="date"
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
            {...register("date")}
          />

          {/* Nuevo input para la importancia */}
          <label htmlFor="importance">Importance</label>
          <select
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
            {...register("importance")}
          >
            <option value="BAJA">Baja</option>
            <option value="MEDIA">Media</option>
            <option value="ALTA">Alta</option>
            <option value="URGENTE">Urgente</option>
          </select>

          <button className="bg-indigo-500 px-3 py-2 rounded-md">Save</button>
        </form>
      </div>
    </div>
  );
}

export default TaskFormPage;
