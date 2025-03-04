import {
    deleteUser,
    getUser,
    updatePassword,
    updateUser,
} from "../../services/users";
import {
    GET_USER_FAILURE,
    GET_USER_REQUEST,
    GET_USER_SUCCESS,
    REMOVE_USER_FAILURE,
    REMOVE_USER_REQUEST,
    REMOVE_USER_SUCCESS,
    RESET_USER,
    UPDATE_USER_FAILURE,
    UPDATE_USER_PASSWORD_FAILURE,
    UPDATE_USER_PASSWORD_REQUEST,
    UPDATE_USER_PASSWORD_SUCCESS,
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
            if (!res.success && res.message)
                dispatch(updateUserPasswordFailure([res.message]));
            else if (res.success && res.message)
                dispatch(updateUserPasswordSuccess(res.message));
        } catch (error) {
            dispatch(updateUserPasswordFailure(error));
        }
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
            if (!res.success && res.message)
                dispatch(removeUserFailure([res.message]));
            else
              dispatch(removeUserSuccess(res.message));
        } catch (error) {
            dispatch(removeUserFailure(error));
        }
    };
};

const resetUser = () => {
    return {
        type: RESET_USER,
    };
};

export {
    getUserData,
    resetUser,
    updateUserData,
    updateUserPassword,
    removeUserData,
};
