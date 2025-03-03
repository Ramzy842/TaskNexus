import React from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import AuthLayout from "../layouts/AuthLayout";

const NotFound = () => {
  return localStorage.getItem("accessToken") ? (
    <DashboardLayout>
      <h1 className=" text-center h-4/5 flex justify-center items-center text-3xl font-bold text-teal-900">
        404 | Page can't be found
      </h1>
    </DashboardLayout>
  ) : (
    <AuthLayout>
      <h1 className=" text-center h-4/5 flex justify-center items-center text-3xl font-bold text-teal-900">
        404 | Page can't be found
      </h1>
    </AuthLayout>
  );
};

export default NotFound;
