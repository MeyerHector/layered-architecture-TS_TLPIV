import { Link } from "react-router-dom";
import { useTasks } from "../context/TaskContext";
import { useState } from "react";
import SubTaskCardCheck from "./SubTaskCardCheck";
function TaskCard({ task }) {
  const { deleteTask, getTasks, markTaskAsCompletedOrNot } = useTasks();
  const [moreInfo, setMoreInfo] = useState(false);

  const handleDelete = async (id) => {
    await deleteTask(id);
    await getTasks();
  };

  const handleComplete = async (id) => {
    await markTaskAsCompletedOrNot(id);
    await getTasks();
  };

  return (
    <div
      className={`p-4 rounded-md h-fit shadow-md flex flex-col ${
        task?.completed ? "bg-gray-800" : "bg-gray-700"
      }`}
    >
      <header className="flex justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={task?.completed}
            onChange={() => handleComplete(task?.id)}
            className="mr-2 h-6 w-6 rounded-md cursor-pointer border-2 border-gray-500"
          />
          <span
            className={`text-xl font-bold ${
              task.completed && "line-through text-gray-300"
            }`}
          >
            {task?.title.length > 15
              ? task?.title.slice(0, 15) + "..."
              : task?.title}
          </span>
        </div>
        <div className="flex gap-x-2 items-center">
          <button
            onClick={() => handleDelete(task?.id)}
            className="text-white p-1 rounded-md flex items-center"
          >
            <i className="fa-solid fa-trash"></i>
          </button>
          <Link
            className="text-white p-1 rounded-md flex items-center"
            to={`/tasks/${task?.id}`}
          >
            <i className="fa-regular fa-pen-to-square"></i>
          </Link>
          <button onClick={() => setMoreInfo(!moreInfo)}>
            {moreInfo ? (
              <i className="fa-solid fa-angle-up "></i>
            ) : (
              <i className="fa-solid fa-angle-down "></i>
            )}
          </button>
        </div>
      </header>
      <div
        className={`transition-max-height duration-1000 ease-in-out overflow-hidden ${
          moreInfo ? "max-h-96" : "max-h-0"
        }`}
      >
        {moreInfo && (
          <div>
            <p
              className="text-gray-300 break-all"
              dangerouslySetInnerHTML={{
                __html: task.description.replace(/\n/g, "<br />"),
              }}
            ></p>
            Fecha límite: {new Date(task?.date).toLocaleDateString()}
            {task?.subTasks?.length > 0 && (
              <>
                <div>
                  <span>Subtareas ({task?.subTasks.length})</span>
                </div>
                <div className="flex flex-col gap-2">
                  {task?.subTasks.map((subTask, i) => {
                    return (
                      <SubTaskCardCheck
                        key={i}
                        subTask={subTask}
                        handleComplete={handleComplete}
                      />
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskCard;
