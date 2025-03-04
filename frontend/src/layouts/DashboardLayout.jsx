import { useEffect, useState } from "react";
import Button from "../components/Button";
import { NavLink } from "react-router";

import { getUserData } from "../redux/actions/userActions";
import { useDispatch } from "react-redux";

import Menu from "../components/Menu";

const DashboardLayout = ({ children }) => {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const profilePicture = localStorage.getItem("profilePicture");


  useEffect(() => {
    const id = localStorage.getItem("id");
    dispatch(getUserData(id));
  }, [dispatch]);

  return (
    <div className="grid grid-rows-[auto_1fr] min-h-screen bg-[#E3EAE9] p-4">
      <div className="max-w-6xl m-auto w-full">
        <div
          className={` flex justify-between
           items-center mb-4`}
        >
          {window.location.pathname === "/" ? (
            <NavLink
              to="/create"
              className={`w-36 flex items-center bg-linear-to-r 
                  from-teal-900 to-teal-700
             rounded-sm  p-3 cursor-pointer`}
            >
              <Button
                type="button"
                text="Add task"
                classNames={`text-white flex-1 w-full
                 font-semibold text-base mr-2 select-none cursor-pointer`}
              />
              <svg
                width="24"
                height="24"
                className={`stroke-white`}
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
          <div className=" relative">
            <div className={`flex items-center `}>
              <h1
                className={`hidden sm:text-normal sm:flex font-semibold text-[#0A2D29] mr-2`}
              >
                {localStorage.getItem("username")}
              </h1>
              <div
                style={{
                  backgroundImage: profilePicture && `url(${profilePicture})`,
                  backgroundSize: "100%",
                }}
                className={`w-10 rounded-md h-10 mr-2 bg-no-repeat bg-center bg-cover`}
              ></div>
              <img
                src={
                  showMenu
                    ? `/src/assets/close-menu.svg`
                    : `/src/assets/open-menu.svg`
                }
                className=" cursor-pointer"
                onClick={() => setShowMenu(!showMenu)}
                alt="toggle-menu"
              />
            </div>
            {showMenu && <Menu />}
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto w-full">{children}</div>
    </div>
  );
};

export default DashboardLayout;
