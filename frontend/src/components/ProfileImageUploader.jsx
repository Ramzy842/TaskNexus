import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearMessages,
  deleteProfilePic,
  updateProfilePicture,
} from "../redux/actions/userActions";

const ProfileImageUploader = () => {
  const dispatch = useDispatch();
  const [pic, setPic] = useState(null);
  const { profilePicture: profilePic, isEditingImage } = useSelector(
    (state) => state.user
  );
  const handleDeleteImage = async () => {
    dispatch(deleteProfilePic());
  };
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("avatar", file);
      dispatch(clearMessages());
      dispatch(updateProfilePicture(formData));
    }
  };
  useEffect(() => {
    const profilePicture = localStorage.getItem("profilePicture");
    setPic(profilePicture);
  }, []);
  useEffect(() => {
    setPic(profilePic);
  }, [profilePic]);
  return (
    <div className="w-full flex justify-center transition duration-300">
      <input
        type="file"
        name="avatar"
        accept="image/*"
        className="hidden"
        id="profileImageInput"
        onChange={handleImageChange}
      />
      <div className="relative">
        <div
          style={{
            backgroundImage: pic && `url(${pic})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className={`shadow-2xl relative w-24 md:w-32 h-24 md:h-32 rounded-full overflow-hidden bg-gray-400 group ${
            isEditingImage && "animate-pulse border-2 border-teal-500"
          }`}
        >
          <div className="transition duration-200 absolute inset-0 opacity-0 group-hover:opacity-80 bg-gray-800 flex items-center justify-center gap-4">
            <label
              htmlFor="profileImageInput"
              className="cursor-pointer bg-blue-500 rounded-sm p-1 flex items-center justify-center"
            >
              <img
                src="/src/assets/edit-profile-pic.svg"
                alt="Edit"
                className="w-6 h-6 hover:opacity-100 transition duration-200 select-none"
              />
            </label>
            <button
              onClick={handleDeleteImage}
              className="cursor-pointer bg-red-500 hover:bg-red-600 rounded-sm p-1"
            >
              <img
                src="/src/assets/remove-acc.svg"
                alt="Delete"
                className="w-6 h-6 hover:opacity-100 transition duration-200 select-none"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileImageUploader;
