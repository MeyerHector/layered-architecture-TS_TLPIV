import { Dialog } from "@mui/material";
import React from "react";
import { set, useForm } from "react-hook-form";

const SubTaskForm = ({ openModal, setOpenModal, i, subTasks, setSubTasks }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: subTasks[i] });

  const onSubTaskSubmit = (data) => {
    const updatedSubTasks = [...subTasks];
    updatedSubTasks[i] = {
      title: data.title,
      description: data.description,
      submit: true,
    };
    setSubTasks(updatedSubTasks);
  };
  return (
    <Dialog
      open={openModal}
      onClose={() => {
        setSubTasks(subTasks.filter((subTask, index) => index !== i));
        setOpenModal(false);
        reset();
      }}
    >
      <form
        className="bg-zinc-800 p-5  text-white"
        onSubmit={handleSubmit(onSubTaskSubmit)}
      >
        <h2 className="text-2xl font-bold ">Agregar subtarea</h2>
        <div className="title">
          <label htmlFor="title">Título</label>
          <input
            type="text"
            placeholder="Title"
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
            {...register(`title`, {
              required: "Este campo es requerido",
            })}
          />
          {errors.title && (
            <p className="text-red-500 text-xs italic">
              {errors.title.message}
            </p>
          )}
        </div>
        <div className="description">
          <label htmlFor="description">Descripción</label>
          <textarea
            rows="3"
            placeholder="Description"
            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
            {...register(`description`, {
              required: "Este campo es requerido",
            })}
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-xs italic">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="flex justify-end mt-2">
          <button
            onClick={() => {
              setSubTasks(subTasks.filter((subTask, index) => index !== i));
            }}
            className="bg-red-500 px-3 py-1 rounded-md mr-2"
          >
            Borrar
          </button>
          <button type="submit" className="bg-indigo-500 px-3 py-1 rounded-md ">
            {subTasks[i].title !== "" ? "Editar" : "Agregar"}
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default SubTaskForm;
