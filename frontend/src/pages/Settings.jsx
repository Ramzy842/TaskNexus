import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import AccountInfo from "../components/AccountInfo";
import { useDispatch, useSelector } from "react-redux";
import Button from "../components/Button";
import SkeletonSettings from "../components/SkeletonSettings";
import Input from "../components/Input";
import {
  clearMessages,
  getUserData,
  reset_password_update,
  updateUserPassword,
} from "../redux/actions/userActions";
import DeleteUserConfirmation from "../components/DeleteUserConfirmation";
import ProfileImageUploader from "../components/ProfileImageUploader";

const PasswordChange = ({ loading }) => {
  const [edit, setEdit] = useState(false);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [oldPasswordErrors, setOldPasswordErrors] = useState(null);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newPasswordErrors, setNewPasswordErrors] = useState(null);
  const errors = useSelector((state) => state.user.error);
  const message = useSelector((state) => state.user.passwordMessage);
  const dispatch = useDispatch();
  const handlePasswordUpdate = () => {
    console.log(oldPass, newPass);
    dispatch(updateUserPassword(oldPass, newPass));
  };
  const handleErrors = (errors) => {
    let oldPassErrors = errors.filter((error) => /\bold\b/i.test(error));
    let newPassErrors = errors.filter(
      (error) => /\bnew\b/i.test(error) || /\bPassword Should\b/i.test(error)
    );
    setOldPasswordErrors(oldPassErrors.length ? oldPassErrors : null);
    setNewPasswordErrors(newPassErrors.length ? newPassErrors : null);
  };
  useEffect(() => {
    if (errors) handleErrors(errors);
    else {
      setOldPasswordErrors(null);
      setNewPasswordErrors(null);
    }
  }, [errors]);
  useEffect(() => {
    if (message) {
      setOldPass("");
      setNewPass("");
      setTimeout(() => {
        dispatch(reset_password_update());
        setEdit(false);
      }, 3000);
    }
  }, [message]);
  return (
    !loading && (
      <div
        className={`bg-teal-950 rounded-sm mb-4 ${
          edit ? "pb-4" : ""
        } transition duration-300`}
      >
        <div className=" rounded-sm p-2 md:py-1 md:px-1 md:pl-4 md:flex items-center justify-between ">
          <h1
            className={`text-white ${
              edit && "mt-2"
            } text-sm font-semibold md:mb-0`}
          >
            Password and Authentication
          </h1>
          {!edit && (
            <div
              onClick={() => setEdit(!edit)}
              className={`flex justify-center items-center bg-teal-700 hover:bg-teal-800
                        rounded-sm py-2 px-4 cursor-pointer`}
            >
              <img src="/src/assets/edit-settings.svg" alt="edit" />

              <Button
                type="button"
                text="Change Password"
                classNames={`text-white font-semibold text-sm 
                                ml-2
                             select-none cursor-pointer`}
              />
            </div>
          )}
        </div>
        {edit && (
          <>
            {message && (
              <p
                className={`bg-green-200 text-green-800 text-xs w-full md:w-sm mx-4 rounded-xs p-2`}
              >
                {message}
              </p>
            )}
            <form action="#" className="px-4 py-2 w-full">
              <Input
                maxlength="32"
                src="/src/assets/lock.svg"
                type={showOldPassword ? "text" : "password"}
                onChange={(e) => {
                  setOldPasswordErrors(null);
                  setOldPass(e.target.value);
                }}
                value={oldPass}
                setShowPassword={setShowOldPassword}
                showPassword={showOldPassword}
                label="Enter you old password"
                labelClass="text-white font-medium text-xs mb-2"
                classNames="rounded-sm py-2 px-2 text-xs w-full md:w-sm outline-none "
              />
              {oldPasswordErrors && (
                <div className="text-xs bg-[#E3123F] text-red-700 py-2 px-2 mb-2 rounded-xs relative flex flex-col w-sm">
                  <span className="self-end bg-red-500 text-white rounded-sm px-1 font-bold text-xs ">
                    {oldPasswordErrors.length}
                  </span>
                  <div>
                    {oldPasswordErrors.map((error, index) => (
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
              <Input
                type={showNewPassword ? "text" : "password"}
                src="/src/assets/lock.svg"
                maxlength="32"
                onChange={(e) => {
                  setNewPasswordErrors(null);
                  setNewPass(e.target.value);
                }}
                value={newPass}
                setShowPassword={setShowNewPassword}
                showPassword={showNewPassword}
                label="Enter you new password"
                labelClass="text-white font-medium text-xs mb-2"
                classNames="rounded-sm py-2 px-2 text-xs w-full md:w-sm outline-none "
              />
              {newPasswordErrors && (
                <div className="text-xs bg-[#E3123F] text-red-700 py-2 px-2 mb-2 rounded-xs relative flex flex-col w-sm">
                  <span className="self-end bg-red-500 text-white rounded-sm px-1 font-bold text-xs ">
                    {newPasswordErrors.length}
                  </span>
                  <div>
                    {newPasswordErrors.map((error, index) => (
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
              <div
                onClick={handlePasswordUpdate}
                className="flex justify-center items-center bg-cyan-600 hover:bg-cyan-700 rounded-sm py-2 px-4 cursor-pointer w-full md:w-sm mb-2"
              >
                <Button
                  type="button"
                  text="Save"
                  classNames="text-white font-semibold text-sm  select-none cursor-pointer"
                />
              </div>
              <div
                onClick={() => {
                  setEdit(!edit);
                  setOldPasswordErrors(null);
                  setNewPasswordErrors(null);
                  setOldPass("");
                  setNewPass("");
                }}
                className="flex justify-center items-center bg-[#E3123F] hover:bg-red-700 rounded-sm py-2 px-4 cursor-pointer w-full md:w-sm"
              >
                <Button
                  type="button"
                  text="Cancel"
                  classNames="text-white font-semibold text-sm  select-none cursor-pointer"
                />
              </div>
            </form>
          </>
        )}
      </div>
    )
  );
};

const RemoveAccount = ({ loading }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  return (
    !loading && (
      <div className="flex flex-col justify-between items-start">
        <div className="flex flex-col mb-4">
          <h1 className="font-semibold text-sm text-teal-900 uppercase">
            Account Removal
          </h1>
          <p className="text-xs w-11/12 font-light text-gray-600">
            Deleting your account is permanent and cannot be undone. Once your
            account is deleted, all your data, including tasks and personal
            information, will be permanently removed from our system.
          </p>
        </div>
        <div
          onClick={() => setShowConfirmation(true)}
          className="flex justify-center md:justify-between gap-4 items-center bg-[#E3123F] hover:bg-red-700 rounded-sm py-2 px-8 md:px-4 cursor-pointer w-full sm:w-auto"
        >
          <Button
            type="button"
            text="Delete Account"
            classNames="text-white text-xs md:text-sm font-semibold  select-none cursor-pointer"
          />
          <img src="/src/assets/remove-acc.svg" className="" alt="edit" />
        </div>
        {showConfirmation && (
          <DeleteUserConfirmation setShowConfirmation={setShowConfirmation} />
        )}
      </div>
    )
  );
};

const Settings = () => {
  const loading = useSelector((state) => state.user.loading);
  const isGoogleAcc = JSON.parse(localStorage.getItem("isGoogleAcc"));
  const message = useSelector((state) => state.user.message);
  const success = useSelector((state) => state.user.success);
  const dispatch = useDispatch();
  useEffect(() => {
    if (message) {
      let timeoutId = setTimeout(() => {
        dispatch(clearMessages());
      }, 5000);
      return () => clearTimeout(timeoutId);
    }
    
  }, [message]);
  return (
    <DashboardLayout>
      {message && (
        <p
          className={`absolute bottom-0 right-0  border-b-4 ${
            success
              ? "bg-teal-800 border-teal-400 text-white"
              : " bg-red-800 border-red-400 text-white"
          } text-xs w-full md:w-sm rounded-xs p-4`}
        >
          {message}
        </p>
      )}
      <h1 className="font-medium text-xl text-teal-900 mb-4">My Account</h1>
      {loading ? (
        <SkeletonSettings />
      ) : (
        <>
          <ProfileImageUploader />
          <AccountInfo />
          {!isGoogleAcc && <PasswordChange loading={loading} />}
          <RemoveAccount loading={loading} />
        </>
      )}
    </DashboardLayout>
  );
};

export default Settings;
