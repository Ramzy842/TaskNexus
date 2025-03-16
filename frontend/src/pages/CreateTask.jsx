import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import TaskCreate from "../components/TaskCreate";
import { useDispatch, useSelector } from "react-redux";
import { clearTasksMessage, resetTaskCreation } from "../redux/actions/taskActions";

const CreateTask = () => {
  const dispatch = useDispatch();
  const taskCreationMessage = useSelector((state) => state.tasks.message);
  const [message, setMessage] = useState(null)
  useEffect(() => {
    dispatch(resetTaskCreation());
  }, [dispatch]);
  useEffect(() => {
    if (taskCreationMessage) {
      setMessage(taskCreationMessage);
      // Clear any existing timeout
      let timeoutId = setTimeout(() => {
        setMessage(null);
        dispatch(clearTasksMessage());
      }, 5000);
  
      return () => clearTimeout(timeoutId); // Cleanup previous timeout
    }
  }, [taskCreationMessage]);
  return (
    <DashboardLayout>
      {message && (
        <p
        className={`absolute bottom-0 right-0  border-b-4 bg-teal-800 border-teal-400 text-white text-xs w-full md:w-sm rounded-xs p-4`}
      >
        {message}
      </p>
      )}
      <TaskCreate />
    </DashboardLayout>
  );
};

export default CreateTask;
