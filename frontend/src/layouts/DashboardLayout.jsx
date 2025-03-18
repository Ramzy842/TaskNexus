import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearMessages, getUserData } from "../redux/actions/userActions";
import { clearTasksMessage } from "../redux/actions/taskActions";
import DeleteUserConfirmation from "../components/DeleteUserConfirmation";
import DashboardHeader from "../components/DashboardHeader";

const DashboardLayout = ({ children }) => {
  const [username, setUsername] = useState();
  const [message, setMessage] = useState(null);
  const {
    user,
    isEditingImage,
    isEditingLoading,
    message: userMessage,
    success,
    showDeletionConfirmation,
    loading,
  } = useSelector((state) => state.user);
  const { isCreating, message: taskCreationMessage } = useSelector(
    (state) => state.tasks
  );
  const dispatch = useDispatch();
  const userId = localStorage.getItem("id");
  useEffect(() => {
    if (userId) dispatch(getUserData(userId));
  }, [dispatch, userId]);
  useEffect(() => {
    const storageUsername = localStorage.getItem("username");
    if (storageUsername) setUsername(storageUsername);
  }, []);
  useEffect(() => {
    if (taskCreationMessage)
      setMessage({ value: taskCreationMessage, success: true });
    else if (userMessage) setMessage({ value: userMessage, success });
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
  }, [user, username]);

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
            className={`z-30 absolute bottom-0 right-0  border-b-4 ${
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
