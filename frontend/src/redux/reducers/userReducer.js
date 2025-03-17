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
  CLEAR_MESSAGES,
  DELETE_PROFILE_PIC_REQUEST,
  DELETE_PROFILE_PIC_SUCCESS,
  DELETE_PROFILE_PIC_FAILURE,
  SHOW_USER_ACC_DELETION_CONFIRMATION,
  HIDE_USER_ACC_DELETION_CONFIRMATION,
} from "../types/userTypes";

const initialState = {
  user: null,
  error: null,
  loading: false,
  message: null,
  passwordMessage: null,
  isEditingLoading: false,
  isEditingImage: false,
  profilePicture: null,
  success: null,
  showDeletionConfirmation: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_REQUEST:
      return { ...state, loading: true, error: null };
    case GET_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        user: action.payload.user,
        profilePicture: action.payload.profilePicture,
      };
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
        success: true,
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
      return {
        ...state,
        isEditingLoading: true,
        error: null,
        passwordMessage: null,
      };
    case UPDATE_USER_PASSWORD_SUCCESS:
      return {
        ...state,
        isEditingLoading: false,
        error: null,
        passwordMessage: action.payload,
      };
    case RESET_PASSWORD_UPDATE:
      return {
        ...state,
        isEditingLoading: false,
        error: null,
        passwordMessage: null,
      };
    case UPDATE_PROFILE_PICTURE_REQUEST:
      return {
        ...state,
        isEditingImage: true,
        message: null,
        profilePicture: null,
        error: null,
        success: null,
      };
    case UPDATE_PROFILE_PICTURE_SUCCESS:
      return {
        ...state,
        isEditingImage: false,
        message: action.payload.message,
        profilePicture: action.payload.profilePicture,
        error: null,
        success: true,
      };
    case UPDATE_PROFILE_PICTURE_FAILURE:
      return {
        ...state,
        isEditingImage: false,
        error: action.payload.error,
        message: null,
        profilePicture: state.profilePicture,
        success: false,
      };
    case DELETE_PROFILE_PIC_REQUEST:
      return { ...state, isEditingImage: true, message: null };
    case DELETE_PROFILE_PIC_SUCCESS:
      return {
        ...state,
        isEditingImage: false,
        message: action.payload.message,
        success: action.payload.success,
        profilePicture: action.payload.profilePic,
      };
    case DELETE_PROFILE_PIC_FAILURE:
      return {
        ...state,
        isEditingImage: false,
        message: null,
        success: false,
        error: action.payload.error,
      };
    case CLEAR_MESSAGES:
      return { ...state, message: null, passwordMessage: null };
    case SHOW_USER_ACC_DELETION_CONFIRMATION:
      return { ...state, showDeletionConfirmation: true };
    case HIDE_USER_ACC_DELETION_CONFIRMATION:
      return { ...state, showDeletionConfirmation: false };
    default:
      return state;
  }
};

export default userReducer;
