import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";

import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
    deleteTaskFailure,
    editTask,
    getTaskData,
    resetTaskCreation,
    resetTasks,
} from "../redux/actions/taskActions";
import SkeletonEdit from "../components/SkeletonEdit";
import Button from "../components/Button";
import TaskInput from "../components/TaskInput";
import { removeTask } from "../services/tasks";

const EditTask = () => {
    let params = useParams();
    const [taskDetails, setTaskDetails] = useState(null);
    const dispatch = useDispatch();
    const task = useSelector((state) => state.tasks.task);
    const id = params.id;
    const navigate = useNavigate();
    useEffect(() => {
        dispatch(getTaskData(id));        
    }, [dispatch, id]);

    useEffect(() => {
        if (task) {
            const isoDate = task.dueDate;
            const formattedDate = isoDate.split("T")[0];
            setTaskDetails([
                {
                    id: 0,
                    placeholder: "Set title",
                    iconSrc: "/src/assets/title.svg",
                    type: "text",
                    value: task.title,
                    target: "Title",
                },
                {
                    id: 1,
                    placeholder: "Set description",
                    iconSrc: "/src/assets/description.svg",
                    type: "text",
                    value: task.description,
                    target: "Description",
                },
                {
                    id: 2,
                    placeholder: "Set due date",
                    iconSrc: "/src/assets/duedate.svg",
                    type: "date",
                    value: formattedDate,
                    target: "DueDate",
                },
                {
                    id: 3,
                    placeholder: "Set status",
                    iconSrc: "/src/assets/status.svg",
                    type: "select",
                    value: task.status,
                    target: "Status",
                },
            ]);
        }
    }, [task]);
    const handleDelete = async () => {
        try {
            await removeTask(id);
            navigate("/");
        } catch (error) {
            dispatch(deleteTaskFailure(error.response.data.message));
        }
    };
    const handleInputChange = (index, newValue) => {
        setTaskDetails((prevDetails) =>
            prevDetails.map((detail, i) =>
                i === index ? { ...detail, value: newValue } : detail
            )
        );
    };
    const handleStatusChange = (newStatus) => {
        setTaskDetails((prevDetails) =>
            prevDetails.map((detail) =>
                detail.type === "select"
                    ? { ...detail, value: newStatus }
                    : detail
            )
        );
    };
    const handleSave = () => {
      if (!task)
        return ;
        const updatedFields = {};
        if (taskDetails[0].value !== task.title) {
            updatedFields.title = taskDetails[0].value;
        }
        if (taskDetails[1].value !== task.description) {
            updatedFields.description = taskDetails[1].value;
        }
        if (taskDetails[2].value !== task.dueDate.split("T")[0]) {
            updatedFields.dueDate = taskDetails[2].value;
        }
        if (taskDetails[3].value !== task.status) {
            updatedFields.status = taskDetails[3].value;
        }
        if (Object.keys(updatedFields).length > 0) {
            dispatch(editTask(id, updatedFields));
        }
    };
    return (
        <DashboardLayout>
            <div className=" mt-2 sm:flex justify-between items-start gap-x-8">
                {!taskDetails ? (
                    <SkeletonEdit />
                ) : (
                    <>
                        <div className="sm:w-1/2 sm:max-w-1/2 mb-16 sm:mb-0">
                            {taskDetails.map((detail, index) => {
                                const {
                                    id,
                                    placeholder,
                                    iconSrc,
                                    type,
                                    value,
                                    target
                                } = detail;
                                return (
                                    <TaskInput
                                    editMode={true}
                                        value={value}
                                        key={id}
                                        type={type}
                                        placeholder={placeholder}
                                        onChange={(e) =>
                                            handleInputChange(
                                                index,
                                                e.target.value
                                            )
                                        }
                                        statusHandler={handleStatusChange}
                                        target={target}
                                        iconSrc={iconSrc}
                                        classNames="mb-1 text-[#212121] text-sm font-normal border-b border-transparent focus:border-teal-700 outline-none w-full cursor-pointer bg-white rounded-sm  p-2"
                                    />
                                );
                            })}
                        </div>
                        <div>
                            <div onClick={handleSave} className="flex justify-center items-center bg-cyan-600 hover:bg-cyan-700 rounded-sm p-3 cursor-pointer mb-2 w-full">
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z"
                                        stroke="white"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M17 21V13H7V21"
                                        stroke="white"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M7 3V8H15"
                                        stroke="white"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <Button
                                    type="button"
                                    text="Save"
                                    classNames="text-white font-semibold text-md ml-2 select-none cursor-pointer"
                                />
                            </div>
                            <div
                                onClick={handleDelete}
                                className="flex justify-center items-center bg-[#E3123F] hover:bg-red-700 rounded-sm p-3 cursor-pointer mb-2 w-full"
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M15 5L5 15"
                                        stroke="white"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M5 5L15 15"
                                        stroke="white"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <Button
                                    type="button"
                                    text="Delete"
                                    classNames="text-white font-semibold text-md ml-2 select-none cursor-pointer"
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </DashboardLayout>
    );
};

export default EditTask;
