import { useState } from "react";
import CompletedTasks from "../components/CompletedTasks";
import TaskList from "../components/TaskList";
import DashboardLayout from "../layouts/DashboardLayout";

const Home = () => {
	const [tasks, setTasks] = useState([{ id: 0, title: "Study AWS", status: "To Do" },
		{ id: 1, title: "Random Task", status: "In Progress" },
		{ id: 2, title: "Study POSTGRES", status: "In Progress" },
		{ id: 3, title: "Random Task #2", status: "In Progress" }])
	const [completedTasks, setCompletedTasks] = useState([{ id: 0, title: "Study Docker", status: "Completed" },
		{ id: 1, title: "Study ReactJS", status: "Completed" },
		{ id: 2, title: "Study Express", status: "Completed" }])
    return (
        <DashboardLayout>
            <div className="flex items-center mb-2">
                <h1 className="font-medium text-lg mr-2">My tasks</h1>
                <img src="./src/assets/layers.svg" alt="tasks icon" className="select-none" />
            </div>
            <TaskList tasks={tasks}  />
			<div className="flex items-center mb-2">
                <h1 className="font-medium text-lg mr-2">Completed</h1>
                <img src="./src/assets/completed.svg" alt="Completed tasks icon" className="select-none" />
            </div>
            <CompletedTasks tasks={completedTasks} />
        </DashboardLayout>
    );
};

export default Home;
