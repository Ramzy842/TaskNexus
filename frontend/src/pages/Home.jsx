import { useEffect, useState } from "react";

import TaskList from "../components/TaskList";
import DashboardLayout from "../layouts/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import { getTasks } from "../redux/actions/taskActions";
import TaskCard from "../components/TaskCard";
import SkeletonCard from "../components/SkeletonCard";
import { getUserData } from "../redux/actions/userActions";

const Home = () => {
  const tasks = useSelector((state) => state.tasks.tasks);
  const loading = useSelector((state) => state.tasks.loading);
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!tasks.length) dispatch(getTasks());
  }, [tasks]);
  useEffect(() => {
    
        const id = localStorage.getItem("id");
        console.log(id);
        dispatch(getUserData(id))
    
  }, [])
  return (
    <DashboardLayout>
      <div className="flex items-center mb-2">
        <h1 className="font-medium text-lg mr-2">My tasks</h1>
        <img
          src="./src/assets/layers.svg"
          alt="tasks icon"
          className="select-none"
        />
      </div>
      {loading ? (
        <div className="mb-4 max-h-9/11 overflow-y-auto h-3/4 md:h-9/11">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <TaskList tasks={tasks} />
      )}
    </DashboardLayout>
  );
};

export default Home;
