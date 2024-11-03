import React from "react";
import { useNoti } from "../hooks/useNoti";

const SubTaskCard = ({ subTask, subTasks, setSubTasks, i }) => {
  const noti = useNoti();
  const onDelete = () => {
    setSubTasks(subTasks.filter((subTask, index) => index !== i));
  };
  const onEdit = () => {
    if (subTasks.some((subTask) => !subTask.submit)) {
      noti(`Completa la subtarea actual antes de editar otra`, "info");
      return;
    }
    const updatedSubTasks = [...subTasks];
    updatedSubTasks[i] = {
      ...subTask,
      submit: false,
    };
    setSubTasks(updatedSubTasks);
  };
  return (
    <div className="bg-zinc-700 w-full px-3 py-2.5 rounded">
      <div className="flex justify-between">
        <span className=" break-all">{subTask.title}</span>
        <div className="flex gap-4">
          <button type="button" onClick={onDelete}>
            <i className="fas fa-times"></i>
          </button>
          <button type="button" onClick={onEdit}>
            <i className="fa-regular fa-pen-to-square"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubTaskCard;
