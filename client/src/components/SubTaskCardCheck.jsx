'use client'

import { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";
import { ChevronDown, ChevronUp } from "lucide-react";


export const SubTaskCardCheck = ({ subTask, handleComplete }) => {
  const [moreInfoSubTask, setMoreInfoSubTask] = useState(undefined);

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`subtask-${subTask.id}`}
                checked={subTask.completed}
                onCheckedChange={() => {
                  handleComplete(subTask.id);
                  subTask.completed = !subTask.completed;
                }}
              />
              <label
                htmlFor={`subtask-${subTask.id}`}
                className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                  subTask.completed ? "line-through text-muted-foreground" : ""
                }`}
              >
                {subTask.title}
              </label>
            </div>
            <button
              onClick={() => setMoreInfoSubTask(!moreInfoSubTask)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {moreInfoSubTask ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </div>
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              moreInfoSubTask ? "max-h-96" : "max-h-0"
            }`}
          >
            {moreInfoSubTask && (
              <p
                className="text-sm text-muted-foreground mt-2"
                dangerouslySetInnerHTML={{
                  __html: subTask.description.replace(/\n/g, "<br />"),
                }}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubTaskCardCheck;