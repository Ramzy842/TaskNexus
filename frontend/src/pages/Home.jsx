import TaskList from "../components/TaskList";
import DashboardLayout from "../layouts/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";

import SkeletonCard from "../components/SkeletonCard";
import { useEffect } from "react";
import { getTasks, resetTasks } from "../redux/actions/taskActions";

const Home = () => {
  const loading = useSelector((state) => state.tasks.loading);
  const task = useSelector(state => state.tasks.task)
  const dispatch = useDispatch();
  useEffect(() => {
    if (task)
      dispatch(resetTasks())
    dispatch(getTasks());
  }, [dispatch, task]);
  return (
    <DashboardLayout>
          <div className="flex items-center mb-2">
            <h1 className="font-medium text-lg mr-2 text-[#f2ffff] select-none">
              My tasks
            </h1>
            <img
              src="./src/assets/layers.svg"
              alt="tasks icon"
              className="select-none"
            />
          </div>
          <div className="overflow-y-auto overflow-x-hidden h-[520px] md:h-[768px] pr-2 ">
            {loading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : (
              <TaskList />
            )}
          </div>
    </DashboardLayout>
  );
};

export default Home;
