import TaskList from "../components/TaskList";
import DashboardLayout from "../layouts/DashboardLayout";

const Home = () => {
    return (
        <DashboardLayout>
            <div className="flex items-center mb-2">
                <h1 className="font-medium text-lg mr-2">My tasks</h1>
                <img src="./src/assets/layers.svg" alt="tasks icon" className="select-none" />
            </div>

            <TaskList />
        </DashboardLayout>
    );
};

export default Home;
