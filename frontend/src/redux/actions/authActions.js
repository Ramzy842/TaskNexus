
import {
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  RESET_AUTH,
} from "../types/authTypes";
import { login } from "../../services/auth";

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

const resetAuth = (res) => {
  return {
    type: RESET_AUTH
  }
}

const loginUser = (email, password) => {
  return async (dispatch) => {
    dispatch(loginRequest());
    try {
      const res = await login(email, password);
      if (res.errors) {
        dispatch(loginFailure({ errors: res.errors, message: "" }));
      }
      if (res.message) {
        dispatch(loginFailure({ errors: null, message: res.message }));
      } else if (res.data) {
        localStorage.setItem("accessToken", res.data.token);
        localStorage.setItem("id", res.data.user.id)
        localStorage.setItem("username", res.data.user.username)
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
