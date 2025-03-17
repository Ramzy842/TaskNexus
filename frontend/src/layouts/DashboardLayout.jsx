import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { clearMessages, getUserData } from "../redux/actions/userActions";
import { clearTasksMessage } from "../redux/actions/taskActions";
import DeleteUserConfirmation from "../components/DeleteUserConfirmation";
import DashboardHeader from "../components/DashboardHeader";

const DashboardLayout = ({ children }) => {
  const user = useSelector((state) => state.user.user);
  const isEditingImage = useSelector((state) => state.user.isEditingImage);
  const isEditingLoading = useSelector((state) => state.user.isEditingLoading);
  const isCreating = useSelector((state) => state.tasks.isCreating);
  const loading = useSelector((state) => state.user.loading);
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const taskCreationMessage = useSelector((state) => state.tasks.message);
  const userMessage = useSelector((state) => state.user.message);
  const success = useSelector((state) => state.user.success);
  const [message, setMessage] = useState(null);
  const dispatch = useDispatch();
  // const [showConfirmation, setShowConfirmation] = useState(false);
  const showDeletionConfirmation = useSelector((state) => state.user.showDeletionConfirmation);
  
  // useEffect(() => {
  //   setShowConfirmation(showDeletionConfirmation);
  // }, [showDeletionConfirmation]);
  
  useEffect(() => {
    dispatch(getUserData(localStorage.getItem("id")));
  }, [dispatch]);

  useEffect(() => {
    if (taskCreationMessage)
      setMessage({ value: taskCreationMessage, success: true });
    else if (userMessage)
      setMessage({ value: userMessage, success });
    const timeoutId = setTimeout(() => {
      setMessage(null);
      if (taskCreationMessage) dispatch(clearTasksMessage());
      if (userMessage) dispatch(clearMessages());
    }, 5000);
    return () => clearTimeout(timeoutId);
  }, [taskCreationMessage, userMessage, dispatch]);
  
  useEffect(() => {
    if (user && username !== user.username) {
      setUsername(user.username);
    }
  }, [user]);

  return (
    <div className="grid grid-rows-[auto_1fr] min-h-screen bg-linear-to-bl from-[#E3EAE9] to-[#A3C4C4] p-4">
      {(isEditingImage || isEditingLoading || loading || isCreating) && (
        <div className="absolute left-0 right-0 top-0 h-2 w-full bg-gradient-to-r from-teal-500 from-10% via-teal-500 via-50% to-emerald-500 to-90% animate-pulse"></div>
      )}
      <DashboardHeader username={username} />
      {showDeletionConfirmation && <DeleteUserConfirmation />}
      <div className="max-w-6xl overflow-x-hidden w-full mx-auto relative">
        {message && (
          <p
            className={`z-50 absolute bottom-0 right-0  border-b-4 ${
              message.success
                ? "bg-teal-800 border-teal-400 text-white"
                : " bg-red-800 border-red-400 text-white"
            } text-xs w-full md:w-sm rounded-xs p-4`}
          >
            {message.value}
          </p>
        )}
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
