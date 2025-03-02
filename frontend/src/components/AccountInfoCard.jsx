import React, { useState } from "react";
import Button from "./Button";
import Input from "./Input";
import { useDispatch } from "react-redux";
import { updateUserData } from "../redux/actions/userActions";

const AccountInfoCard = ({ title, value, placeholder }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const dispatch = useDispatch();
  const handleSave = () => {
    const updatedField = {};
    if (inputVal.length && value !== inputVal) {
      updatedField[title.toLowerCase()] = inputVal
      console.log(updatedField);
      dispatch(updateUserData(updatedField));
      setIsEditing(false);
    }
  };
  return (
    <div
      className={`flex ${isEditing ? "items-end" : "items-center"}
        mb-2 justify-between`}
    >
      <div className="w-full">
        <p className="text-teal-900 font-semibold">{title}</p>
        {isEditing ? (
          <Input
            placeholder={placeholder}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            classNames={`text-teal-900 font-normal bg-white text-xs py-2 px-2 rounded-sm w-4/5 sm:w-sm md:w-md max-w-lg outline-none border-b border-transparent focus:border-cyan-500`}
          />
        ) : (
          <p className="text-teal-800 font-normal text-sm">{value}</p>
        )}
      </div>

      {isEditing ? (
        <div className="flex gap-x-2">
          <div
            onClick={handleSave}
            className="flex justify-center items-center bg-cyan-600 hover:bg-cyan-700 rounded-sm py-2 px-4 cursor-pointer"
          >
            {/* <img src="/src/assets/save.svg" alt="save" /> */}
            <Button
              type="button"
              text="Save"
              classNames="text-white font-semibold text-sm  select-none cursor-pointer"
            />
          </div>
          <div
            onClick={() => {
              setIsEditing(false);
            }}
            className="flex justify-center items-center bg-yellow-600 hover:bg-yellow-700 rounded-sm py-2 px-4 cursor-pointer"
          >
            {/* <img src="/src/assets/remove-acc.svg" alt="save" /> */}
            <Button
              type="button"
              text="Cancel"
              classNames="text-white font-semibold text-sm select-none cursor-pointer"
            />
          </div>
        </div>
      ) : (
        <div
          onClick={() => {
            setIsEditing(true);
          }}
          className="flex justify-center items-center bg-cyan-600 hover:bg-cyan-700 rounded-sm py-2 px-4 cursor-pointer"
        >
          <img src="/src/assets/edit-settings.svg" alt="edit" />
          <Button
            type="button"
            text="Edit"
            classNames="text-white font-semibold text-md ml-2 select-none cursor-pointer"
          />
        </div>
      )}
    </div>
  );
};

export default AccountInfoCard;
