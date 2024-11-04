import { Link } from "react-router-dom";
import { useTasks } from "../context/TaskContext";
import { useState } from "react";
import { Modal } from "@mui/material";

function TaskCard({ task }) {
  console.log(task);
  const { deleteTask, getTasks, markTaskAsCompletedOrNot } = useTasks();
  const [moreInfo, setMoreInfo] = useState(false);
  const [openSubTaskModal, setOpenSubTaskModal] = useState(false);

  const handleDelete = async () => {
    await deleteTask(task.id);
    await getTasks();
  };

  const handleComplete = async () => {
    await markTaskAsCompletedOrNot(task.id);
    await getTasks();
  };
  return (
    <div
      className={`p-4 rounded-md shadow-md flex flex-col ${
        task.completed ? "bg-gray-800" : "bg-gray-700"
      }`}
    >
      <header className="flex justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleComplete}
            className="mr-2 h-6 w-6 rounded-md cursor-pointer border-2 border-gray-500"
          />
          <span
            className={`text-xl font-bold ${
              task.completed && "line-through text-gray-300"
            }`}
          >
            {task.title.length > 15
              ? task.title.slice(0, 15) + "..."
              : task.title}
          </span>
        </div>
        <div className="flex gap-x-2 items-center">
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-md flex items-center"
          >
            <i className="fa-solid fa-trash"></i>
          </button>
          <Link
            className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded-md flex items-center"
            to={`/tasks/${task.id}`}
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
            <p className="text-gray-300">{task.description}</p>
            Fecha límite: {new Date(task.date).toLocaleDateString()}
            {task.subTasks.length > 0 && (
              <>
                <div>
                  <span>Subtareas ({task.subTasks.length})</span>
                </div>
                {task.subTasks.map((subTask, i) => (
                  <>
                    <div className="flex justify-between items-center bg-slate-500 px-2 py-1 rounded">
                      <div key={i}>
                        <input
                          type="checkbox"
                          className="me-1.5"
                          checked={subTask.completed}
                          onChange={() => console.log("subtask")}
                        />
                        <span>{subTask.title}</span>
                      </div>

                      <i
                        onClick={() => setOpenSubTaskModal(true)}
                        className="fa-solid cursor-pointer fa-up-right-from-square"
                      ></i>
                    </div>
                    <Modal
                      open={openSubTaskModal}
                      onClose={() => setOpenSubTaskModal(false)}
                      className="flex justify-center items-center"
                    >
                      <div className="w-1/3 flex flex-col bg-slate-800 rounded p-5">
                        <div className="flex justify-between">
                          <span className="text-xl font-bold">
                            {subTask.title}
                          </span>
                          <i
                            onClick={() => setOpenSubTaskModal(false)}
                            className="fa-solid fa-xmark cursor-pointer"
                          ></i>{" "}
                        </div>
                        <span>{subTask.description}</span>
                      </div>
                    </Modal>
                  </>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskCard;
