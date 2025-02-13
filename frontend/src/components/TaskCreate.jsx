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

    // useEffect(() => {
    //     console.log("Title: ", title);
    //     console.log("Description: ", description);
    //     console.log("Due date: ", dueDate);
    //     console.log("Status: ", status);
    // }, [title, description, dueDate, status])
    return <form className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
        <div className="sm:w-1/3">
            {taskDetails.map(detail => {
                const { id, placeholder, iconSrc, type, value, handler } = detail;
                return <TaskInput handler={handler} value={value} key={id} type={type} placeholder={placeholder} iconSrc={iconSrc} classNames="text-gray-900 font-normal border-b border-transparent focus:border-teal-700 pb-0.5 outline-none w-full" />
            })}
        </div>
        <FormActions setFormIsOpen={setFormIsOpen} />
    </form>
}

export default TaskCreate;