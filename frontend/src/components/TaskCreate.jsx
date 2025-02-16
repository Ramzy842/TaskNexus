import { useEffect, useState } from "react";
import TaskInput from "./TaskInput";
import Button from "./Button";
import FormActions from "./FormActions";

const TaskCreate = ({ setFormIsOpen }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("")
    const [dueDate, setDueDate] = useState("");
    const [status, setStatus] = useState("To Do")
    const [taskDetails, setTaskDetails] = useState([
        { id: 0, placeholder: "Set title", iconSrc: "./src/assets/title.svg", type: "text", value: title, handler:  setTitle},
        { id: 1, placeholder: "Set description", iconSrc: "./src/assets/description.svg", type: "text", value: description, handler: setDescription },
        { id: 2, placeholder: "Set due date", iconSrc: "./src/assets/duedate.svg", type: "date", value: dueDate, handler: setDueDate },
        { id: 3, placeholder: "Set status", iconSrc: "./src/assets/status.svg", type: "select", value: status, handler: setStatus },
    ])

    return <form className="flex flex-col justify-start sm:flex-row sm:items-start sm:justify-between mb-4">
        <div className="sm:w-1/3 sm:max-w-1/3 mb-4 sm:mb-0">
            {taskDetails.map(detail => {
                const { id, placeholder, iconSrc, type, value, handler } = detail;
                return <TaskInput handler={handler} value={value} key={id} type={type} placeholder={placeholder} iconSrc={iconSrc} classNames="text-[#212121] text-sm font-normal border-b border-transparent focus:border-teal-700 outline-none w-full cursor-pointer bg-white rounded-sm p-2" />
            })}
        </div>
        <FormActions setFormIsOpen={setFormIsOpen} />
    </form>
}

export default TaskCreate;