import { getUser, updateUser } from "../../services/users";
import {
  GET_USER_FAILURE,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  RESET_USER,
  UPDATE_USER_FAILURE,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
} from "../types/userTypes";

const getUserSuccess = (user) => {
  return {
    type: GET_USER_SUCCESS,
    payload: user,
  };
};
const getUserRequest = () => {
  return {
    type: GET_USER_REQUEST,
  };
};

const getUserFailure = (error) => {
  return {
    type: GET_USER_FAILURE,
    payload: error,
  };
};

const getUserData = (id) => {
  return async (dispatch) => {
    dispatch(getUserRequest());
    try {
      const res = await getUser(id);
      dispatch(getUserSuccess(res.data));
    } catch (error) {
      dispatch(getUserFailure(error));
    }
  };
};

const updateUserDataRequest = () => {
  return {
    type: UPDATE_USER_REQUEST,
  };
};

const updateUserDataSuccess = (updateUser, message) => {
  return {
    type: UPDATE_USER_SUCCESS,
    payload:
    {
      user: updateUser, message
    },
  };
};

const updateUserDataFailure = (error) => {
  return {
    type: UPDATE_USER_FAILURE,
    payload: error,
  };
};

const updateUserData = (data) => {
  return async (dispatch) => {
    dispatch(updateUserDataRequest());
    try {
      const res = await updateUser(localStorage.getItem("id"), data);
      console.log(res);
      // this is where it's failing
      dispatch(updateUserDataSuccess(res.data, res.message));
      console.log(res.data);
      if (res.data)
        localStorage.setItem("username", res.data.username)
    } catch (error) {
      dispatch(updateUserDataFailure(error));
    }
  };
};

const resetUser = () => {
  return {
    type: RESET_USER,
  };
};

export { getUserData, resetUser, updateUserData };
