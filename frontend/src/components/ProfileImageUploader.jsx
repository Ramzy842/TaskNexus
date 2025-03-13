import { useEffect, useState } from "react";
import api from "../api/axiosInstance";

const ProfileImageUploader = ({ profilePicture }) => {
  const [pic, setPic] = useState(null);
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      /*
      Frontend: Send the image to your backend API → POST /users/:id/profile-picture.
      Backend:
        Upload to S3
        Get the S3 URL
        Update the user in MongoDB in the same request
        Return the updated user object with the new profilePicture
      */
      const formData = new FormData();
      formData.append("avatar", file);
      try {
        const id = localStorage.getItem("id");
        console.log(id);
        const res = await api.post(
          `/users/${id}/profile-picture`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        console.log(res);
        setPic(res.data.profilePicture);
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
      <label htmlFor="profileImageInput" className="cursor-pointer">
        <div
          style={{
            backgroundImage: profilePicture ? `url(${profilePicture})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className="shadow-2xl relative w-24 md:w-32 h-24 md:h-32 rounded-full overflow-hidden bg-gray-300 group"
        >
          {/* Hover Overlay */}
          <div className="transition duration-200 absolute inset-0 opacity-0 group-hover:opacity-80 bg-gray-800 bg-[url('/src/assets/edit-settings.svg')] bg-no-repeat bg-center"></div>
        </div>
      </label>
    </div>
  );
};

export default ProfileImageUploader;
