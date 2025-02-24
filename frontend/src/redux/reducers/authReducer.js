import { LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS } from "../types/authTypes";
const initialState = {
  loading: false,
  user: null,
  error: null,
  message: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return { ...state, loading: true };
    case LOGIN_SUCCESS:
      return { error: null, loading: false, user: action.payload };
    case LOGIN_FAILURE:
      return {
        loading: false,
        error: action.payload.errors,
        message: action.payload.message,
      };
    default:
      return state;
  }
};

export default authReducer;
