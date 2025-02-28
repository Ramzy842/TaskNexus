import { useEffect } from 'react'
import { useNavigate } from 'react-router';

const AuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const accessToken = params.get("accessToken");
      const id = params.get("id");
      const username = params.get("username")
      const profilePicture = params.get("profilePicture")
      if (accessToken && id && username) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("id", id);
        localStorage.setItem("username", username);
        localStorage.setItem("profilePicture", profilePicture)
        navigate("/");
      } 
      else {
        navigate("/login");
      }
    }, [navigate]);
  
    return <p>Logging you in...</p>;
}

export default AuthCallback