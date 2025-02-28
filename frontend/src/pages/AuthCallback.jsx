import { useEffect } from 'react'
import { useNavigate } from 'react-router';

const AuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const accessToken = params.get("accessToken");
      const id = params.get("id");
      const username = params.get("username")
      if (accessToken && id && username) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("id", id);
        localStorage.setItem("username", username);
        navigate("/");
      } 
      else {
        navigate("/login");
      }
    }, [navigate]);
  
    return <p>Logging you in...</p>;
}

export default AuthCallback