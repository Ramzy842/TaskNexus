import { getUser } from "../../services/users";
import {
  GET_USER_FAILURE,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  RESET_USER,
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

const resetUser = () => {
  return {
      type: RESET_USER
  }
}

export { getUserData, resetUser };
