import React from "react";
import { useNoti } from "../hooks/useNoti";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { X, PenSquare } from "lucide-react";



const SubTaskCard = ({ subTask, subTasks, setSubTasks, i, setOpenModal }) => {
  const noti = useNoti();

  const onDelete = () => {
    setSubTasks(subTasks.filter((_, index) => index !== i));
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
    setOpenModal(true);
    setSubTasks(updatedSubTasks);
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium break-all mr-2">{subTask.title}</span>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={onDelete} aria-label="Delete subtask">
              <X className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onEdit} aria-label="Edit subtask">
              <PenSquare className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubTaskCard;