import { useEffect } from "react";
import { useNavigate } from "react-router";
import api from "../api/axiosInstance";
import DashboardLayout from "../layouts/DashboardLayout";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const id = params.get("id");
    const username = params.get("username");
    const profilePicture = params.get("profilePicture");
    if (accessToken && id && username) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("username", username);
      localStorage.setItem("isGoogleAcc", true);
      localStorage.setItem("id", id);
      const defaultAvatar =
        "https://emedia1.nhs.wales/HEIW2/cache/file/F4C33EF0-69EE-4445-94018B01ADCF6FD4.png";
      if (
        profilePicture !== defaultAvatar &&
        !profilePicture.startsWith("https://lh3.googleusercontent.com")
      ) {
        api.get(`/users/${id}/profile-picture`).then((profilePicture) => {
          localStorage.setItem(
            "profilePicture",
            profilePicture.data.data.profilePictureUrl
          );
          navigate("/");
        });
      } else {
        localStorage.setItem("profilePicture", defaultAvatar);
        navigate("/");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <DashboardLayout>
      <p>Logging you in...</p>;
    </DashboardLayout>
  );
};

export default AuthCallback;
