import { useEffect, useRef, useState } from "react";
import Button from "../components/Button";
import { NavLink } from "react-router";

import { useSelector } from "react-redux";

import Menu from "../components/Menu";
import api from "../api/axiosInstance";

const DashboardLayout = ({ children }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [profilePicture, setProfilePicture] = useState(
    localStorage.getItem("profilePicture")
  );
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [expiresAt, setExpiresAt] = useState(
    parseInt(localStorage.getItem("expiresAt"), 10) || 0 // Ensure valid number
  );

  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    if (user && username !== user.username) {
      setUsername(user.username);
      localStorage.setItem("username", user.username);
    }
  }, [user]);

  useEffect(() => {
    const handleStorageChange = () => {
      setProfilePicture(localStorage.getItem("profilePicture"));
    };
  
    window.addEventListener("storage", handleStorageChange);
  
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  // const fetchProfilePicture = async () => {
  //   const now = Date.now();

  //   // Check if the profile picture exists and hasn't expired
  //   if (profilePicture && now < expiresAt) {
  //     console.log("✅ Using cached profile picture");
  //     return;
  //   }

  //   try {
  //     const id = localStorage.getItem("id");
  //     const res = await api.get(`/users/${id}/profile-picture`);
 
  //     console.log("🔄 Fetching new profile picture...");
  //     setProfilePicture(res.data.data.profilePictureUrl);
  //     setExpiresAt(res.data.data.expiresAt);

  //     // Store values in localStorage
  //     localStorage.setItem("profilePicture", res.data.data.profilePictureUrl);
  //     localStorage.setItem("expiresAt", res.data.data.expiresAt);
  //   } catch (error) {
  //     console.error("❌ Error fetching profile picture:", error);
  //   }
  // };

  // Fetch profile picture only when necessary
  // useEffect(() => {
  //   fetchProfilePicture();
  // }, [user]); // Run when the user changes

  return  <div className="grid grid-rows-[auto_1fr] min-h-screen bg-linear-to-bl from-[#E3EAE9] to-[#A3C4C4] p-4">
      {/* Gradient Bar */}
      <div className="absolute left-0 right-0 top-0 h-2 w-full bg-gradient-to-r from-red-500 from-10% via-green-500 via-50% to-blue-500 to-90% animate-pulse"></div>

      <div className="max-w-6xl m-auto w-full">
        <div className="flex justify-between items-center mb-4">
          {window.location.pathname === "/" ? (
            <NavLink to="/create" className="w-36 flex items-center bg-teal-600 hover:bg-teal-700 shadow-md rounded-sm p-3 cursor-pointer">
              <Button type="button" text="Add task" classNames="text-white flex-1 w-full font-semibold text-base mr-2 select-none cursor-pointer" />
              <svg width="24" height="24" className="stroke-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 12H19" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </NavLink>
          ) : (
            <NavLink to="/">
              <div className="flex justify-center items-center bg-teal-600 hover:bg-teal-700 rounded-sm p-3 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-left">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                <Button type="button" text="Return Home" classNames="text-white font-semibold text-md ml-2 select-none cursor-pointer" />
              </div>
            </NavLink>
          )}

          {/* Profile Section */}
          <div className="relative">
            <div className="flex items-center">
              <h1 className="hidden sm:text-normal sm:flex font-semibold text-teal-900 mr-2">{username}</h1>
              <div
                style={{
                  backgroundImage: profilePicture && `url(${profilePicture})`,
                }}
                className="w-10 h-10 rounded-md mr-2 bg-no-repeat bg-center bg-cover shadow-lg"
              ></div>
              <img
                src={showMenu ? `/src/assets/close-menu.svg` : `/src/assets/open-menu.svg`}
                className="cursor-pointer"
                onClick={() => setShowMenu(!showMenu)}
                alt="toggle-menu"
              />
            </div>
            {showMenu && <Menu setShowMenu={setShowMenu} />}
          </div>
        </div>
      </div>

      <div className="max-w-6xl overflow-x-hidden mx-auto w-full">
        {children}
      </div>
    </div>
  
};


export default DashboardLayout;
