import {
  GET_USER_FAILURE,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  RESET_USER,
  UPDATE_USER_FAILURE,
  UPDATE_USER_PASSWORD_FAILURE,
  UPDATE_USER_PASSWORD_REQUEST,
  UPDATE_USER_PASSWORD_SUCCESS,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  RESET_PASSWORD_UPDATE,
  UPDATE_PROFILE_PICTURE_REQUEST,
  UPDATE_PROFILE_PICTURE_SUCCESS,
  UPDATE_PROFILE_PICTURE_FAILURE,
} from "../types/userTypes";

const initialState = {
  user: null,
  error: null,
  loading: false,
  message: null,
  isEditingLoading: false,
  isEditingImage: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_REQUEST:
      return { ...state, loading: true, error: null };
    case GET_USER_SUCCESS:
      return { ...state, loading: false, error: null, user: action.payload };
    case GET_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        user: null,
        message: action.payload.message,
      };
    case RESET_USER:
      return initialState;
    case UPDATE_USER_REQUEST:
      return { ...state, error: null, message: null, isEditingLoading: true };
    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        isEditingLoading: false,
        error: null,
        user: action.payload.user,
        message: action.payload.message,
      };
    case UPDATE_USER_FAILURE:
      return {
        ...state,
        isEditingLoading: false,
        error: action.payload,
        message: null,
      };
    case UPDATE_USER_PASSWORD_FAILURE:
      return {
        ...state,
        isEditingLoading: false,
        error: action.payload,
        message: null,
      };
    case UPDATE_USER_PASSWORD_REQUEST:
      return { ...state, isEditingLoading: true, error: null };
    case UPDATE_USER_PASSWORD_SUCCESS:
      return {
        ...state,
        isEditingLoading: false,
        error: null,
        message: action.payload,
      };
    case RESET_PASSWORD_UPDATE:
      return { ...state, isEditingLoading: false, error: null, message: null };
    case UPDATE_PROFILE_PICTURE_REQUEST:
      return { ...state, isEditingImage: true };
    case UPDATE_PROFILE_PICTURE_SUCCESS:
      return { ...state, isEditingImage: false, message: action.payload.message };
    case UPDATE_PROFILE_PICTURE_FAILURE:
      return {...state, isEditingImage: false, error: action.payload.error}
    default:
      return state;
  }
};

export default userReducer;
