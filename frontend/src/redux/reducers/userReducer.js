import {
    GET_USER_FAILURE,
    GET_USER_REQUEST,
    GET_USER_SUCCESS,
    RESET_USER,
} from "../types/userTypes";

const initialState = {
    user: null,
    error: null,
    loading: false,
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_USER_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_USER_SUCCESS:
            return { loading: false, error: null, user: action.payload };
        case GET_USER_FAILURE:
            return { loading: false, error: action.payload, user: null };
        case RESET_USER:
            return initialState;
        default:
            return state;
    }
};

export default userReducer;
