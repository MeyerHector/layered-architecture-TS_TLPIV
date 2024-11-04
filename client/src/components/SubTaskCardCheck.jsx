import { useState } from "react";

const SubTaskCardCheck = ({ subTask, handleComplete }) => {
  const [moreInfoSubTask, setMoreInfoSubTask] = useState(false);

  return (
    <>
      <div className="flex flex-col bg-slate-500 px-2 py-1 rounded">
        <div className="flex justify-between items-center">
          <div>
            <input
              type="checkbox"
              className="me-1.5"
              checked={subTask.completed}
              onChange={() => {
                handleComplete(subTask.id);
                subTask.completed = !subTask.completed;
              }}
            />
            <span className={subTask.completed && "line-through text-gray-300"}>
              {subTask.title}
            </span>
          </div>

          <i
            onClick={() => setMoreInfoSubTask(!moreInfoSubTask)}
            className={`fa-solid cursor-pointer ${
              moreInfoSubTask ? "fa-angle-up" : "fa-angle-down"
            }`}
          ></i>
        </div>
        <div
          className={`transition-max-height duration-1000 ease-in-out overflow-hidden ${
            moreInfoSubTask ? "max-h-96" : "max-h-0"
          }`}
        >
          {moreInfoSubTask && (
            <p
              className="text-gray-300"
              dangerouslySetInnerHTML={{
                __html: subTask.description.replace(/\n/g, "<br />"),
              }}
            ></p>
          )}
        </div>
      </div>
    </>
  );
};

export default SubTaskCardCheck;
