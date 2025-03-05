import { useEffect, useState } from "react";

const ProfileImageUploader = ({profilePicture}) => {
  const [pic, setPic] = useState(null)
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPic(imageUrl);
    }
  };
  return (
    <div className="w-full flex justify-center transition duration-300">
      {/* Hidden file input */}
      <input
        type="file"
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
          <div className="absolute inset-0 opacity-0 group-hover:opacity-80 bg-gray-800 bg-[url('/src/assets/edit-settings.svg')] bg-no-repeat bg-center"></div>
        </div>
      </label>
    </div>
  );
};

export default ProfileImageUploader;
