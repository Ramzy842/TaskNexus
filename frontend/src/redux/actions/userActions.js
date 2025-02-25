import { getUser } from "../../services/users"
import { GET_USER_FAILURE, GET_USER_REQUEST, GET_USER_SUCCESS } from "../types/userTypes"

const getUserSuccess = (user) => {
    return {
        type: GET_USER_SUCCESS,
        payload: user
    }
}
const getUserRequest = () => {
    return {
        type: GET_USER_REQUEST
    }
}

const getUserFailure = (error) => {
    return {
        type: GET_USER_FAILURE,
        payload: error
    }
}


const getUserData = (id) => {
  return async (dispatch) => {
    dispatch(getUserRequest());
    try {
      const res = await getUser(id);
      console.log(res);
      dispatch(getUserSuccess(res.data));
    } catch (error) {
      console.log(error);
      dispatch(getUserFailure(error));
    }
  };
};

export {getUserData}
