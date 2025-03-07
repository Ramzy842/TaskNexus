import { useEffect, useState } from "react";
import Button from "./Button";
import Input from "./Input";
import { useDispatch, useSelector } from "react-redux";
import { updateUserData } from "../redux/actions/userActions";
import { SkeletonAccInfoCard } from "./SkeletonSettings";

const AccountInfoCard = ({ title, value, placeholder, info, setInfo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCount, setEditedCount] = useState(0);
  const [inputVal, setInputVal] = useState(value);
  const [errors, setErrors] = useState(null);
  const error = useSelector((state) => state.user.error);
  const loading = useSelector((state) => state.user.isEditingLoading);
  const isGoogleAcc = JSON.parse(localStorage.getItem("isGoogleAcc"))
  const dispatch = useDispatch();
  const cred = useSelector((state) => state.user.user?.[title.toLowerCase()] ?? "");

  const handleSave = () => {
    const updatedField = {};
    if (inputVal.length && value !== inputVal) {
      updatedField[title.toLowerCase()] = inputVal;
      console.log(updatedField);
      dispatch(updateUserData(updatedField));
    }
  };

  useEffect(() => {
    if (cred !== value) {
      setIsEditing(false);
      const newInfo = info.map((el) =>
        el.title === title ? { ...el, value: cred } : el
      );
      setInfo(newInfo);
      setEditedCount(0);
    }
  }, [cred]);

  useEffect(() => {
    if (!error) return;
    handleErrors(error);
  }, [error]);

  const handleErrors = (errors) => {
    const target = title.toLowerCase();
    let errorsArr = errors.filter((err) =>
      new RegExp(`\\b${target}\\b`, "i").test(err)
    );
    setErrors(errorsArr.length ? errorsArr : null);
  };

  if ((loading && editedCount)) return <SkeletonAccInfoCard />;
  return isGoogleAcc && title === "Email" ? <></> : <div>
      <div
        className={`flex items-center
        mb-2 justify-between`}
      >
        <div className=" max-w-56 md:max-w-sm">
          <p className="text-teal-900 font-semibold">{title}</p>
          {isEditing ? (
            <div className="flex flex-col">
              <Input
                placeholder={placeholder}
                value={inputVal}
                onChange={(e) => {
                  setInputVal(e.target.value);
                  setErrors(null);
                }}
                classNames={`text-teal-900 font-normal bg-white text-xs py-2 px-2 rounded-sm w-4/5 sm:w-sm md:w-md max-w-lg outline-none `}
              />
            </div>
          ) : (
            <p className="text-teal-800  font-normal text-sm truncate">{value}</p>
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
                setErrors(null);
                setEditedCount(0);
              }}
              className="flex justify-center items-center bg-[#E3123F] hover:bg-red-700 rounded-sm py-2 px-4 cursor-pointer"
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
              setEditedCount((prev) => prev + 1);
            }}
            className="flex justify-center items-center bg-teal-700 hover:bg-teal-800 rounded-sm py-2 px-4 cursor-pointer"
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
      {errors && (
        <div className="text-xs bg-red-200 text-red-700 py-1 px-2 rounded-sm  relative flex w-full flex-col">
          <span className="self-end bg-red-500 text-white rounded-sm px-1 font-bold text-xs ">
            {errors.length}
          </span>
          <div>
            {errors.map((error, index) => (
              <p key={index} className="">
                - {error}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  
};

export default AccountInfoCard;
