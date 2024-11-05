'use client'

import { useForm } from "react-hook-form";
import { useTasks } from "../context/TaskContext";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SubTaskForm from "../components/SubTaskForm";
import SubTaskCard from "../components/SubTaskCard";
import { useNoti } from "../hooks/useNoti";
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { PlusIcon } from "lucide-react"

export default function TaskFormPage() {
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
        setValue("title", tasks.title);
        setValue("description", tasks.description);
        setValue("importance", tasks.importance)
        setValue("date", new Date(tasks.date).toISOString().split("T")[0]);
        setSubTasks(
          tasks.subTasks.map((subTask) => ({ ...subTask, submit: true }))
        );
      }
    }
    loadTask();
  }, []);

  const onSubmit = async (data) => {
    data.subTasks = subTasks;

    if (data.date < new Date().toISOString().split("T")[0]) {
      noti("La fecha de vencimiento no puede ser menor a la actual", "error");
      return;
    }

    if (params.id) {
      await updateTask(params.id, data);
    } else {
      await addTask(data);
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
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Nueva tarea</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-8">
            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 space-y-4">
              <div>
                <label htmlFor="title" className="text-sm font-medium text-gray-700">Título</label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Título de la tarea"
                  {...register("title")}
                  className="mt-1"
                  autoFocus
                />
              </div>
              <div>
                <label htmlFor="description" className="text-sm font-medium text-gray-700">Descripción</label>
                <Textarea
                  id="description"
                  placeholder="Descripción de la tarea"
                  {...register("description")}
                  className="mt-1"
                  rows={5}
                />
              </div>
              <div>
                <label htmlFor="importance" className="text-sm font-medium text-gray-700" style={{marginRight:7}}>Importancia</label>
                <select {...register("importance")}>
                  <option value="BAJA">Baja</option>
                  <option value="MEDIA">Media</option>
                  <option value="ALTA">Alta</option>
                  <option value="URGENTE">Urgente</option>
                </select>
              </div>
              <div>
                <label htmlFor="date" className="text-sm font-medium text-gray-700">Fecha de vencimiento</label>
                <Input
                  id="date"
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  {...register("date")}
                  className="mt-1"
                />
              </div>
              <Button type="submit" className="w-full">
                Guardar tarea
              </Button>
            </form>
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Subtareas {subTasks.length !== 0 && `(${subTasks.length})`}
                  {subTasks.length == 8 && " (MAX)"}
                </h3>
                <Button onClick={addSubTask} size="sm" disabled={subTasks.length >= 8}>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Agregar
                </Button>
              </div>
              <div className="space-y-2">
                {subTasks.map((subTask, i) =>
                  subTask.submit ? (
                    <SubTaskCard
                      key={i}
                      subTask={subTask}
                      subTasks={subTasks}
                      setSubTasks={setSubTasks}
                      setOpenModal={setOpenSubTaskForm}
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
        </CardContent>
      </Card>
    </div>
  );
}