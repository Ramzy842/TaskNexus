import { useEffect, useRef, useState } from "react";
import Button from "../components/Button";
import { NavLink } from "react-router";

import { useDispatch, useSelector } from "react-redux";

import Menu from "../components/Menu";
import { clearMessages, getUserData } from "../redux/actions/userActions";
import { clearTasksMessage } from "../redux/actions/taskActions";

const DashboardLayout = ({ children }) => {
  const user = useSelector((state) => state.user.user);
  const [showMenu, setShowMenu] = useState(false);
  const isEditingImage = useSelector((state) => state.user.isEditingImage);
  const isEditingLoading = useSelector((state) => state.user.isEditingLoading);
  const isCreating = useSelector((state) => state.tasks.isCreating);
  const loading = useSelector((state) => state.user.loading);
  const profilePicture = useSelector((state) => state.user.profilePicture);
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const taskCreationMessage = useSelector((state) => state.tasks.message);
  const userMessage = useSelector((state) => state.user.message);
  const success = useSelector((state) => state.user.success);
  const [message, setMessage] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(taskCreationMessage);
    console.log(userMessage);
    if (taskCreationMessage || userMessage) {
      setMessage(null);
    }
    if (taskCreationMessage) dispatch(clearTasksMessage());
    else if (userMessage) dispatch(clearMessages());

    dispatch(getUserData(localStorage.getItem("id")));
  }, []);
  useEffect(() => {
    if (taskCreationMessage) {
      console.log("here");
      setMessage({ value: taskCreationMessage, success: true });
    } else if (userMessage) {
      setMessage({ value: userMessage, success });
    }
    if (taskCreationMessage || userMessage) {
      let timeoutId = setTimeout(() => {
        setMessage(null);
        dispatch(clearTasksMessage());
        dispatch(clearMessages());
      }, 5000);
      return () => clearTimeout(timeoutId); // Cleanup previous timeout
    }
  }, [taskCreationMessage, userMessage]);
  useEffect(() => {
    if (user && username !== user.username) {
      setUsername(user.username);
    }
  }, [user]);

  return (
    <div className="grid grid-rows-[auto_1fr] min-h-screen bg-linear-to-bl from-[#E3EAE9] to-[#A3C4C4] p-4">
      {/* Gradient Bar */}
      {(isEditingImage || isEditingLoading || loading || isCreating) && (
        <div className="absolute left-0 right-0 top-0 h-2 w-full bg-gradient-to-r from-teal-500 from-10% via-teal-500 via-50% to-emerald-500 to-90% animate-pulse"></div>
      )}
      

      <div className="max-w-6xl m-auto w-full relative">
      
        <div className="flex justify-between items-center mb-4">
          {window.location.pathname === "/" ? (
            <NavLink
              to="/create"
              className="w-36 flex items-center bg-teal-600 hover:bg-teal-700 shadow-md rounded-sm p-3 cursor-pointer"
            >
              <Button
                type="button"
                text="Add task"
                classNames="text-white flex-1 w-full font-semibold text-base mr-2 select-none cursor-pointer"
              />
              <svg
                width="24"
                height="24"
                className="stroke-white"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 5V19"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5 12H19"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </NavLink>
          ) : (
            <NavLink to="/">
              <div className="flex justify-center items-center bg-teal-600 hover:bg-teal-700 rounded-sm p-3 cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-arrow-left"
                >
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                <Button
                  type="button"
                  text="Return Home"
                  classNames="text-white font-semibold text-md ml-2 select-none cursor-pointer"
                />
              </div>
            </NavLink>
          )}

          {/* Profile Section */}
          <div className="relative">
            <div className="flex items-center">
              <h1 className="hidden sm:text-normal sm:flex font-semibold text-teal-900 mr-2">
                {username}
              </h1>
              <div
                style={{
                  backgroundImage: profilePicture && `url(${profilePicture})`,
                }}
                className="w-10 h-10 rounded-md mr-2 bg-no-repeat bg-center bg-cover shadow-lg"
              ></div>
              <img
                src={
                  showMenu
                    ? `/src/assets/close-menu.svg`
                    : `/src/assets/open-menu.svg`
                }
                className="cursor-pointer"
                onClick={() => setShowMenu(!showMenu)}
                alt="toggle-menu"
              />
            </div>
            {showMenu && <Menu setShowMenu={setShowMenu} />}
          </div>
        </div>
      </div>

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
