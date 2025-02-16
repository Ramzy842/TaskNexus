import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout"
import TaskInput from "../components/TaskInput";
import Button from "../components/Button";
import { useParams } from "react-router";

const EditTask = ({ task }) => {
    let params = useParams();
    console.log(params.id);
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description)
    const [dueDate, setDueDate] = useState(task.dueDate);
    const [status, setStatus] = useState(task.status)
    const [taskDetails, setTaskDetails] = useState([
        { id: 0, placeholder: "Set title", iconSrc: "/src/assets/title.svg", type: "text", value: title, handler: setTitle },
        { id: 1, placeholder: "Set description", iconSrc: "/src/assets/description.svg", type: "text", value: description, handler: setDescription },
        { id: 2, placeholder: "Set due date", iconSrc: "/src/assets/duedate.svg", type: "date", value: dueDate, handler: setDueDate },
        { id: 3, placeholder: "Set status", iconSrc: "/src/assets/status.svg", type: "select", value: status, handler: setStatus },
    ])
    return (
        <DashboardLayout>
            <div className=" mt-2 sm:flex justify-between items-start gap-x-8">
                <div className="sm:w-1/2 sm:max-w-1/2 mb-12 sm:mb-0">
                    {taskDetails.map(detail => {
                        const { id, placeholder, iconSrc, type, value, handler } = detail;
                        return <TaskInput handler={handler} value={value} key={id} type={type} placeholder={placeholder} iconSrc={iconSrc} classNames="text-[#212121] text-sm font-normal border-b border-transparent focus:border-teal-700 outline-none w-full cursor-pointer bg-white rounded-sm  p-2" />
                    })}
                </div>
                <div className="">
                    <div className="flex justify-center items-center bg-cyan-600 hover:bg-cyan-700 rounded-md p-3 cursor-pointer mb-2 w-full">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M17 21V13H7V21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M7 3V8H15" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <Button
                            type="button"
                            text="Save"
                            classNames="text-white font-semibold text-md ml-2 select-none cursor-pointer"
                        />
                    </div>
                    <div className="flex justify-center items-center bg-red-600 hover:bg-red-700 rounded-md p-3 cursor-pointer mb-2 w-full">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 5L5 15" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M5 5L15 15" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <Button
                            type="button"
                            text="Delete"
                            classNames="text-white font-semibold text-md ml-2 select-none cursor-pointer"
                        />
                    </div>
                    {/* <div className="flex justify-center items-center bg-teal-600 hover:bg-teal-700 rounded-md p-3 cursor-pointer mb-2 w-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-left"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                        <Button
                            type="button"
                            text="Return Home"
                            classNames="text-white font-semibold text-md ml-2 select-none cursor-pointer"
                        />
                    </div> */}
                </div>

            </div>
        </DashboardLayout>
    )
}

export default EditTask
