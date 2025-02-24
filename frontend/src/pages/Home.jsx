import { useEffect, useState } from "react";

import TaskList from "../components/TaskList";
import DashboardLayout from "../layouts/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import { getTasks } from "../redux/actions/taskActions";

const Home = () => {
    const tasks = useSelector(state => state.tasks.tasks);
    const dispatch = useDispatch()
    useEffect(() => {
        if(!tasks.length)
            dispatch(getTasks())
    }, [tasks])
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
