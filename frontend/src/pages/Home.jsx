import { useState } from "react";

import TaskList from "../components/TaskList";
import DashboardLayout from "../layouts/DashboardLayout";
import { useSelector } from "react-redux";

const Home = () => {
    // const [tasks, setTasks] = useState(useSelector(state => state))
    const tasks = useSelector(state => state.user.tasks) || [];
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
