import { useState } from "react";
import TaskInput from "./TaskInput";
import Button from "./Button";

const TaskCreate = ({setFormIsOpen}) => {
    const [taskDetails, setTaskDetails] = useState([
        { id: 0, placeholder: "Set title", iconSrc: "./src/assets/title.svg", type: "text" },
        { id: 1, placeholder: "Set description", iconSrc: "./src/assets/description.svg", type: "text" },
        { id: 2, placeholder: "Set due date", iconSrc: "./src/assets/duedate.svg", type: "date" },
        { id: 3, placeholder: "Set status", iconSrc: "./src/assets/status.svg", type: "select" },
    ])
    return <form className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
        <div className="sm:w-1/3">
            {taskDetails.map(detail => {
                const { id, placeholder, iconSrc, type } = detail;
                return <TaskInput key={id} type={type} placeholder={placeholder} iconSrc={iconSrc} classNames="text-gray-900 font-normal border-b border-transparent focus:border-teal-700 pb-0.5 outline-none w-full" />
            })}
        </div>
        <div className="flex justify-center sm:flex-col sm:items-center  gap-x-2">
            <div className="flex items-center bg-cyan-700 hover:bg-cyan-600 rounded-md p-3 cursor-pointer sm:mb-2">
                <Button
                    type="button"
                    text="Save"
                    classNames="text-white font-semibold text-base mr-2 select-none cursor-pointer sm:w-16"
                />
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M17 21V13H7V21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M7 3V8H15" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </div>
            <div className="flex items-center bg-yellow-700 hover:bg-yellow-600 rounded-md p-3 cursor-pointer" onClick={() => setFormIsOpen(false)}>
                <Button
                    type="button"
                    text="Cancel"
                    classNames="text-white font-semibold text-base mr-2 select-none cursor-pointer sm:w-16"
                />
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M6 6L18 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </div>
        </div>
    </form>
}

export default TaskCreate;