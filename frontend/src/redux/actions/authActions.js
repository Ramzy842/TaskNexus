import {
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  RESET_AUTH,
} from "../types/authTypes";
import { login } from "../../services/auth";
import api from "../../api/axiosInstance";

const loginSuccess = (user) => {
  return {
    type: LOGIN_SUCCESS,
    payload: user,
  };
};

const loginRequest = () => {
  return {
    type: LOGIN_REQUEST,
  };
};

const loginFailure = (res) => {
  return {
    type: LOGIN_FAILURE,
    payload: {
      errors: res.errors,
      message: res.message,
    },
  };
};

const resetAuth = () => {
  return {
    type: RESET_AUTH,
  };
};

const loginUser = (email, password) => {
  return async (dispatch) => {
    dispatch(loginRequest());
    try {
      const res = await login(email, password);
      console.log(res.data);
      console.log(res);
      if (res.error) {
        dispatch(loginFailure({ errors: null, message: res.error }));
      } else if (res.errors) {
        dispatch(loginFailure({ errors: res.errors, message: null }));
      } else if (!res.success && res.message) {
        dispatch(loginFailure({ errors: null, message: res.message }));
      } else if (res.data) {
        localStorage.setItem("accessToken", res.data.token);
        localStorage.setItem("id", res.data.user.id);
        localStorage.setItem("username", res.data.user.username);
        const defaultAvatar =
          "https://emedia1.nhs.wales/HEIW2/cache/file/F4C33EF0-69EE-4445-94018B01ADCF6FD4.png";
        if (res.data.user.profilePicture !== defaultAvatar) {
          const profilePicture = await api.get(
            `/users/${localStorage.getItem("id")}/profile-picture`
          );
          console.log(profilePicture);
          localStorage.setItem(
            "profilePicture",
            profilePicture.data.data.profilePictureUrl
          );
        } else localStorage.setItem("profilePicture", defaultAvatar);
        localStorage.setItem("isGoogleAcc", false);
        dispatch(loginSuccess(res.data.user));
      }
    } catch (error) {
      console.log(error);
      dispatch(
        loginFailure({
          message: null,
          errors: error.response.data.error,
        })
      );
    }
  };
};

export { loginSuccess, loginRequest, loginFailure, resetAuth };

export default loginUser;
