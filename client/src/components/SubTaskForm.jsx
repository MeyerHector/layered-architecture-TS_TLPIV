'use client'

import React from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";


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
    setOpenModal(false);
  };

  const handleClose = () => {
    setSubTasks(subTasks.filter((_, index) => index !== i));
    setOpenModal(false);
    reset();
  };

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{subTasks[i].title !== "" ? "Editar subtarea" : "Agregar subtarea"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubTaskSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              placeholder="Título de la subtarea"
              {...register("title", {
                required: "Este campo es requerido",
              })}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Descripción de la subtarea"
              {...register("description", {
                required: "Este campo es requerido",
              })}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="destructive" onClick={handleClose}>
              Borrar
            </Button>
            <Button type="submit">
              {subTasks[i].title !== "" ? "Editar" : "Agregar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SubTaskForm;