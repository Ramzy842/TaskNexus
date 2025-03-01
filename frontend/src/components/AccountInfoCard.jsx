import React from "react";
import Button from "./Button";

const AccountInfoCard = ({ title, value }) => {
  return (
    <div
      className="flex items-center mb-2 justify-between"
    >
      <div>
        <p className="text-teal-900 font-semibold">{title}</p>
        <p className="text-teal-800 font-normal text-sm">{value}</p>
      </div>
      <div className="flex justify-center items-center bg-cyan-600 hover:bg-cyan-700 rounded-sm py-2 px-4 cursor-pointer">
        <img src="/src/assets/edit-settings.svg" alt="edit" />
        <Button
          type="button"
          text="Edit"
          classNames="text-white font-semibold text-md ml-2 select-none cursor-pointer"
        />
      </div>
    </div>
  );
};

export default AccountInfoCard;
