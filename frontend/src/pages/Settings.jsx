import React from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import AccountInfo from "../components/AccountInfo";
import { useSelector } from "react-redux";

const Settings = () => {
  const profilePicture = localStorage.getItem("profilePicture");
  
  
  return (
    <DashboardLayout>
      <h1 className="font-medium text-2xl text-teal-950 mb-4">My Account</h1>
      <div className="w-full flex justify-center">
        <div
          style={{
            backgroundImage: profilePicture && `url(${profilePicture})`,
            backgroundSize: "100%",
          }}
          className={`w-32 rounded-3xl rounded-full h-32`}
        ></div>
      </div>
      <AccountInfo />
    </DashboardLayout>
  );
};

export default Settings;
