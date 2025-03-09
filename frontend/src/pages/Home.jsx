import TaskList from "../components/TaskList";
import DashboardLayout from "../layouts/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";

import SkeletonCard from "../components/SkeletonCard";
import { useEffect, useState } from "react";
import { getTasks } from "../redux/actions/taskActions";

const Home = () => {
  const prevTasks = useSelector((state) => state.tasks.prevTasks);
  const tasks = useSelector((state) => state.tasks.tasks);
  const loading = useSelector((state) => state.tasks.loading);
  const error = useSelector((state) => state.tasks.error);
  const dispatch = useDispatch();
  useEffect(() => {
    console.log(prevTasks);
    console.log(tasks);
    dispatch(getTasks());
  }, []);

  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!error) return;

    // Get stored expiration time from localStorage
    const storedExpireTime = localStorage.getItem("errorExpireTime");
    const currentTime = Date.now();

    if (storedExpireTime && storedExpireTime > currentTime) {
      // Calculate remaining time
      setTimeLeft(Math.ceil((storedExpireTime - currentTime) / 1000));
    } else {
      // Set new expiration time
      const expireTime = currentTime + 60000; // 60 seconds from now
      localStorage.setItem("errorExpireTime", expireTime);
      setTimeLeft(60);
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          dispatch(getTasks()); // Clear error after timeout
          localStorage.removeItem("errorExpireTime"); // Remove stored time
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [error]);
  return (
    <DashboardLayout>
      {error && timeLeft > 0 && (
        <p
          role="alert"
          className="text-center text-xs bg-[#E3123F] text-white p-2 mb-2 rounded-md font-medium lg:text-sm shadow-sm"
        >
          {error} - Retry in {timeLeft}s
        </p>
      )}
      {!error && (
        <>
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
              <TaskList tasks={tasks} prevTasks={prevTasks} />
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default Home;
