import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router";
import { deleteTask, editTask } from "../redux/actions/taskActions";
import { useEffect } from "react";


const TaskCard = ({ id, title, status }) => {
    const dispatch = useDispatch();
    const tasks = useSelector(state => state.tasks.tasks);
    useEffect(() => {
        
    }, [tasks])
    const handleDelete = () => {
        dispatch(deleteTask(id));
    };
    const handleCompleted = () => {
        dispatch(editTask(id, {status: 'Completed'}));
    }
    return (
        <div
            className={`w-full rounded-sm flex justify-between items-center py-2 px-4 mb-1 shadow-[0_0_8px_-2px_rgba(0,200,200,0.50)] bg-[#E3EAE9] rounded-md bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-20 border border-gray-100`}
        >
            <div className="flex flex-col items-start  w-40 sm:w-sm md:w-sm md:w-lg lg:w-2xl">
                <p
                    className={`sm:hidden select-none mb-1 font-medium ${
                        status === "Completed"
                            ? "bg-teal-600 text-teal-100"
                            : status === "In Progress"
                            ? "bg-blue-600 text-blue-100"
                            : "bg-yellow-600 text-yellow-100"
                    } px-2 py-1 rounded-sm text-xs shadow-sm`}
                >
                    {status}
                </p>
                <p className={`text-sm truncate w-11/12 lg:w-full`}>{title}</p>
            </div>
            <div className="flex items-center justify-center ">
                <p
                    className={`hidden sm:block font-normal ${
                        status === "Completed"
                            ? "bg-teal-600 text-teal-100"
                            : status === "In Progress"
                            ? "bg-blue-600 text-blue-100"
                            : "bg-yellow-600 text-yellow-100"
                    } px-2 py-1 rounded-sm text-xs shadow-sm`}
                >
                    {status}
                </p>
                <div className="flex items-center justify-end ml-2 gap-x-2 max-w-30 min-w-30">
                    <NavLink to={`/tasks/${id}/edit`}>
                        <img
                            src="./src/assets/edit.svg"
                            alt="edit icon"
                            className="cursor-pointer"
                        />
                    </NavLink>
                    {status !== "Completed" && (
                        <img
                            src="./src/assets/check-circle.svg"
                            alt="mark as completed icon"
                            className="cursor-pointer"
                            onClick={handleCompleted}
                        />
                    )}
                    <svg
                        onClick={handleDelete}
                        className={`cursor-pointer`}
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M15 5L5 15"
                            stroke={`#579999`}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2px"
                        />
                        <path
                            d="M5 5L15 15"
                            stroke={`#579999`}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2px"
                        />
                    </svg>
                    <img src="/src/assets/drag.svg" className="cursor-pointer"  alt="drag" />
                    {/* <img src="./src/assets/x.svg" alt="Delete icon" className="cursor-pointer" onClick={() => console.log("Delete")} /> */}
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
