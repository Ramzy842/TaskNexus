import api from "../../api/axiosInstance";
import {
  deleteUser,
  getUser,
  updatePassword,
  updateUser,
} from "../../services/users";
import {
  CLEAR_MESSAGES,
  DELETE_PROFILE_PIC_FAILURE,
  DELETE_PROFILE_PIC_REQUEST,
  DELETE_PROFILE_PIC_SUCCESS,
  GET_USER_FAILURE,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  REMOVE_USER_FAILURE,
  REMOVE_USER_REQUEST,
  REMOVE_USER_SUCCESS,
  RESET_PASSWORD_UPDATE,
  RESET_USER,
  UPDATE_PROFILE_PICTURE_FAILURE,
  UPDATE_PROFILE_PICTURE_REQUEST,
  UPDATE_PROFILE_PICTURE_SUCCESS,
  UPDATE_USER_FAILURE,
  UPDATE_USER_PASSWORD_FAILURE,
  UPDATE_USER_PASSWORD_REQUEST,
  UPDATE_USER_PASSWORD_SUCCESS,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
} from "../types/userTypes";

const getUserSuccess = (user, profilePicture) => {
  return {
    type: GET_USER_SUCCESS,
    payload: { user, profilePicture },
  };
};
const getUserRequest = () => {
  return {
    type: GET_USER_REQUEST,
  };
};

const getUserFailure = (error, message) => {
  return {
    type: GET_USER_FAILURE,
    payload: { error, message },
  };
};

const getUserData = (id) => {
  return async (dispatch) => {
    dispatch(getUserRequest());
    try {
      const res = await getUser(id);
      if (res.error) {
        dispatch(getUserFailure(null, res.error));
      } else {
        console.log(res.data);
        if (
          res.data.profilePicture !==
          "https://emedia1.nhs.wales/HEIW2/cache/file/F4C33EF0-69EE-4445-94018B01ADCF6FD4.png"
        ) {
          const profilePicture = await api.get(
            `/users/${localStorage.getItem("id")}/profile-picture`
          );
          dispatch(
            getUserSuccess(res.data, profilePicture.data.data.profilePictureUrl)
          );
        } else dispatch(getUserSuccess(res.data, res.data.profilePicture));
      }
    } catch (error) {
      dispatch(getUserFailure(error, null));
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
    payload: {
      user: updateUser,
      message,
    },
  };
};

const updateUserDataFailure = (error) => {
  console.log(error);
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
      if (res.errors) dispatch(updateUserDataFailure(res.errors));
      else if (!res.success && res.message)
        dispatch(updateUserDataFailure([res.message]));
      else dispatch(updateUserDataSuccess(res.data, res.message));
      if (res.data) localStorage.setItem("username", res.data.username);
    } catch (error) {
      dispatch(updateUserDataFailure(error));
    }
  };
};

const updateUserPasswordRequest = () => {
  return {
    type: UPDATE_USER_PASSWORD_REQUEST,
  };
};

const updateUserPasswordFailure = (error) => {
  return {
    type: UPDATE_USER_PASSWORD_FAILURE,
    payload: error,
  };
};

const updateUserPasswordSuccess = (data) => {
  return {
    type: UPDATE_USER_PASSWORD_SUCCESS,
    payload: data,
  };
};

const updateUserPassword = (oldPassword, newPassword) => {
  return async (dispatch) => {
    dispatch(updateUserPasswordRequest());
    try {
      const res = await updatePassword(localStorage.getItem("id"), {
        oldPassword,
        newPassword,
      });
      if (res.errors) dispatch(updateUserPasswordFailure(res.errors));
      else if (!res.success && res.message)
        dispatch(updateUserPasswordFailure([res.message]));
      else if (res.success && res.message) {
        dispatch(updateUserPasswordSuccess(res.message));
      }
    } catch (error) {
      dispatch(updateUserPasswordFailure(error));
    }
  };
};

const reset_password_update = () => {
  return {
    type: RESET_PASSWORD_UPDATE,
  };
};

