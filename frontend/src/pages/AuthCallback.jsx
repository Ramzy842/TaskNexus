import { useEffect } from "react";
import { useNavigate } from "react-router";
import api from "../api/axiosInstance";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const id = params.get("id");
    const username = params.get("username");
    if (accessToken && id && username) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("username", username);
      localStorage.setItem("isGoogleAcc", true);
      localStorage.setItem("id", id);
      api.get(`/users/${id}/profile-picture`).then((profilePicture) => {
        localStorage.setItem(
          "profilePicture",
          profilePicture.data.data.profilePictureUrl
        );
        navigate("/");
      });
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return <p>Logging you in...</p>;
};

export default AuthCallback;
