import { useEffect, useState } from "react";
import TaskInput from "./TaskInput";
import FormActions from "./FormActions";
import { useSelector } from "react-redux";
const INITIAL_TASK_STATE = {
  title: "",
  description: "",
  dueDate: "",
  status: "To Do",
};
const TaskCreate = () => {
  const taskCreationMessage = useSelector((state) => state.tasks.message);
  const [taskData, setTaskData] = useState(INITIAL_TASK_STATE);
  useEffect(() => {
    if (taskCreationMessage) {
      setTaskData(INITIAL_TASK_STATE);
    }
  }, [taskCreationMessage]);
  const handleChange = (key, value) => {
    setTaskData((prev) => ({ ...prev, [key]: value }));
  };
  const handleStatusChange = (newStatus) => {
    setTaskData({ ...taskData, status: newStatus });
  };

  const taskDetails = [
    {
      id: 0,
      target: "Title",
      placeholder: "Set title",
      iconSrc: "./src/assets/title.svg",
      type: "text",
      key: "title"
    },
    {
      id: 1,
      target: "Description",
      placeholder: "Set description",
      iconSrc: "./src/assets/description.svg",
      type: "text",
      key: "description"
    },
    {
      id: 2,
      target: "DueDate",
      placeholder: "Set due date",
      iconSrc: "./src/assets/duedate.svg",
      type: "date",
      key: "dueDate"
    },
    {
      id: 3,
      target: "status",
      placeholder: "Set status",
      iconSrc: "./src/assets/status.svg",
      type: "select",
      key: "status"
    },
  ];

  return (
    <form className="flex flex-col justify-start sm:flex-row sm:items-start sm:justify-between mb-4 ">
      <div className=" mb-4 sm:mb-0 w-full sm:w-1/2">
        {taskDetails?.map(({id, key, ...rest}) => {
          return (
            <TaskInput
              key={id}
              editMode={false}
              classNames="placeholder-teal-800  mb-2 text-[#212121] text-sm text-teal-950 font-normal border-b border-transparent focus:border-teal-700 outline-none w-full cursor-pointer bg-white rounded-sm p-2"
              value={taskData[key]}
              handleStatusChange={handleStatusChange}
              handler={(e) => handleChange(key, e.target.value)}
              {...rest}
            />
          );
        })}
      </div>
      <FormActions taskData={taskData} setTaskData={setTaskData} />
    </form>
  );
};

export default TaskCreate;
