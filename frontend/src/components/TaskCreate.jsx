import { useState } from "react";
import TaskInput from "./TaskInput";

import FormActions from "./FormActions";

const TaskCreate = () => {
    const [taskData, setTaskData] = useState({
        title: "",
        description: "",
        dueDate: "",
        status: "To Do",
    });
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
            value: taskData.title,
            handler: (e) => handleChange("title", e.target.value),
            errors: null,
        },
        {
            id: 1,
            target: "Description",
            placeholder: "Set description",
            iconSrc: "./src/assets/description.svg",
            type: "text",
            value: taskData.description,
            handler: (e) => handleChange("description", e.target.value),
            errors: null,
        },
        {
            id: 2,
            target: "DueDate",
            placeholder: "Set due date",
            iconSrc: "./src/assets/duedate.svg",
            type: "date",
            value: taskData.dueDate,
            handler: (e) => handleChange("dueDate", e.target.value),
            errors: null,
        },
        {
            id: 3,
            target: "status",
            placeholder: "Set status",
            iconSrc: "./src/assets/status.svg",
            type: "select",
            value: taskData.status,
            handler: (selected) => handleChange("status", selected),
        },
    ];

    return (
        <form className="flex flex-col justify-start sm:flex-row sm:items-start sm:justify-between mb-4 ">
            <div className=" mb-4 sm:mb-0 w-full sm:w-1/2">
                {taskDetails.map((detail) => {
                    const {
                        id,
                        placeholder,
                        iconSrc,
                        type,
                        value,
                        handler,
                        errors,
                        target,
                    } = detail;
                    return (
                        <TaskInput
                            target={target}
                            key={id}
                            editMode={false}
                            handleStatusChange={handleStatusChange}
                            handler={handler}
                            value={value}
                            type={type}
                            placeholder={placeholder}
                            iconSrc={iconSrc}
                            errors={errors}
                            classNames="mb-2 text-[#212121] text-sm font-normal border-b border-transparent focus:border-teal-700 outline-none w-full cursor-pointer bg-white rounded-sm p-2"
                        />
                    );
                })}
            </div>
            <FormActions taskData={taskData} setTaskData={setTaskData} />
        </form>
    );
};

export default TaskCreate;
