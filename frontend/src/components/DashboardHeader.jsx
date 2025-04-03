import { useState } from "react";
import Button from "./Button";
import { NavLink } from "react-router";
import Menu from "./Menu";
import { useSelector } from "react-redux";
const DashboardHeader = ({ username }) => {
  const [showMenu, setShowMenu] = useState(false);
  const profilePicture = useSelector((state) => state.user.profilePicture);
  return (
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
  );
};

export default DashboardHeader;
