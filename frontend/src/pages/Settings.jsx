import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import AccountInfo from "../components/AccountInfo";
import { useDispatch, useSelector } from "react-redux";
import Button from "../components/Button";
import SkeletonSettings from "../components/SkeletonSettings";
import Input from "../components/Input";
import {

  updateUserPassword,
} from "../redux/actions/userActions";

const PasswordChange = ({ loading }) => {
  const [edit, setEdit] = useState(false);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const dispatch = useDispatch();
  const handlePasswordUpdate = () => {
    console.log(oldPass, newPass);
    dispatch(updateUserPassword(oldPass, newPass));
  };
  return (
    !loading && (
      <div className={`bg-cyan-950 mb-4 ${edit ? "pb-4" : ""}`}>
        <div className=" rounded-sm p-2 md:py-1 md:px-1 md:pl-4 md:flex items-center justify-between mb-2">
          <h1 className="text-white text-sm font-semibold mb-1 md:mb-0">
            Password and Authentication
          </h1>
          <div
            onClick={() => setEdit(!edit)}
            className={`flex justify-center items-center ${
              edit
                ? "bg-yellow-600 hover:bg-yellow-700"
                : "bg-cyan-600 hover:bg-cyan-700"
            } rounded-sm py-2 px-4 cursor-pointer`}
          >
            {!edit && <img src="/src/assets/edit-settings.svg" alt="edit" />}
            <Button
              type="button"
              text={edit ? "Cancel" : "Change Password"}
              classNames={`text-white font-semibold text-sm ${
                !edit && "ml-2"
              } select-none cursor-pointer`}
            />
          </div>
        </div>
        {edit && (
          <form action="#" className="p-4 w-full">
            <Input
              onChange={(e) => setOldPass(e.target.value)}
              value={oldPass}
              label="Enter you old password"
              labelClass="text-white font-medium text-xs mb-2"
              classNames=" bg-white rounded-sm py-2 px-2 text-xs md:w-sm outline-none border-b-2 border-transparent focus:border-blue-400 mb-2"
            />
            <Input
              onChange={(e) => setNewPass(e.target.value)}
              value={newPass}
              label="Enter you new password"
              labelClass="text-white font-medium text-xs mb-2"
              classNames=" bg-white rounded-sm py-2 px-2 text-xs md:w-sm outline-none border-b-2 border-transparent focus:border-blue-400 mb-2"
            />
            <div onClick={handlePasswordUpdate} className="flex justify-center items-center bg-cyan-600 hover:bg-cyan-700 rounded-sm py-2 px-4 cursor-pointer w-full md:w-sm">
              <Button
                type="button"
                text="Save"
                classNames="text-white font-semibold text-sm  select-none cursor-pointer"
              />
            </div>
          </form>
        )}
      </div>
    )
  );
};

const RemoveAccount = ({ loading }) => {
  return (
    !loading && (
      <div className="flex md:flex-col justify-between items-start">
        <div className="flex flex-col md:mb-2">
          <h1 className="font-semibold text-sm text-teal-900 uppercase">
            Account Removal
          </h1>
          <p className="text-xs w-11/12 font-light text-gray-600">
            Deleting your account is permanent and cannot be undone. Once your
            account is deleted, all your data, including tasks and personal
            information, will be permanently removed from our system.
          </p>
        </div>
        <div className="flex justify-center md:justify-between gap-4 items-center bg-[#E3123F] hover:bg-red-700 rounded-sm py-2 px-8 md:px-4 cursor-pointer">
          <Button
            type="button"
            text="Delete Account"
            classNames="text-white text-xs md:text-sm font-semibold  select-none cursor-pointer"
          />
          <img src="/src/assets/remove-acc.svg" className="" alt="edit" />
        </div>
      </div>
    )
  );
};

const Settings = () => {
  const profilePicture = localStorage.getItem("profilePicture");
  const loading = useSelector((state) => state.user.loading);
  console.log("Rerendering parent settings");
  return (
    <DashboardLayout>
      <h1 className="font-medium text-xl text-teal-950 mb-4">My Account</h1>
      {loading ? (
        <SkeletonSettings />
      ) : (
        <>
          <div className="w-full flex justify-center ">
            <div
              style={{
                backgroundImage: profilePicture && `url(${profilePicture})`,
                backgroundSize: "100%",
              }}
              className={`relative w-24 rounded-3xl group rounded-full overflow-hidden bg-clip-border h-24 md:h-32 md:w-32 mb-4`}
            >
              <div className="bg-gray-800 top-0 right-0 bottom-0 left-0 absolute opacity-0 group-hover:opacity-80 bg-[url('/src/assets/edit-settings.svg')] bg-no-repeat bg-center cursor-pointer"></div>
            </div>
          </div>
          <AccountInfo />
          <PasswordChange loading={loading} />
          <RemoveAccount loading={loading} />
        </>
      )}
    </DashboardLayout>
  );
};

export default Settings;
