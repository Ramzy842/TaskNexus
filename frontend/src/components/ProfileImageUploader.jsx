import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { getUserData } from "../redux/actions/userActions";

const ProfileImageUploader = () => {
  const [pic, setPic] = useState(localStorage.getItem("profilePicture"));
  const dispatch = useDispatch();
  const handleDeleteImage = async () => {
    const id = localStorage.getItem("id")
    console.log("Deleting image...");
    await api.delete(`/users/${id}/profile-picture`);
    console.log("Profile pic deleted");
    localStorage.setItem("profilePicture", "https://emedia1.nhs.wales/HEIW2/cache/file/F4C33EF0-69EE-4445-94018B01ADCF6FD4.png")
    dispatch(getUserData(id))
  }
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("avatar", file);
      try {
        const id = localStorage.getItem("id");
        await api.post(`/users/${id}/profile-picture`, formData, {
          headers: { "Content-Type": "multipart/form-da ta" },
        });
        const profilePicture = await api.get(`/users/${id}/profile-picture`)
        localStorage.setItem("profilePicture", profilePicture.data.data.profilePictureUrl);
        setPic(profilePicture.data.data.profilePictureUrl);
        dispatch(getUserData(localStorage.getItem("id")));
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <div className="w-full flex justify-center transition duration-300">
      {/* Hidden file input */}
      <input
        type="file"
        name="avatar"
        accept="image/*"
        className="hidden"
        id="profileImageInput"
        onChange={handleImageChange}
      />
  
      {/* Profile Image Container */}
      <div className="relative">
        <div
          style={{
            backgroundImage: pic ? `url(${pic})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className="shadow-2xl relative w-24 md:w-32 h-24 md:h-32 rounded-full overflow-hidden bg-gray-300 group"
        >
          {/* Hover Overlay */}
          <div className="transition duration-200 absolute inset-0 opacity-0 group-hover:opacity-80 bg-gray-800 flex items-center justify-center gap-4">
            {/* Edit Button (Only triggers file input) */}
            <label htmlFor="profileImageInput" className="cursor-pointer bg-blue-500 rounded-sm p-1 flex items-center justify-center">
              <img
                src="/src/assets/edit-profile-pic.svg"
                alt="Edit"
                className="w-6 h-6 hover:opacity-100 transition duration-200 select-none"
              />
            </label>
  
            {/* Delete Button (Normal button) */}
            <button onClick={handleDeleteImage} className="cursor-pointer bg-red-500 hover:bg-red-600 rounded-sm p-1">
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
