import { useEffect, useState } from "react";
import Button from "./Button";
import Input from "./Input";
import { useDispatch, useSelector } from "react-redux";
import { updateUserData } from "../redux/actions/userActions";
import { SkeletonAccInfoCard } from "./SkeletonSettings";

const Actions = ({
  handleSave,
  setIsEditing,
  setErrors,
  setEditedCount,
  setInputVal,
  originalValue,
}) => {
  return (
    <div className="flex gap-x-2 self-end sm:self-auto">
      <div
        onClick={handleSave}
        className="flex justify-center items-center bg-cyan-600 hover:bg-cyan-700 rounded-sm py-2 px-4 cursor-pointer"
      >
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
          setInputVal(originalValue);
        }}
        className="flex justify-center items-center bg-[#E3123F] hover:bg-red-700 rounded-sm py-2 px-4 cursor-pointer"
      >
        <Button
          type="button"
          text="Cancel"
          classNames="text-white font-semibold text-sm select-none cursor-pointer"
        />
      </div>
    </div>
  );
};

const AccountInfoCard = ({ title, value, placeholder, info, setInfo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCount, setEditedCount] = useState(0);
  const [inputVal, setInputVal] = useState(value);
  const [errors, setErrors] = useState(null);
  const error = useSelector((state) => state.user.error);
  const loading = useSelector((state) => state.user.isEditingLoading);
  const isGoogleAcc = JSON.parse(localStorage.getItem("isGoogleAcc"));
  const dispatch = useDispatch();
  const cred = useSelector(
    (state) => state.user.user?.[title.toLowerCase()] ?? ""
  );

  const handleSave = () => {
    const updatedField = {};
    if (value !== inputVal) {
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
  }, [cred, info, setInfo, title, value]);

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
  if (loading && editedCount) return <SkeletonAccInfoCard />;
  return isGoogleAcc && title === "Email" ? (
    <></>
  ) : (
    <div>
      <div
        className={`flex ${isEditing ? "flex-col sm:flex-row sm:items-center" : "items-center" } 
        mb-2 justify-between`}
      >
        <div className="sm:max-w-sm">
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
                classNames={`text-teal-900 font-normal w-full text-xs p-2 rounded-sm sm:w-sm md:w-md max-w-lg outline-none `}
              />
            </div>
          ) : (
            <p className="text-teal-800  font-normal text-sm truncate">
              {value}
            </p>
          )}
        </div>

        {isEditing ? (
          <Actions
            handleSave={handleSave}
            setIsEditing={setIsEditing}
            setErrors={setErrors}
            setEditedCount={setEditedCount}
            setInputVal={setInputVal}
            originalValue={value}
          />
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
        <div className="text-xs bg-[#E3123F] text-red-700 p-2 mb-2 rounded-xs relative flex flex-col w-full sm:max-w-sm">
          <span className="self-end bg-red-500 text-white rounded-sm px-1 font-bold text-xs ">
            {errors.length}
          </span>
          <div>
            {errors.map((error, index) => (
              <div key={index} className="flex items-start mb-2">
                <img
                  src="/src/assets/x-circle.svg"
                  className="mr-1"
                  alt="error"
                />
                <p key={index} className="text-white">
                  {error}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountInfoCard;