const removeUserRequest = () => {
  return {
    type: REMOVE_USER_REQUEST,
  };
};

const removeUserFailure = (error) => {
  return {
    type: REMOVE_USER_FAILURE,
    payload: error,
  };
};

const removeUserSuccess = (message) => {
  return {
    type: REMOVE_USER_SUCCESS,
    payload: message,
  };
};

const removeUserData = () => {
  return async (dispatch) => {
    dispatch(removeUserRequest());
    try {
      const id = localStorage.getItem("id");
      const res = await deleteUser(id);
      console.log("delete");
      if (!res.success && res.message)
        dispatch(removeUserFailure([res.message]));
      else {
        dispatch(removeUserSuccess(res.message));
        localStorage.removeItem("accessToken");
        localStorage.removeItem("id");
        localStorage.removeItem("username");
        localStorage.removeItem("profilePicture");
        localStorage.removeItem("isGoogleAcc");
        localStorage.removeItem("errorExpireTime");
        localStorage.removeItem("expiresAt");
        window.location.href = "/login";
      }
    } catch (error) {
      dispatch(removeUserFailure(error));
    }
  };
};

const updateProfilePictureRequest = () => {
  return {
    type: UPDATE_PROFILE_PICTURE_REQUEST,
  };
};

const updateProfilePictureSuccess = (message, profilePicture) => {
  return {
    type: UPDATE_PROFILE_PICTURE_SUCCESS,
    payload: {
      message,
      profilePicture,
    },
  };
};

const updateProfilePictureFailure = (error) => {
  return {
    type: UPDATE_PROFILE_PICTURE_FAILURE,
    payload: {
      error,
    },
  };
};

const updateProfilePicture = (formData) => {
  return async (dispatch) => {
    dispatch(updateProfilePictureRequest());
    try {
      await api.post(
        `/users/${localStorage.getItem("id")}/profile-picture`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const res = await api.get(
        `/users/${localStorage.getItem("id")}/profile-picture`
      );
      const profilePicture = res.data.data.profilePictureUrl;
      localStorage.setItem("profilePicture", profilePicture);
      dispatch(
        updateProfilePictureSuccess(
          "Profile picture updated successfully!",
          profilePicture
        )
      );
    } catch (err) {
      dispatch(updateProfilePictureFailure(err));
    }
  };
};

const deleteProfilePicRequest = () => {
  return {
    type: DELETE_PROFILE_PIC_REQUEST,
  };
};

const deleteProfilePicSuccess = (profilePic, message, success) => {
  return {
    type: DELETE_PROFILE_PIC_SUCCESS,
    payload: {
      message,
      success,
      profilePic
    },
  };
};

const deleteProfilePicFailure = (error) => {
  return {
    type: DELETE_PROFILE_PIC_FAILURE,
    payload: {
      error,
    },
  };
};

const deleteProfilePic = () => {
  return async (dispatch) => {
    dispatch(deleteProfilePicRequest());
    try {
      const id = localStorage.getItem("id");
      const res = await api.delete(`/users/${id}/profile-picture`);
      const defaultPic = "https://emedia1.nhs.wales/HEIW2/cache/file/F4C33EF0-69EE-4445-94018B01ADCF6FD4.png"
      console.log(res.data)
      dispatch(deleteProfilePicSuccess(defaultPic, res.data.message, res.data.success))
      localStorage.setItem("profilePicture", defaultPic)
      // dispatch(getUserData(id));
    } catch (error) {
      dispatch(deleteProfilePicFailure(error))
    }
  };
};

const resetUser = () => {
  return {
    type: RESET_USER,
  };
};

const clearMessages = () => {
  return {
    type: CLEAR_MESSAGES,
  };
};
export {
  getUserData,
  resetUser,
  updateUserData,
  updateUserPassword,
  removeUserData,
  reset_password_update,
  updateProfilePicture,
  clearMessages,
  deleteProfilePic
};
