import TaskList from "../components/TaskList";
import DashboardLayout from "../layouts/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";

import SkeletonCard from "../components/SkeletonCard";
import { useEffect } from "react";
import { getTasks, resetTasks } from "../redux/actions/taskActions";
import { resetUser } from "../redux/actions/userActions";

const Home = () => {
    const tasks = useSelector((state) => state.tasks.tasks);
    const loading = useSelector((state) => state.tasks.loading);
    const message = useSelector((state) => state.user.message);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getTasks());
    }, []);
    useEffect(() => {
      dispatch(resetUser())
    }, [])
    return (
        <DashboardLayout>
            {message && (
                <p className="text-center text-xs bg-red-300 text-red-700 p-2 mb-2 rounded-sm">
                    {message}
                </p>
            )}
            {!message && (
                <>
                    <div className="flex items-center mb-2">
                        <h1 className="font-medium text-lg mr-2 text-teal-950 select-none">
                            My tasks
                        </h1>
                        <img
                            src="./src/assets/layers.svg"
                            alt="tasks icon"
                            className="select-none"
                        />
                    </div>
                    <div className="overflow-y-auto h-[520px] md:h-[768px] ">
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
                </>
            )}
        </DashboardLayout>
    );
};

export default Home;
