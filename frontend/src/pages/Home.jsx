import { useState } from "react";

import TaskList from "../components/TaskList";
import DashboardLayout from "../layouts/DashboardLayout";

const Home = () => {
    const [tasks, setTasks] = useState([{ id: 0, title: "Study AWS",description: "Do something" , status: "To Do", dueDate: "07-06-2000" },
    { id: 1, title: "Random Task",description: "Do something" , status: "In Progress", dueDate: "07-06-2000" },
    { id: 2, title: "Study POSTGRES",description: "Do something" , status: "In Progress", dueDate: "07-06-2000" },
    { id: 3, title: "Random Task #2",description: "Do something" , status: "In Progress", dueDate: "07-06-2000" },
    { id: 4, title: "Study ReactJS",description: "Do something" , status: "Completed", dueDate: "07-06-2000" },
    { id: 5, title: "Study Express",description: "Do something" , status: "Completed", dueDate: "07-06-2000" },
    { id: 6, title: "Study ReactJS",description: "Do something" , status: "Completed", dueDate: "07-06-2000" },
    { id: 7, title: "Study Express",description: "Do something" , status: "Completed", dueDate: "07-06-2000" },
    { id: 8, title: "Study ReactJS",description: "Do something" , status: "Completed", dueDate: "07-06-2000" },
    { id: 9, title: "Study Express",description: "Do something" , status: "Completed", dueDate: "07-06-2000" },])
    return (
        <DashboardLayout>
            <div className="flex items-center mb-2">
                <h1 className="font-medium text-lg mr-2">My tasks</h1>
                <img src="./src/assets/layers.svg" alt="tasks icon" className="select-none" />
            </div>
            <TaskList tasks={tasks} />
        </DashboardLayout>
    );
};

export default Home;
