import TaskList from "../components/TaskList";
import DashboardLayout from "../layouts/DashboardLayout";
import { useSelector } from "react-redux";

import SkeletonCard from "../components/SkeletonCard";

const Home = () => {
  const tasks = useSelector((state) => state.tasks.tasks);
  const loading = useSelector((state) => state.tasks.loading);
  return (
    <DashboardLayout>
      <div className="flex items-center mb-2">
        <h1 className="font-medium text-lg mr-2 text-teal-950 select-none">My tasks</h1>
        <img
          src="./src/assets/layers.svg"
          alt="tasks icon"
          className="select-none"
        />
      </div>
      <div className="overflow-y-auto h-[480px] md:h-[768px] ">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <TaskList tasks={tasks} />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Home;
