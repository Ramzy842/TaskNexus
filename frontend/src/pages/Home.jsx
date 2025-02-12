import { useState } from "react";

import TaskList from "../components/TaskList";
import DashboardLayout from "../layouts/DashboardLayout";

const Home = () => {
    const [tasks, setTasks] = useState([{ id: 0, title: "Study AWS", status: "To Do" },
    { id: 1, title: "Random Task", status: "In Progress" },
    { id: 2, title: "Study POSTGRES", status: "In Progress" },
    { id: 3, title: "Random Task #2", status: "In Progress" },
    { id: 4, title: "Study ReactJS", status: "Completed" },
    { id: 5, title: "Study Express", status: "Completed" },
    { id: 6, title: "Study ReactJS", status: "Completed" },
    { id: 7, title: "Study Express", status: "Completed" },
    { id: 8, title: "Study ReactJS", status: "Completed" },
    { id: 9, title: "Study Express", status: "Completed" },])
    return (
        <DashboardLayout>
            <div className="flex items-center mb-2">
                <h1 className="font-medium text-lg mr-2">My tasks</h1>
                <img src="./src/assets/layers.svg" alt="tasks icon" className="select-none" />
            </div>
            <TaskList tasks={tasks} />
            {/* <div className="flex items-center mb-2">
                <h1 className="font-medium text-lg mr-2">Completed</h1>
                <img src="./src/assets/completed.svg" alt="Completed tasks icon" className="select-none" />
            </div> */}
        </DashboardLayout>
    );
};

export default Home;
